import { ponder } from "ponder:registry";
import {
  bounties,
  claims,
  users,
  transactions,
  leaderboard,
  bountyWinners,
  supportedTokens,
} from "../ponder.schema";
import { formatUnits } from "viem";
import { and, eq } from "ponder";

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

// TokenBountyCreated — emitted by BountyManagementLib for every bounty creation
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
      deadline,
    } = event.args;
    const { hash, transactionIndex } = event.transaction;
    const { timestamp } = event.block;
    const chainId = Number(context.chain?.id ?? 0);

    await database
      .insert(users)
      .values({ address: issuer })
      .onConflictDoNothing();

    const tokenTypeNum = Number(tokenType);
    const decimals = getTokenDecimals(tokenTypeNum);
    const amountSort = Number(formatUnits(amount, decimals));

    await database.insert(bounties).values({
      id: Number(id),
      chainId,
      title: name,
      description,
      amount: amount.toString(),
      amountSort,
      issuer,
      maxWinners: Number(maxWinners),
      winnersCount: 0,
      tokenType: tokenTypeNum,
      tokenAddress: tokenAddress || null,
      createdAt,
      deadline,
    });

    // Upsert supported token metadata
    if (tokenTypeNum !== 0 && tokenAddress) {
      const [symbol, decimalsRead, nameRead] = await Promise.all([
        context.client
          .readContract({
            abi: [
              {
                name: "symbol",
                type: "function",
                stateMutability: "view",
                inputs: [],
                outputs: [{ type: "string" }],
              },
            ],
            address: tokenAddress as `0x${string}`,
            functionName: "symbol",
          })
          .catch(() => "TOKEN"),
        context.client
          .readContract({
            abi: [
              {
                name: "decimals",
                type: "function",
                stateMutability: "view",
                inputs: [],
                outputs: [{ type: "uint8" }],
              },
            ],
            address: tokenAddress as `0x${string}`,
            functionName: "decimals",
          })
          .catch(() => getTokenDecimals(tokenTypeNum)),
        context.client
          .readContract({
            abi: [
              {
                name: "name",
                type: "function",
                stateMutability: "view",
                inputs: [],
                outputs: [{ type: "string" }],
              },
            ],
            address: tokenAddress as `0x${string}`,
            functionName: "name",
          })
          .catch(() => (tokenTypeNum === 1 ? "USD Coin" : "ENB Token")),
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
      await database
        .insert(supportedTokens)
        .values({
          address: "0x0000000000000000000000000000000000000000",
          chainId,
          tokenType: 0,
          symbol: "ETH",
          decimals: 18,
          name: "Ether",
        })
        .onConflictDoNothing();
    }

    await database
      .insert(transactions)
      .values({
        index: transactionIndex,
        tx: hash,
        address: issuer,
        bountyId: Number(id),
        action: `bounty created (${
          tokenTypeNum === 0 ? "ETH" : tokenTypeNum === 1 ? "USDC" : "ENB"
        })`,
        chainId,
        timestamp,
      })
      .onConflictDoNothing();

    // Upsert leaderboard — increment paid with single upsert
    await database
      .insert(leaderboard)
      .values({
        address: issuer,
        chainId,
        paid: amountSort,
        earned: 0,
        nfts: 0,
      })
      .onConflictDoUpdate({
        paid: amountSort, // Will be corrected below
      });

    // Read current and set proper incremented value
    const existingLb = await database.sql
      .select()
      .from(leaderboard)
      .where(
        and(eq(leaderboard.address, issuer), eq(leaderboard.chainId, chainId)),
      )
      .limit(1);
    if (existingLb[0] && (existingLb[0].paid ?? 0) !== amountSort) {
      // Only update if this wasn't a fresh insert
      await database
        .update(leaderboard, { address: issuer, chainId })
        .set({ paid: (existingLb[0].paid ?? 0) + amountSort });
    }
  },
);

// SupportedTokenAdded
ponder.on(
  "ENBBountyContract:SupportedTokenAdded",
  async ({ event, context }) => {
    const database = context.db;
    const chainId = Number(context.chain?.id ?? 0);
    const { token, tokenType } = event.args;

    const [symbol, decimalsRead, nameRead] = await Promise.all([
      context.client
        .readContract({
          abi: [
            {
              name: "symbol",
              type: "function",
              stateMutability: "view",
              inputs: [],
              outputs: [{ type: "string" }],
            },
          ],
          address: token,
          functionName: "symbol",
        })
        .catch(() => (Number(tokenType) === 1 ? "USDC" : "ENB")),
      context.client
        .readContract({
          abi: [
            {
              name: "decimals",
              type: "function",
              stateMutability: "view",
              inputs: [],
              outputs: [{ type: "uint8" }],
            },
          ],
          address: token,
          functionName: "decimals",
        })
        .catch(() => getTokenDecimals(Number(tokenType))),
      context.client
        .readContract({
          abi: [
            {
              name: "name",
              type: "function",
              stateMutability: "view",
              inputs: [],
              outputs: [{ type: "string" }],
            },
          ],
          address: token,
          functionName: "name",
        })
        .catch(() => (Number(tokenType) === 1 ? "USD Coin" : "ENB Token")),
    ]);

    await database
      .insert(supportedTokens)
      .values({
        address: token,
        chainId,
        tokenType: Number(tokenType),
        symbol: String(symbol),
        decimals: Number(decimalsRead),
        name: String(nameRead),
      })
      .onConflictDoUpdate({
        symbol: String(symbol),
        decimals: Number(decimalsRead),
        name: String(nameRead),
        tokenType: Number(tokenType),
      });
  },
);

