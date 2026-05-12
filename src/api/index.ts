import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { and, eq, gte, graphql, desc, count as drizzleCount } from "ponder";

// Serialize BigInt values as strings in JSON responses
function serialize(data: unknown): any {
  if (data === null || data === undefined) return data;
  if (typeof data === "bigint") return data.toString();
  if (Array.isArray(data)) return data.map(serialize);
  if (typeof data === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = serialize(value);
    }
    return result;
  }
  return data;
}

const app = new Hono();

app.use("/graphql", graphql({ db, schema }));

// All bounties for a chain
app.get("/bounty/:chainId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);

  const result = await db
    .select()
    .from(schema.bounties)
    .where(eq(schema.bounties.chainId, chainId))
    .orderBy((bounty) => bounty.id);

  return c.json(serialize(result));
});

// Single bounty by id
app.get("/bounty/:chainId/:bountyId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);
  const bountyId = Number(c.req.param("bountyId"));

  const result = await db
    .select()
    .from(schema.bounties)
    .where(
      and(
        eq(schema.bounties.chainId, chainId),
        eq(schema.bounties.id, bountyId),
      ),
    );

  return c.json(serialize(result[0]));
});


// Live (in-progress) bounties
app.get("/live/bounty/:chainId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);

  const result = await db
    .select()
    .from(schema.bounties)
    .where(
      and(
        eq(schema.bounties.chainId, chainId),
        eq(schema.bounties.inProgress, true),
      ),
    );

  return c.json(serialize(result));
});

// Past (completed, not canceled) bounties
app.get("/past/bounty/:chainId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);

  const result = await db
    .select()
    .from(schema.bounties)
    .where(
      and(
        eq(schema.bounties.chainId, chainId),
        eq(schema.bounties.inProgress, false),
        eq(schema.bounties.isCanceled, false),
      ),
    );

  return c.json(serialize(result));
});


// Bounty winners
app.get("/bounty/:chainId/:bountyId/winners", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);
  const bountyId = Number(c.req.param("bountyId") ?? 0);

  const result = await db
    .select()
    .from(schema.bountyWinners)
    .where(
      and(
        eq(schema.bountyWinners.chainId, chainId),
        eq(schema.bountyWinners.bountyId, bountyId),
      ),
    )
    .orderBy((winner) => winner.timestamp);

  return c.json(serialize(result));
});

// Bounties by token type
app.get("/bounty/:chainId/token/:tokenType", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);
  const tokenType = Number(c.req.param("tokenType") ?? 0);

  const result = await db
    .select()
    .from(schema.bounties)
    .where(
      and(
        eq(schema.bounties.chainId, chainId),
        eq(schema.bounties.tokenType, tokenType),
      ),
    )
    .orderBy(desc(schema.bounties.id));

  return c.json(serialize(result));
});

// Supported tokens
app.get("/tokens/:chainId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);

  const result = await db
    .select()
    .from(schema.supportedTokens)
    .where(eq(schema.supportedTokens.chainId, chainId));

  return c.json(serialize(result));
});

// Bounties created by a specific issuer
// Supports query params: ?chainId=8453&completed=true&minAmount=100
app.get("/user/:address/bounties", async (c) => {
  const issuer = c.req.param("address")?.toLowerCase();
  if (!issuer) {
    return c.json({ error: "Invalid address" }, 400);
  }

  const chainIdParam = c.req.query("chainId");
  const completed = c.req.query("completed");
  const minAmountParam = c.req.query("minAmount");

  const conditions = [eq(schema.bounties.issuer, issuer as `0x${string}`)];

  if (chainIdParam) {
    conditions.push(eq(schema.bounties.chainId, Number(chainIdParam)));
  }
  if (completed === "true") {
    conditions.push(eq(schema.bounties.inProgress, false));
    conditions.push(eq(schema.bounties.isCanceled, false));
    conditions.push(gte(schema.bounties.winnersCount, 1));
  }
  if (minAmountParam) {
    conditions.push(gte(schema.bounties.amountSort, Number(minAmountParam)));
  }

  const result = await db
    .select()
    .from(schema.bounties)
    .where(and(...conditions));

  return c.json(serialize(result));
});

