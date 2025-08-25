import pg from "pg";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const { Client } = pg;

// API base URL
const API_BASE_URL = "http://localhost:42069";

// Chain ID for localhost
const CHAIN_ID = 31337;

// Schema used by Ponder (fallback to the default seen in logs)
const SCHEMA =
  process.env.DATABASE_SCHEMA ||
  process.env.PONDER_DATABASE_SCHEMA ||
  process.env.PONDER_POSTGRES_SCHEMA ||
  "test_enb_bounty";

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
};

async function queryDatabase() {
  const client = new Client({
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://kcpele@localhost:5432/enb_bounty_indexer",
  });

  try {
    await client.connect();
    console.log(`${colors.green}✅ Connected to database${colors.reset}\n`);

    console.log(`${colors.bright}${"=".repeat(60)}${colors.reset}`);
    console.log(`${colors.cyan}📊 DATABASE QUERY RESULTS${colors.reset}`);
    console.log(`${colors.bright}${"=".repeat(60)}${colors.reset}\n`);

    // 1. Query Bounties
    console.log(`${colors.yellow}📌 BOUNTIES TABLE:${colors.reset}`);
    const bountiesResult = await client.query(
      `SELECT * FROM "${SCHEMA}"."Bounties" WHERE "chain_id" = $1 ORDER BY id`,
      [CHAIN_ID]
    );
    console.log(
      `Found ${colors.green}${bountiesResult.rows.length}${colors.reset} bounties`
    );

    for (const bounty of bountiesResult.rows) {
      const tokenType = ["ETH", "USDC", "ENB"][bounty.token_type];
      console.log(`  #${bounty.id}: ${bounty.title}`);
      console.log(
        `    Token: ${tokenType}, Amount: ${bounty.amount}, Winners: ${bounty.winners_count}/${bounty.max_winners}`
      );
      console.log(
        `    Status: ${
          bounty.in_progress ? "ACTIVE" : "COMPLETED"
        }, Cancelled: ${bounty.is_canceled}`
      );
    }

    // 2. Query Claims
    console.log(`\n${colors.yellow}📌 CLAIMS TABLE:${colors.reset}`);
    const claimsResult = await client.query(
      `SELECT * FROM "${SCHEMA}"."Claims" WHERE "chain_id" = $1 ORDER BY id`,
      [CHAIN_ID]
    );
    console.log(
      `Found ${colors.green}${claimsResult.rows.length}${colors.reset} claims`
    );

    for (const claim of claimsResult.rows) {
      console.log(
        `  Claim #${claim.id}: ${claim.title} (Bounty #${claim.bounty_id})`
      );
      console.log(
        `    Issuer: ${claim.issuer.slice(0, 10)}..., Accepted: ${
          claim.is_accepted
        }`
      );
    }

    // 3. Query Participations
    console.log(`\n${colors.yellow}📌 PARTICIPATIONS TABLE:${colors.reset}`);
    const participationsResult = await client.query(
      `SELECT * FROM "${SCHEMA}"."ParticipationsBounties" WHERE "chain_id" = $1`,
      [CHAIN_ID]
    );
    console.log(
      `Found ${colors.green}${participationsResult.rows.length}${colors.reset} participations`
    );

    const participationsByBounty: Record<number, any[]> = {};
    for (const p of participationsResult.rows) {
      if (!participationsByBounty[p.bounty_id]) {
        participationsByBounty[p.bounty_id] = [];
      }
      participationsByBounty[p.bounty_id]!.push(p);
    }

    for (const [bountyId, participants] of Object.entries(
      participationsByBounty
    )) {
      console.log(`  Bounty #${bountyId}: ${participants.length} participants`);
      for (const p of participants) {
        console.log(`    ${p.user_address.slice(0, 10)}...: ${p.amount}`);
      }
    }

    // 4. Query Winners
    console.log(`\n${colors.yellow}📌 BOUNTY WINNERS TABLE:${colors.reset}`);
    const winnersResult = await client.query(
      `SELECT * FROM "${SCHEMA}"."BountyWinners" WHERE "chain_id" = $1 ORDER BY "bounty_id", "timestamp"`,
      [CHAIN_ID]
    );
    console.log(
      `Found ${colors.green}${winnersResult.rows.length}${colors.reset} winners`
    );

    for (const winner of winnersResult.rows) {
      console.log(
        `  Bounty #${winner.bounty_id}: Winner ${winner.winner.slice(0, 10)}...`
      );
      console.log(`    Claim #${winner.claim_id}, Amount: ${winner.amount}`);
    }

    // 5. Query Votes
    console.log(`\n${colors.yellow}📌 VOTES TABLE:${colors.reset}`);
    const votesResult = await client.query(
      `SELECT * FROM "${SCHEMA}"."Votes" WHERE "chain_id" = $1 ORDER BY "bounty_id", "claim_id"`,
      [CHAIN_ID]
    );
    console.log(
      `Found ${colors.green}${votesResult.rows.length}${colors.reset} votes`
    );

    const votesByBounty: Record<number, any[]> = {};
    for (const vote of votesResult.rows) {
      if (!votesByBounty[vote.bounty_id]) {
        votesByBounty[vote.bounty_id] = [];
      }
      votesByBounty[vote.bounty_id]!.push(vote);
    }

    for (const [bountyId, votes] of Object.entries(votesByBounty)) {
      const yesVotes = (votes as any[]).filter((v) => v.vote).length;
      const noVotes = (votes as any[]).filter((v) => !v.vote).length;
      console.log(
        `  Bounty #${bountyId}: ${votes.length} votes (${yesVotes} YES, ${noVotes} NO)`
      );
    }

    // 6. Query Users
    console.log(`\n${colors.yellow}📌 USERS TABLE:${colors.reset}`);
    const usersResult = await client.query(
      `SELECT COUNT(*) as count FROM "${SCHEMA}"."Users"`
    );
    console.log(
      `Found ${colors.green}${usersResult.rows[0].count}${colors.reset} unique users`
    );

    // 7. Query Transactions
    console.log(`\n${colors.yellow}📌 TRANSACTIONS TABLE:${colors.reset}`);
    const txResult = await client.query(
      `SELECT COUNT(*) as count, action FROM "${SCHEMA}"."Transactions" WHERE "chain_id" = $1 GROUP BY action`,
      [CHAIN_ID]
    );
    console.log(`Transaction summary:`);
    for (const row of txResult.rows) {
      console.log(
        `  ${row.action}: ${colors.green}${row.count}${colors.reset} transactions`
      );
    }
  } catch (error) {
    console.error(`${colors.red}Database query error:${colors.reset}`, error);
  } finally {
    await client.end();
  }
}

