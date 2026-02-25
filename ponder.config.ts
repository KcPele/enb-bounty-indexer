import { createConfig, loadBalance, rateLimit } from "ponder";
import { http } from "viem";
import ENBBountyABI from "./abis/ENBBountyAbi";

// Use environment variable to determine network
const isProduction = process.env.NODE_ENV === "production";

export default createConfig({
  ordering: "multichain",
  database: {
    kind: "postgres",
    poolConfig: {
      max: 20,
    },
  },
  chains: isProduction
    ? {
      base: {
        id: 8453,
        rpc: loadBalance([
          rateLimit(http(process.env.BASE_RPC_URL!), { requestsPerSecond: 1 }),
          rateLimit(http(process.env.BASE_RPC_URL_2!), { requestsPerSecond: 1 }),
          rateLimit(http(process.env.BASE_RPC_URL_3!), { requestsPerSecond: 1 }),
          rateLimit(http(process.env.BASE_RPC_URL_4!), { requestsPerSecond: 1 }),
        ]),
      },
    }
    : {
      localhost: {
        id: 31337,
        rpc: process.env.LOCALHOST_RPC_URL || "http://127.0.0.1:8545",
        disableCache: true,
      },
    },
  contracts: {
    ENBBountyContract: {
      abi: ENBBountyABI,
      chain: isProduction
        ? {
          base: {
            address: process.env.ENB_BOUNTY_ADDRESS as `0x${string}`,
            startBlock: 42390350,
          },
        }
        : {
          localhost: {
            address: (process.env.ENB_BOUNTY_ADDRESS ||
              "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44") as `0x${string}`,
            startBlock: 0,
          },
        },
    },
  },
});