// Count bounties created by an issuer (lightweight, returns only count)
app.get("/user/:address/bounties/count", async (c) => {
  const issuer = c.req.param("address")?.toLowerCase();
  if (!issuer) {
    return c.json({ error: "Invalid address" }, 400);
  }

  const chainIdParam = c.req.query("chainId");
  const completed = c.req.query("completed");
  const minAmountParam = c.req.query("minAmount");

  const conditions = [eq(schema.bounties.issuer, issuer as `0x${string}`)];

  if (chainIdParam) {
    conditions.push(eq(schema.bounties.chainId, Number(chainIdParam)));
  }
  if (completed === "true") {
    conditions.push(eq(schema.bounties.inProgress, false));
    conditions.push(eq(schema.bounties.isCanceled, false));
    conditions.push(gte(schema.bounties.winnersCount, 1));
  }
  if (minAmountParam) {
    conditions.push(gte(schema.bounties.amountSort, Number(minAmountParam)));
  }

  const result = await db
    .select({ count: drizzleCount() })
    .from(schema.bounties)
    .where(and(...conditions));

  return c.json({ count: result[0]?.count ?? 0 });
});

// User wins
app.get("/user/:address/wins/:chainId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);
  const userAddress = c.req.param("address")?.toLowerCase();

  if (!userAddress) {
    return c.json({ error: "Invalid address" }, 400);
  }

  const result = await db
    .select()
    .from(schema.bountyWinners)
    .where(
      and(
        eq(schema.bountyWinners.chainId, chainId),
        eq(schema.bountyWinners.winner, userAddress as `0x${string}`),
      ),
    )
    .orderBy(desc(schema.bountyWinners.timestamp));

  return c.json(serialize(result));
});

// ── Task Rewards: Daily Config ────────────────────────────────────────
app.get("/task-rewards/daily/config/:chainId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);

  const result = await db
    .select()
    .from(schema.dailyRewardConfig)
    .where(eq(schema.dailyRewardConfig.chainId, chainId));

  return c.json(serialize(result[0] ?? null));
});

// ── Task Rewards: Daily Claims for a user ─────────────────────────────
app.get("/task-rewards/daily/claims/:chainId/:user", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);
  const userAddress = c.req.param("user")?.toLowerCase();
  if (!userAddress) return c.json({ error: "Invalid address" }, 400);

  const result = await db
    .select()
    .from(schema.dailyRewardClaims)
    .where(
      and(
        eq(schema.dailyRewardClaims.chainId, chainId),
        eq(schema.dailyRewardClaims.user, userAddress as `0x${string}`),
      ),
    )
    .orderBy(desc(schema.dailyRewardClaims.timestamp));

  return c.json(serialize(result));
});

// ── Task Rewards: Partner Tasks list ──────────────────────────────────
app.get("/task-rewards/partner/:chainId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);
  const status = c.req.query("status"); // active | cancelled | completed

  const conditions = [eq(schema.partnerTasks.chainId, chainId)];

  if (status === "cancelled") {
    conditions.push(eq(schema.partnerTasks.cancelled, true));
  } else if (status === "active") {
    conditions.push(eq(schema.partnerTasks.cancelled, false));
  }

  const result = await db
    .select()
    .from(schema.partnerTasks)
    .where(and(...conditions))
    .orderBy(desc(schema.partnerTasks.createdAt));

  return c.json(serialize(result));
});

// ── Task Rewards: Single Partner Task ─────────────────────────────────
app.get("/task-rewards/partner/:chainId/:taskId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);
  const taskId = Number(c.req.param("taskId"));

  const result = await db
    .select()
    .from(schema.partnerTasks)
    .where(
      and(
        eq(schema.partnerTasks.chainId, chainId),
        eq(schema.partnerTasks.id, taskId),
      ),
    );

  return c.json(serialize(result[0] ?? null));
});

// ── Task Rewards: Partner Task Claims ─────────────────────────────────
app.get("/task-rewards/partner/:chainId/:taskId/claims", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);
  const taskId = Number(c.req.param("taskId"));

  const result = await db
    .select()
    .from(schema.partnerTaskClaims)
    .where(
      and(
        eq(schema.partnerTaskClaims.chainId, chainId),
        eq(schema.partnerTaskClaims.taskId, taskId),
      ),
    )
    .orderBy(desc(schema.partnerTaskClaims.timestamp));

  return c.json(serialize(result));
});

export default app;
