import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { and, eq, graphql, desc } from "ponder";
import { openAPI } from "./openAPI";
import { swaggerUI } from "@hono/swagger-ui";

const app = new Hono();

app.route("/openapi", openAPI);

app.use("/graphql", graphql({ db, schema }));

app.get("/swagger", swaggerUI({ url: "/openapi/doc" }));

app.get("/bounty/:chainId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);

  const bounties = await db
    .select()
    .from(schema.bounties)
    .where(eq(schema.bounties.chainId, chainId))
    .orderBy((bounty) => bounty.id);

  return c.json(bounties);
});

app.get("/bounty/:chainId/:bountyId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);
  const bountyId = Number(c.req.param("bountyId"));

  const bounty = await db
    .select()
    .from(schema.bounties)
    .where(
      and(
        eq(schema.bounties.chainId, chainId),
        eq(schema.bounties.id, bountyId)
      )
    );

  return c.json(bounty[0]);
});

app.get("/bounty/participations/:chainId/:bountyId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);
  const bountyId = Number(c.req.param("bountyId"));

  const participations = await db
    .select()
    .from(schema.participationsBounties)
    .where(
      and(
        eq(schema.participationsBounties.bountyId, bountyId),
        eq(schema.participationsBounties.chainId, chainId)
      )
    );

  return c.json(participations);
});

app.get("/bounty/claims/:chainId/:bountyId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);

  const bountyId = Number(c.req.param("bountyId") ?? 0);

  const claims = await db
    .select()
    .from(schema.claims)
    .where(
      and(
        eq(schema.claims.chainId, chainId),
        eq(schema.claims.bountyId, bountyId)
      )
    )
    .orderBy((claim) => claim.id);

  return c.json(claims);
});

app.get("/live/bounty/:chainId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);
  const bounty = await db
    .select()
    .from(schema.bounties)
    .where(
      and(
        eq(schema.bounties.chainId, chainId),
        eq(schema.bounties.inProgress, true),
        eq(schema.bounties.isVoting, false)
      )
    );

  return c.json(bounty);
});

app.get("/voting/bounty/:chainId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);

  const bounty = await db
    .select()
    .from(schema.bounties)
    .where(
      and(
        eq(schema.bounties.chainId, chainId),
        eq(schema.bounties.inProgress, true),
        eq(schema.bounties.isVoting, true)
      )
    );

  return c.json(bounty);
});

app.get("/past/bounty/:chainId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);

  const bounty = await db
    .select()
    .from(schema.bounties)
    .where(
      and(
        eq(schema.bounties.chainId, chainId),
        eq(schema.bounties.inProgress, false),
        eq(schema.bounties.isCanceled, false)
      )
    );

  return c.json(bounty);
});

app.get("/claim/:chainId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);

  const claims = await db
    .select()
    .from(schema.claims)
    .where(eq(schema.claims.chainId, chainId))
    .orderBy((claim) => claim.id);

  return c.json(claims);
});

app.get("/claim/:chainId/:claimId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);
  const claimId = Number(c.req.param("claimId"));

  const claim = await db
    .select()
    .from(schema.claims)
    .where(
      and(eq(schema.claims.chainId, chainId), eq(schema.claims.id, claimId))
    );

  return c.json(claim[0]);
});

// New endpoints for enhanced features

// Get bounty winners
app.get("/bounty/:chainId/:bountyId/winners", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);
  const bountyId = Number(c.req.param("bountyId") ?? 0);

  const winners = await db
    .select()
    .from(schema.bountyWinners)
    .where(
      and(
        eq(schema.bountyWinners.chainId, chainId),
        eq(schema.bountyWinners.bountyId, bountyId)
      )
    )
    .orderBy((winner) => winner.timestamp);

  return c.json(winners);
});

// Get votes for a bounty
app.get("/bounty/:chainId/:bountyId/votes", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);
  const bountyId = Number(c.req.param("bountyId") ?? 0);

  const votes = await db
    .select()
    .from(schema.votes)
    .where(
      and(
        eq(schema.votes.chainId, chainId),
        eq(schema.votes.bountyId, bountyId)
      )
    )
    .orderBy(desc(schema.votes.timestamp));

  return c.json(votes);
});

// Get bounties by token type
app.get("/bounty/:chainId/token/:tokenType", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);
  const tokenType = Number(c.req.param("tokenType") ?? 0);

  const bounties = await db
    .select()
    .from(schema.bounties)
    .where(
      and(
        eq(schema.bounties.chainId, chainId),
        eq(schema.bounties.tokenType, tokenType)
      )
    )
    .orderBy(desc(schema.bounties.id));

  return c.json(bounties);
});

// Get supported tokens
app.get("/tokens/:chainId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);

  const tokens = await db
    .select()
    .from(schema.supportedTokens)
    .where(eq(schema.supportedTokens.chainId, chainId));

  return c.json(tokens);
});

// Get bounties with multiple winners
app.get("/bounty/:chainId/multiplayer", async (c) => {
  const chainIdParam = c.req.param("chainId");
  const chainId = Number.parseInt(chainIdParam ?? "", 10);
  if (!Number.isFinite(chainId))
    return c.json({ error: "Invalid chainId" }, 400);

  const bounties = await db
    .select()
    .from(schema.bounties)
    .where(
      and(
        eq(schema.bounties.chainId, chainId),
        eq(schema.bounties.isMultiplayer, true)
      )
    )
    .orderBy((bounty) => bounty.id);

  return c.json(bounties);
});

// Get user's winning claims
app.get("/user/:address/wins/:chainId", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);
  const userAddress = c.req.param("address")?.toLowerCase();

  if (!userAddress) {
    return c.json({ error: "Invalid address" }, 400);
  }

  const wins = await db
    .select()
    .from(schema.bountyWinners)
    .where(
      and(
        eq(schema.bountyWinners.chainId, chainId),
        eq(schema.bountyWinners.winner, userAddress as `0x${string}`)
      )
    )
    .orderBy(desc(schema.bountyWinners.timestamp));

  return c.json(wins);
});

// Get voting statistics for a bounty
app.get("/bounty/:chainId/:bountyId/voting-stats", async (c) => {
  const chainId = Number(c.req.param("chainId") ?? 0);
  const bountyId = Number(c.req.param("bountyId") ?? 0);

  const votes = await db
    .select()
    .from(schema.votes)
    .where(
      and(
        eq(schema.votes.chainId, chainId),
        eq(schema.votes.bountyId, bountyId)
      )
    );

  // Group votes by claimId
  const votesByClaimId: Record<number, { yesVotes: number; noVotes: number }> =
    {};

  for (const vote of votes) {
    const cid = vote.claimId as number;
    if (!votesByClaimId[cid]) {
      votesByClaimId[cid] = { yesVotes: 0, noVotes: 0 };
    }
    if (vote.vote) {
      votesByClaimId[cid]!.yesVotes++;
    } else {
      votesByClaimId[cid]!.noVotes++;
    }
  }

  return c.json({
    bountyId,
    chainId,
    totalVotes: votes.length,
    votesByClaimId,
  });
});

export default app;