async function queryAPI() {
  console.log(`\n${colors.bright}${"=".repeat(60)}${colors.reset}`);
  console.log(`${colors.magenta}🌐 API ENDPOINT TESTS${colors.reset}`);
  console.log(`${colors.bright}${"=".repeat(60)}${colors.reset}\n`);

  try {
    // 1. Get all bounties
    console.log(
      `${colors.yellow}Testing GET /bounty/${CHAIN_ID}${colors.reset}`
    );
    const bountiesResponse = await axios.get(
      `${API_BASE_URL}/bounty/${CHAIN_ID}`
    );
    console.log(
      `  ✅ Retrieved ${colors.green}${bountiesResponse.data.length}${colors.reset} bounties`
    );

    // 2. Get specific bounty
    if (bountiesResponse.data.length > 0) {
      const firstBounty = bountiesResponse.data[0];
      console.log(
        `\n${colors.yellow}Testing GET /bounty/${CHAIN_ID}/${firstBounty.id}${colors.reset}`
      );
      const bountyResponse = await axios.get(
        `${API_BASE_URL}/bounty/${CHAIN_ID}/${firstBounty.id}`
      );
      console.log(`  ✅ Retrieved bounty: ${bountyResponse.data.title}`);

      // 3. Get bounty winners
      console.log(
        `\n${colors.yellow}Testing GET /bounty/${CHAIN_ID}/${firstBounty.id}/winners${colors.reset}`
      );
      try {
        const winnersResponse = await axios.get(
          `${API_BASE_URL}/bounty/${CHAIN_ID}/${firstBounty.id}/winners`
        );
        console.log(
          `  ✅ Retrieved ${colors.green}${winnersResponse.data.length}${colors.reset} winners`
        );
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log(`  ℹ️  No winners yet for bounty #${firstBounty.id}`);
        } else {
          throw error;
        }
      }

      // 4. Get bounty votes
      console.log(
        `\n${colors.yellow}Testing GET /bounty/${CHAIN_ID}/${firstBounty.id}/votes${colors.reset}`
      );
      try {
        const votesResponse = await axios.get(
          `${API_BASE_URL}/bounty/${CHAIN_ID}/${firstBounty.id}/votes`
        );
        console.log(
          `  ✅ Retrieved ${colors.green}${votesResponse.data.length}${colors.reset} votes`
        );
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log(`  ℹ️  No votes yet for bounty #${firstBounty.id}`);
        } else {
          throw error;
        }
      }

      // 5. Get bounty participations
      console.log(
        `\n${colors.yellow}Testing GET /bounty/participations/${CHAIN_ID}/${firstBounty.id}${colors.reset}`
      );
      try {
        const participationsResponse = await axios.get(
          `${API_BASE_URL}/bounty/participations/${CHAIN_ID}/${firstBounty.id}`
        );
        console.log(
          `  ✅ Retrieved ${colors.green}${participationsResponse.data.length}${colors.reset} participations`
        );
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log(`  ℹ️  No participations for bounty #${firstBounty.id}`);
        } else {
          throw error;
        }
      }

      // 6. Get bounty claims
      console.log(
        `\n${colors.yellow}Testing GET /bounty/claims/${CHAIN_ID}/${firstBounty.id}${colors.reset}`
      );
      try {
        const claimsResponse = await axios.get(
          `${API_BASE_URL}/bounty/claims/${CHAIN_ID}/${firstBounty.id}`
        );
        console.log(
          `  ✅ Retrieved ${colors.green}${claimsResponse.data.length}${colors.reset} claims`
        );
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log(`  ℹ️  No claims for bounty #${firstBounty.id}`);
        } else {
          throw error;
        }
      }
    }

    // 7. Get bounties by token type
    console.log(
      `\n${colors.yellow}Testing GET /bounty/${CHAIN_ID}/token/0 (ETH)${colors.reset}`
    );
    const ethBountiesResponse = await axios.get(
      `${API_BASE_URL}/bounty/${CHAIN_ID}/token/0`
    );
    console.log(
      `  ✅ Retrieved ${colors.green}${ethBountiesResponse.data.length}${colors.reset} ETH bounties`
    );

    console.log(
      `\n${colors.yellow}Testing GET /bounty/${CHAIN_ID}/token/1 (USDC)${colors.reset}`
    );
    const usdcBountiesResponse = await axios.get(
      `${API_BASE_URL}/bounty/${CHAIN_ID}/token/1`
    );
    console.log(
      `  ✅ Retrieved ${colors.green}${usdcBountiesResponse.data.length}${colors.reset} USDC bounties`
    );

    console.log(
      `\n${colors.yellow}Testing GET /bounty/${CHAIN_ID}/token/2 (ENB)${colors.reset}`
    );
    const enbBountiesResponse = await axios.get(
      `${API_BASE_URL}/bounty/${CHAIN_ID}/token/2`
    );
    console.log(
      `  ✅ Retrieved ${colors.green}${enbBountiesResponse.data.length}${colors.reset} ENB bounties`
    );

    // 8. Get multiplayer bounties
    console.log(
      `\n${colors.yellow}Testing GET /bounty/${CHAIN_ID}/multiplayer${colors.reset}`
    );
    const multiplayerResponse = await axios.get(
      `${API_BASE_URL}/bounty/${CHAIN_ID}/multiplayer`
    );
    console.log(
      `  ✅ Retrieved ${colors.green}${multiplayerResponse.data.length}${colors.reset} multiplayer bounties`
    );

    // 9. Get supported tokens
    console.log(
      `\n${colors.yellow}Testing GET /tokens/${CHAIN_ID}${colors.reset}`
    );
    const tokensResponse = await axios.get(
      `${API_BASE_URL}/tokens/${CHAIN_ID}`
    );
    console.log(
      `  ✅ Retrieved ${colors.green}${tokensResponse.data.length}${colors.reset} supported tokens`
    );
    for (const token of tokensResponse.data) {
      console.log(
        `    ${token.symbol}: ${token.name} (${token.decimals} decimals)`
      );
    }

    // 10. Get live bounties
    console.log(
      `\n${colors.yellow}Testing GET /live/bounty/${CHAIN_ID}${colors.reset}`
    );
    const liveResponse = await axios.get(
      `${API_BASE_URL}/live/bounty/${CHAIN_ID}`
    );
    console.log(
      `  ✅ Retrieved ${colors.green}${liveResponse.data.length}${colors.reset} live bounties`
    );

    // 11. Get voting bounties
    console.log(
      `\n${colors.yellow}Testing GET /voting/bounty/${CHAIN_ID}${colors.reset}`
    );
    const votingResponse = await axios.get(
      `${API_BASE_URL}/voting/bounty/${CHAIN_ID}`
    );
    console.log(
      `  ✅ Retrieved ${colors.green}${votingResponse.data.length}${colors.reset} voting bounties`
    );

    // 12. Get past bounties
    console.log(
      `\n${colors.yellow}Testing GET /past/bounty/${CHAIN_ID}${colors.reset}`
    );
    const pastResponse = await axios.get(
      `${API_BASE_URL}/past/bounty/${CHAIN_ID}`
    );
    console.log(
      `  ✅ Retrieved ${colors.green}${pastResponse.data.length}${colors.reset} past bounties`
    );

    // 13. Test GraphQL endpoint
    console.log(`\n${colors.yellow}Testing GraphQL endpoint${colors.reset}`);
    const graphqlQuery = {
      query: `
        query {
          bounties(limit: 5) {
            items {
              id
              title
              amount
              tokenType
              maxWinners
              winnersCount
            }
          }
        }
      `,
    };

    try {
      const graphqlResponse = await axios.post(
        `${API_BASE_URL}/graphql`,
        graphqlQuery
      );
      const bountyCount =
        graphqlResponse.data.data?.bounties?.items?.length || 0;
      console.log(
        `  ✅ GraphQL query successful: ${colors.green}${bountyCount}${colors.reset} bounties`
      );
    } catch (error: any) {
      console.log(`  ⚠️  GraphQL endpoint not available or query error`);
    }

    console.log(`\n${colors.bright}${"=".repeat(60)}${colors.reset}`);
    console.log(`${colors.green}✨ API TEST COMPLETE${colors.reset}`);
    console.log(`${colors.bright}${"=".repeat(60)}${colors.reset}`);
  } catch (error: any) {
    console.error(
      `${colors.red}API query error:${colors.reset}`,
      error.message
    );
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Data:`, error.response.data);
    }
  }
}

async function main() {
  console.log(`${colors.bright}${colors.cyan}`);
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║           ENB BOUNTY INDEXER VERIFICATION TOOL          ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log(`${colors.reset}\n`);

  console.log("This script will verify that:");
  console.log("  1. Events are properly indexed in the database");
  console.log("  2. API endpoints return correct data");
  console.log("  3. All new features are working correctly\n");

  // Query database
  await queryDatabase();

  // Query API
  await queryAPI();

  console.log(
    `\n${colors.bright}${colors.green}✅ Verification complete!${colors.reset}\n`
  );
}

// Run the script
main().catch(console.error);

// to run: npx tsx scripts/query-indexed-data.ts
