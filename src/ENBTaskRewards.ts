import { ponder } from "ponder:registry";
import {
  users,
  dailyRewardConfig,
  dailyRewardClaims,
  partnerTasks,
  partnerTaskClaims,
} from "../ponder.schema";
import { and, eq } from "ponder";

// ── DailyRewardConfigUpdated ──────────────────────────────────────────
ponder.on(
  "ENBTaskRewardsContract:DailyRewardConfigUpdated",
  async ({ event, context }) => {
    const database = context.db;
    const { token, amount, isActive } = event.args;
    const { timestamp } = event.block;
    const chainId = Number(context.chain?.id ?? 0);

    await database
      .insert(dailyRewardConfig)
      .values({
        chainId,
        token,
        amount: amount.toString(),
        isActive,
        updatedAt: timestamp,
      })
      .onConflictDoUpdate({
        token,
        amount: amount.toString(),
        isActive,
        updatedAt: timestamp,
      });
  },
);

// ── DailyPoolFunded ───────────────────────────────────────────────────
ponder.on(
  "ENBTaskRewardsContract:DailyPoolFunded",
  async ({ event, context }) => {
    const database = context.db;
    const { funder } = event.args;

    // Upsert user
    await database
      .insert(users)
      .values({ address: funder })
      .onConflictDoNothing();
  },
);

// ── DailyRewardClaimed ────────────────────────────────────────────────
ponder.on(
  "ENBTaskRewardsContract:DailyRewardClaimed",
  async ({ event, context }) => {
    const database = context.db;
    const { user, token, amount, timestamp: claimTimestamp } = event.args;
    const { hash } = event.transaction;
    const chainId = Number(context.chain?.id ?? 0);

    await database
      .insert(users)
      .values({ address: user })
      .onConflictDoNothing();

    await database
      .insert(dailyRewardClaims)
      .values({
        tx: hash,
        chainId,
        user,
        token,
        amount: amount.toString(),
        timestamp: claimTimestamp,
      })
      .onConflictDoNothing();
  },
);

// ── PartnerTaskCreated ────────────────────────────────────────────────
ponder.on(
  "ENBTaskRewardsContract:PartnerTaskCreated",
  async ({ event, context }) => {
    const database = context.db;
    const {
      taskId,
      creator,
      token,
      totalAmount,
      amountPerWinner,
      maxWinners,
      deadline,
      fee,
    } = event.args;
    const { timestamp } = event.block;
    const chainId = Number(context.chain?.id ?? 0);

    await database
      .insert(users)
      .values({ address: creator })
      .onConflictDoNothing();

    await database
      .insert(partnerTasks)
      .values({
        id: Number(taskId),
        chainId,
        creator,
        token,
        totalAmount: totalAmount.toString(),
        amountPerWinner: amountPerWinner.toString(),
        maxWinners: Number(maxWinners),
        claimedCount: 0,
        deadline: BigInt(deadline),
        cancelled: false,
        fee: fee.toString(),
        createdAt: timestamp,
      })
      .onConflictDoNothing();
  },
);

// ── PartnerTaskClaimed ────────────────────────────────────────────────
ponder.on(
  "ENBTaskRewardsContract:PartnerTaskClaimed",
  async ({ event, context }) => {
    const database = context.db;
    const { taskId, user, token, amount } = event.args;
    const { hash } = event.transaction;
    const { timestamp } = event.block;
    const chainId = Number(context.chain?.id ?? 0);

    await database
      .insert(users)
      .values({ address: user })
      .onConflictDoNothing();

    await database
      .insert(partnerTaskClaims)
      .values({
        taskId: Number(taskId),
        chainId,
        user,
        token,
        amount: amount.toString(),
        timestamp,
        tx: hash,
      })
      .onConflictDoNothing();

    // Increment claimedCount on the partner task
    const existing = await database.sql
      .select()
      .from(partnerTasks)
      .where(
        and(
          eq(partnerTasks.id, Number(taskId)),
          eq(partnerTasks.chainId, chainId),
        ),
      )
      .limit(1);

    if (existing[0]) {
      await database
        .update(partnerTasks, { id: Number(taskId), chainId })
        .set({ claimedCount: (existing[0].claimedCount ?? 0) + 1 });
    }
  },
);

// ── PartnerTaskCancelled ──────────────────────────────────────────────
ponder.on(
  "ENBTaskRewardsContract:PartnerTaskCancelled",
  async ({ event, context }) => {
    const database = context.db;
    const { taskId } = event.args;
    const chainId = Number(context.chain?.id ?? 0);

    await database
      .update(partnerTasks, { id: Number(taskId), chainId })
      .set({ cancelled: true });
  },
);
