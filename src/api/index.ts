import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { and, eq, graphql, desc } from "ponder";

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

export default app;