// SupportedTokenRemoved
ponder.on(
  "ENBBountyContract:SupportedTokenRemoved",
  async ({ event, context }) => {
    const database = context.db;
    const chainId = Number(context.chain?.id ?? 0);
    const { token } = event.args;

    await database.delete(supportedTokens, { address: token, chainId });
  },
);

// BountyCancelled
ponder.on(
  "ENBBountyContract:BountyCancelled",
  async ({ event, context }) => {
    const database = context.db;
    const { bountyId, issuer } = event.args;
    const { hash, transactionIndex } = event.transaction;
    const { timestamp } = event.block;
    const chainId = Number(context.chain?.id ?? 0);

    await database
      .update(bounties, { id: Number(bountyId), chainId })
      .set({ isCanceled: true, inProgress: false });

    await database
      .insert(transactions)
      .values({
        index: transactionIndex,
        tx: hash,
        address: issuer,
        bountyId: Number(bountyId),
        action: "bounty canceled",
        chainId,
        timestamp,
      })
      .onConflictDoNothing();
  },
);

// ClaimAccepted — signature: (bountyId, claimer, bountyIssuer, fee)
ponder.on(
  "ENBBountyContract:ClaimAccepted",
  async ({ event, context }) => {
    const database = context.db;
    const { bountyId, claimer, bountyIssuer } = event.args;
    const { hash, transactionIndex } = event.transaction;
    const { timestamp } = event.block;
    const chainId = Number(context.chain?.id ?? 0);

    await database
      .insert(users)
      .values({ address: claimer })
      .onConflictDoNothing();

    const bountyRows = await database.sql
      .select()
      .from(bounties)
      .where(
        and(
          eq(bounties.id, Number(bountyId)),
          eq(bounties.chainId, chainId),
        ),
      )
      .limit(1);

    if (!bountyRows[0]) return;

    const bountyRow = bountyRows[0];
    const tokenType = bountyRow.tokenType || 0;
    const decimals = getTokenDecimals(tokenType);
    const totalAmount = BigInt(bountyRow.amount);
    const maxWinners = bountyRow.maxWinners || 1;
    const winnerAmount = totalAmount / BigInt(maxWinners);
    const amountSort = Number(formatUnits(winnerAmount, decimals));

    const newWinnersCount = Math.min((bountyRow.winnersCount || 0) + 1, maxWinners);
    const isComplete = newWinnersCount >= maxWinners;

    await database
      .update(bounties, { id: Number(bountyId), chainId })
      .set({ winnersCount: newWinnersCount, inProgress: !isComplete });

    await database
      .insert(bountyWinners)
      .values({
        bountyId: Number(bountyId),
        chainId,
        winner: claimer,
        amount: winnerAmount.toString(),
        timestamp,
      })
      .onConflictDoNothing();

    // Upsert leaderboard for winner
    await database
      .insert(leaderboard)
      .values({
        address: claimer,
        chainId,
        earned: amountSort,
        paid: 0,
        nfts: 1,
      })
      .onConflictDoNothing();

    const existingLb = await database.sql
      .select()
      .from(leaderboard)
      .where(
        and(
          eq(leaderboard.address, claimer),
          eq(leaderboard.chainId, chainId),
        ),
      )
      .limit(1);
    if (existingLb[0]) {
      await database
        .update(leaderboard, { address: claimer, chainId })
        .set({
          earned: (existingLb[0].earned ?? 0) + amountSort,
          nfts: (existingLb[0].nfts ?? 0) + 1,
        });
    }

    await database
      .insert(transactions)
      .values({
        index: transactionIndex,
        tx: hash,
        address: bountyIssuer ?? bountyRow.issuer,
        bountyId: Number(bountyId),
        action: `claim accepted (winner ${newWinnersCount}/${maxWinners})`,
        chainId,
        timestamp,
      })
      .onConflictDoNothing();
  },
);

// BatchClaimsAccepted — signature: (bountyId, claimers, totalFee)
// NOTE: The contract also emits individual ClaimAccepted events per claimer
// in the same transaction (ClaimManagementLib.sol:136). Those handlers already
// update winnersCount, bountyWinners, and leaderboard. This handler only
// inserts the batch transaction log to avoid double-counting.
ponder.on(
  "ENBBountyContract:BatchClaimsAccepted",
  async ({ event, context }) => {
    const database = context.db;
    const { bountyId, claimers } = event.args;
    const { hash, transactionIndex } = event.transaction;
    const { timestamp } = event.block;
    const chainId = Number(context.chain?.id ?? 0);

    const bountyRows = await database.sql
      .select()
      .from(bounties)
      .where(
        and(
          eq(bounties.id, Number(bountyId)),
          eq(bounties.chainId, chainId),
        ),
      )
      .limit(1);

    if (!bountyRows[0]) return;

    await database
      .insert(transactions)
      .values({
        index: transactionIndex,
        tx: hash,
        address: bountyRows[0].issuer,
        bountyId: Number(bountyId),
        action: `batch claims accepted (${claimers.length} winners)`,
        chainId,
        timestamp,
      })
      .onConflictDoNothing();
  },
);
