import { ponder } from "ponder:registry";
import {
  bounties,
  claims,
  participationsBounties,
  users,
  transactions,
  leaderboard,
  bountyWinners,
  votes,
  supportedTokens,
} from "../ponder.schema";
import { formatEther, formatUnits } from "viem";
import { sql, and, eq } from "ponder";

// Helper function to get token decimals based on type
function getTokenDecimals(tokenType: number): number {
  switch (tokenType) {
    case 1: // USDC
      return 6;
    case 2: // ENB
      return 18;
    default: // ETH
      return 18;
  }
}

// Handle both TokenBountyCreated and BountyCreatedWithMaxWinners events
ponder.on(
  "ENBBountyContract:TokenBountyCreated",
  async ({ event, context }) => {
    const database = context.db;
    const {
      id,
      issuer,
      name,
      description,
      amount,
      maxWinners,
      tokenType,
      tokenAddress,
      createdAt,
    } = event.args;
    const { hash, transactionIndex } = event.transaction;
    const { timestamp } = event.block;
    const chainId = Number(context.chain?.id ?? 0);

    await database
      .insert(users)
      .values({ address: issuer })
      .onConflictDoNothing();

    // Determine if it's multiplayer based on participants
    const isMultiplayer = false; // Will be updated when someone joins

    // Format amount based on token type
    const tokenTypeNum = Number(tokenType);
    const decimals = getTokenDecimals(tokenTypeNum);
    const amountSort = Number(formatUnits(amount, decimals));

    await database.insert(bounties).values({
      id: Number(id),
      chainId,
      title: name,
      description: description,
      amount: amount.toString(),
      amountSort,
      issuer,
      isMultiplayer,
      maxWinners: Number(maxWinners),
      winnersCount: 0,
      tokenType: tokenTypeNum,
      tokenAddress: tokenAddress || null,
    });

    // Upsert supported token metadata (for token bounties)
    try {
      if (tokenTypeNum !== 0 && tokenAddress) {
        const [symbol, decimalsRead, nameRead] = await Promise.all([
          context.client.readContract({
            abi: [
              { name: 'symbol', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
            ],
            address: tokenAddress as `0x${string}`,
            functionName: 'symbol',
          }).catch(() => 'TOKEN'),
          context.client.readContract({
            abi: [
              { name: 'decimals', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint8' }] },
            ],
            address: tokenAddress as `0x${string}`,
            functionName: 'decimals',
          }).catch(() => getTokenDecimals(tokenTypeNum)),
          context.client.readContract({
            abi: [
              { name: 'name', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'string' }] },
            ],
            address: tokenAddress as `0x${string}`,
            functionName: 'name',
          }).catch(() => (tokenTypeNum === 1 ? 'USD Coin' : 'ENB Token')),
        ]);

        await database
          .insert(supportedTokens)
          .values({
            address: tokenAddress as `0x${string}`,
            chainId,
            tokenType: tokenTypeNum,
            symbol: String(symbol),
            decimals: Number(decimalsRead),
            name: String(nameRead),
          })
          .onConflictDoUpdate({
            symbol: String(symbol),
            decimals: Number(decimalsRead),
            name: String(nameRead),
            tokenType: tokenTypeNum,
          });
      } else {
        // Ensure ETH appears as a supported token.
        await database
          .insert(supportedTokens)
          .values({
            address: '0x0000000000000000000000000000000000000000',
            chainId,
            tokenType: 0,
            symbol: 'ETH',
            decimals: 18,
            name: 'Ether',
          })
          .onConflictDoNothing();
      }
    } catch {}

    // Track initial participation for solo bounties
    await database.insert(participationsBounties).values({
      userAddress: issuer,
      bountyId: Number(id),
      amount: amount.toString(),
      chainId,
    });

    await database.insert(transactions).values({
      index: transactionIndex,
      tx: hash,
      address: issuer,
      bountyId: Number(id),
      action: `bounty created (${ 
        tokenTypeNum === 0 ? "ETH" : tokenTypeNum === 1 ? "USDC" : "ENB"
      })`,
      chainId,
      timestamp,
    }).onConflictDoNothing();

    // Update leaderboard (increment paid)
    await database
      .insert(leaderboard)
      .values({
        address: issuer,
        chainId,
        paid: amountSort,
        earned: 0,
        nfts: 0,
      })
      .onConflictDoNothing();

    const existingLb1 = await database.sql
      .select()
      .from(leaderboard)
      .where(
        and(eq(leaderboard.address, issuer), eq(leaderboard.chainId, chainId))
      )
      .limit(1);
    const currentPaid1 = existingLb1[0]?.paid ?? 0;
    await database
      .update(leaderboard, { address: issuer, chainId })
      .set({ paid: currentPaid1 + amountSort });
  }
);


