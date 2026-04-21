import { ponder } from "ponder:registry";
import {
  bounties,
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

// PositionBountyCreated — emitted by BountyManagementLib for position-based bounties
ponder.on(
  "ENBBountyContract:PositionBountyCreated",
  async ({ event, context }) => {
    const database = context.db;
    const {
      id,
      issuer,
      name,
      description,
      totalAmount,
      positionCount,
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
    const amountSort = Number(formatUnits(totalAmount, decimals));

    const reviewPeriod = await context.client
      .readContract({
        abi: [
          {
            name: "getBountyReviewPeriod",
            type: "function",
            stateMutability: "view",
            inputs: [{ name: "bountyId", type: "uint256" }],
            outputs: [{ type: "uint256" }],
          },
        ],
        address: event.log.address,
        functionName: "getBountyReviewPeriod",
        args: [id],
      })
      .catch(() => 0n);

    await database.insert(bounties).values({
      id: Number(id),
      chainId,
      title: name,
      description,
      amount: totalAmount.toString(),
      amountSort,
      issuer,
      maxWinners: Number(positionCount),
      winnersCount: 0,
      tokenType: tokenTypeNum,
      tokenAddress: tokenAddress || null,
      isPositionBased: true,
      createdAt,
      deadline,
      reviewPeriod: reviewPeriod as bigint,
    });

    // Upsert supported token metadata (position bounties are always ERC20)
    if (tokenAddress) {
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
    }

    await database
      .insert(transactions)
      .values({
        index: transactionIndex,
        tx: hash,
        address: issuer,
        bountyId: Number(id),
        action: `position bounty created (${
          tokenTypeNum === 1 ? "USDC" : "ENB"
        }, ${Number(positionCount)} positions)`,
        chainId,
        timestamp,
      })
      .onConflictDoNothing();

    // Upsert leaderboard — increment paid
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
        paid: amountSort,
      });

    const existingLb = await database.sql
      .select()
      .from(leaderboard)
      .where(
        and(eq(leaderboard.address, issuer), eq(leaderboard.chainId, chainId)),
      )
      .limit(1);
    if (existingLb[0] && (existingLb[0].paid ?? 0) !== amountSort) {
      await database
        .update(leaderboard, { address: issuer, chainId })
        .set({ paid: (existingLb[0].paid ?? 0) + amountSort });
    }
  },
);

// PositionClaimAccepted — emitted by ClaimManagementLib for position-based claims
ponder.on(
  "ENBBountyContract:PositionClaimAccepted",
  async ({ event, context }) => {
    const database = context.db;
    const { bountyId, claimer, bountyIssuer, positionIndex, positionAmount } =
      event.args;
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
    const amountSort = Number(formatUnits(positionAmount, decimals));
    const maxWinners = bountyRow.maxWinners || 1;

    const newWinnersCount = Math.min(
      (bountyRow.winnersCount || 0) + 1,
      maxWinners,
    );
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
        amount: positionAmount.toString(),
        positionIndex: Number(positionIndex),
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
        action: `position claim accepted (${
          Number(positionIndex) + 1
        }${getOrdinalSuffix(Number(positionIndex) + 1)} place, winner ${newWinnersCount}/${maxWinners})`,
        chainId,
        timestamp,
      })
      .onConflictDoNothing();
  },
);

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] ?? s[v] ?? "th";
}