ponder.on("ENBBountyContract:BountyCancelled", async ({ event, context }) => {
  const database = context.db;
  const { bountyId, issuer } = event.args;
  const { hash, transactionIndex } = event.transaction;
  const { timestamp } = event.block;
  const chainId = Number(context.chain?.id ?? 0);

  await database
    .update(bounties, {
      id: Number(bountyId),
      chainId,
    })
    .set({
      isCanceled: true,
      inProgress: false,
    });

  await database.insert(transactions).values({
    index: transactionIndex,
    tx: hash,
    address: issuer,
    bountyId: Number(bountyId),
    action: `bounty canceled`,
    chainId,
    timestamp,
  }).onConflictDoNothing();
});

ponder.on("ENBBountyContract:BountyJoined", async ({ event, context }) => {
  const database = context.db;
  const { amount, participant, bountyId } = event.args;
  const { hash, transactionIndex } = event.transaction;
  const { timestamp } = event.block;
  const chainId = Number(context.chain?.id ?? 0);

  await database
    .insert(users)
    .values({ address: participant })
    .onConflictDoNothing();

  // Get bounty to determine token type
  const bountyRows = await database.sql
    .select()
    .from(bounties)
    .where(
      and(eq(bounties.id, Number(bountyId)), eq(bounties.chainId, chainId))
    )
    .limit(1);

  const currentBounty = bountyRows[0];
  
  // Skip if bounty doesn't exist (could be from different deployment or missing creation event)
  if (!currentBounty) {
    console.warn(`Bounty ${bountyId} not found when processing BountyJoined event, skipping...`);
    return;
  }

  const tokenType = currentBounty.tokenType || 0;
  const decimals = getTokenDecimals(tokenType);
  const amountSort = Number(formatUnits(amount, decimals));

  // Update bounty to be multiplayer
  const newAmount = (BigInt(currentBounty.amount) + BigInt(amount)).toString();
  const newAmountSort = currentBounty.amountSort + amountSort;
  
  await database
    .update(bounties, {
      id: Number(bountyId),
      chainId,
    })
    .set({
      isMultiplayer: true,
      amount: newAmount,
      amountSort: newAmountSort,
    });

  await database.insert(participationsBounties).values({
    userAddress: participant,
    bountyId: Number(bountyId),
    amount: amount.toString(),
    chainId,
  });

  await database.insert(transactions).values({
    index: transactionIndex,
    tx: hash,
    address: participant,
    bountyId: Number(bountyId),
    action: `joined bounty`,
    chainId,
    timestamp,
  }).onConflictDoNothing();

  await database
    .insert(leaderboard)
    .values({
      address: participant,
      chainId,
      paid: amountSort,
      earned: 0,
      nfts: 0,
    })
    .onConflictDoNothing();
  const existingLb3 = await database.sql
    .select()
    .from(leaderboard)
    .where(
      and(
        eq(leaderboard.address, participant),
        eq(leaderboard.chainId, chainId)
      )
    )
    .limit(1);
  const currentPaid3 = existingLb3[0]?.paid ?? 0;
  await database
    .update(leaderboard, { address: participant, chainId })
    .set({ paid: currentPaid3 + amountSort });
});

ponder.on(
  "ENBBountyContract:WithdrawFromOpenBounty",
  async ({ event, context }) => {
    const database = context.db;
    const { bountyId, participant, amount } = event.args;
    const { hash, transactionIndex } = event.transaction;
    const { timestamp } = event.block;
    const chainId = Number(context.chain?.id ?? 0);

    // Get bounty to determine token type
    const bountyRows2 = await database.sql
      .select()
      .from(bounties)
      .where(
        and(eq(bounties.id, Number(bountyId)), eq(bounties.chainId, chainId))
      )
      .limit(1);

    const currentBounty2 = bountyRows2[0];
    
    // Skip if bounty doesn't exist
    if (!currentBounty2) {
      console.warn(`Bounty ${bountyId} not found when processing WithdrawFromOpenBounty event, skipping...`);
      return;
    }

    const tokenType = currentBounty2.tokenType || 0;
    const decimals = getTokenDecimals(tokenType);
    const amountSort = Number(formatUnits(amount, decimals));

    // Update bounty amount
    const newAmount2 = (BigInt(currentBounty2.amount) - BigInt(amount)).toString();
    const newAmountSort2 = Math.max(0, currentBounty2.amountSort - amountSort);
    await database
      .update(bounties, {
        id: Number(bountyId),
        chainId,
      })
      .set({
        amount: newAmount2,
        amountSort: newAmountSort2,
      });

    // Remove participation
    await database.delete(participationsBounties, {
      userAddress: participant,
      bountyId: Number(bountyId),
      chainId,
    });

    await database.insert(transactions).values({
      index: transactionIndex,
      tx: hash,
      address: participant,
      bountyId: Number(bountyId),
      action: `withdrew from bounty`,
      chainId,
      timestamp,
    }).onConflictDoNothing();

    // Update leaderboard
    await database
      .update(leaderboard, {
        address: participant,
        chainId,
      })
      .set({
        paid: Math.max(
          0,
          (await (async () => {
            const lb = await database.sql
              .select()
              .from(leaderboard)
              .where(
                and(
                  eq(leaderboard.address, participant),
                  eq(leaderboard.chainId, chainId)
                )
              )
              .limit(1);
            return lb[0]?.paid ?? 0;
          })()) - amountSort
        ),
      });
  }
);

ponder.on("ENBBountyContract:ClaimCreated", async ({ event, context }) => {
  const database = context.db;
  // Library event signature:
  // (id, issuer, bountyId, bountyIssuer, name, description, createdAt)
  const args: any = event.args as any;
  const claimId = Number(args?.id ?? args?.[0]);
  const issuer = (args?.issuer ?? args?.[1]) as `0x${string}`;
  const bountyIdRaw = args?.bountyId ?? args?.[2];
  const bountyIdNum =
    typeof bountyIdRaw === 'bigint'
      ? Number(bountyIdRaw)
      : Number(bountyIdRaw);
  const title = (args?.name ?? args?.[4]) as string;
  const description = (args?.description ?? args?.[5]) as string;

  const { hash, transactionIndex } = event.transaction;
  const { timestamp } = event.block;
  const chainId = Number(context.chain?.id ?? 0);

  await database
    .insert(users)
    .values({ address: issuer })
    .onConflictDoNothing();

  // Ensure bounty exists (best-effort)
  const bountyRows = await database.sql
    .select()
    .from(bounties)
    .where(and(eq(bounties.id, bountyIdNum), eq(bounties.chainId, chainId)))
    .limit(1);

  // Insert claim regardless (keeps data flowing; UI can still show claims)
  await database
    .insert(claims)
    .values({
      id: claimId,
      chainId,
      title: title || '',
      description: description || '',
      url: '', // Not emitted; can be enriched separately
      issuer,
      isAccepted: false,
      bountyId: bountyIdNum,
      owner: issuer,
    })
    .onConflictDoNothing();

  await database
    .insert(transactions)
    .values({
      index: transactionIndex,
      tx: hash,
      address: issuer,
      bountyId: bountyIdNum,
      action: `claim created`,
      chainId,
      timestamp,
    })
    .onConflictDoNothing();
});

ponder.on("ENBBountyContract:ClaimAccepted", async ({ event, context }) => {
  const database = context.db;
  // From library event: (bountyId, claimId, claimIssuer, bountyIssuer, fee)
  const { bountyId, claimId, claimIssuer, bountyIssuer } = event.args as any;
  const { hash, transactionIndex } = event.transaction;
  const { timestamp } = event.block;
  const chainId = Number(context.chain?.id ?? 0);

  // Get claim and bounty details
  const claimRows = await database.sql
    .select()
    .from(claims)
    .where(and(eq(claims.id, Number(claimId)), eq(claims.chainId, chainId)))
    .limit(1);

  const bountyRows3 = await database.sql
    .select()
    .from(bounties)
    .where(
      and(eq(bounties.id, Number(bountyId)), eq(bounties.chainId, chainId))
    )
    .limit(1);

  if (claimRows[0] && bountyRows3[0]) {
    const winner = claimIssuer ?? claimRows[0].issuer;
    const tokenType = bountyRows3[0].tokenType || 0;
    const decimals = getTokenDecimals(tokenType);

    // Calculate winner amount (divided by maxWinners)
    const totalAmount = BigInt(bountyRows3[0].amount);
    const maxWinners = bountyRows3[0].maxWinners || 1;
    const winnerAmount = totalAmount / BigInt(maxWinners);
    const amountSort = Number(formatUnits(winnerAmount, decimals));

    // Update claim as accepted
    await database
      .update(claims, {
        id: Number(claimId),
        chainId,
      })
      .set({
        isAccepted: true,
      });

    // Update bounty winners count
    const newWinnersCount = (bountyRows3[0].winnersCount || 0) + 1;
    const isComplete = newWinnersCount >= maxWinners;

    await database
      .update(bounties, {
        id: Number(bountyId),
        chainId,
      })
      .set({
        winnersCount: newWinnersCount,
        inProgress: !isComplete,
      });

    // Add to bounty winners
    await database.insert(bountyWinners).values({
      bountyId: Number(bountyId),
      chainId,
      winner,
      claimId: Number(claimId),
      amount: winnerAmount.toString(),
      timestamp,
    }).onConflictDoNothing();

    // Update leaderboard
    await database
      .insert(leaderboard)
      .values({
        address: winner,
        chainId,
        earned: amountSort,
        paid: 0,
        nfts: 1,
      })
      .onConflictDoNothing();
    const existingLbWinner = await database.sql
      .select()
      .from(leaderboard)
      .where(
        and(eq(leaderboard.address, winner), eq(leaderboard.chainId, chainId))
      )
      .limit(1);
    const currentEarned = existingLbWinner[0]?.earned ?? 0;
    const currentNfts = existingLbWinner[0]?.nfts ?? 0;
    await database.update(leaderboard, { address: winner, chainId }).set({
      earned: currentEarned + amountSort,
      nfts: currentNfts + 1,
    });

    await database.insert(transactions).values({
      index: transactionIndex,
      tx: hash,
      address: bountyIssuer ?? bountyRows3[0].issuer,
      bountyId: Number(bountyId),
      action: `claim accepted (winner ${newWinnersCount}/${maxWinners})`,
      chainId,
      timestamp,
    }).onConflictDoNothing();
  }
});

ponder.on(
  "ENBBountyContract:ClaimSubmittedForVote",
  async ({ event, context }) => {
    const database = context.db;
    const { bountyId, claimId } = event.args;
    const { hash, transactionIndex } = event.transaction;
    const { timestamp } = event.block;
    const chainId = Number(context.chain?.id ?? 0);

    // Set bounty as in voting period
    await database
      .update(bounties, {
        id: Number(bountyId),
        chainId,
      })
      .set({
        isVoting: true,
        deadline: Number(timestamp) + 172800, // 2 days from now
      });

    await database.insert(transactions).values({
      index: transactionIndex,
      tx: hash,
      address: event.transaction.from,
      bountyId: Number(bountyId),
      action: `voting started for claim ${claimId}`,
      chainId,
      timestamp,
    });
  }
);

ponder.on("ENBBountyContract:VoteClaim", async ({ event, context }) => {
  const database = context.db;
  const { voter, bountyId, claimId } = event.args;
  const { hash, transactionIndex } = event.transaction;
  const { timestamp } = event.block;
  const chainId = Number(context.chain?.id ?? 0);

  await database.insert(users).values({ address: voter }).onConflictDoNothing();

  await database.insert(votes).values({
    bountyId: Number(bountyId),
    chainId,
    claimId: Number(claimId),
    voter,
    vote: true, // Assuming yes vote
    timestamp,
  }).onConflictDoNothing();

  await database.insert(transactions).values({
    index: transactionIndex,
    tx: hash,
    address: voter,
    bountyId: Number(bountyId),
    action: `voted on claim ${claimId}`,
    chainId,
    timestamp,
  }).onConflictDoNothing();
});

ponder.on("ENBBountyContract:VotingPeriodReset", async ({ event, context }) => {
  const database = context.db;
  const { bountyId } = event.args;
  const { hash, transactionIndex } = event.transaction;
  const { timestamp } = event.block;
  const chainId = Number(context.chain?.id ?? 0);

  await database
    .update(bounties, {
      id: Number(bountyId),
      chainId,
    })
    .set({
      isVoting: false,
      deadline: null,
    });

  await database.insert(transactions).values({
    index: transactionIndex,
    tx: hash,
    address: event.transaction.from,
    bountyId: Number(bountyId),
    action: `voting period reset`,
    chainId,
    timestamp,
  }).onConflictDoNothing();
});
