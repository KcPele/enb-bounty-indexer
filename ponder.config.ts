import { createConfig } from "ponder";
import ENBBountyABI from "./abis/ENBBountyAbi";

// Use environment variable to determine network
const isProduction = process.env.NODE_ENV === "production";

export default createConfig({
  ordering: "multichain",
  database: {
    kind: "postgres",
    poolConfig: {
      max: 50,
    },
  },
  chains: isProduction
    ? {
        base: {
          id: 8453,
          rpc: process.env.BASE_RPC_URL,
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
              address: "0xE7B8B42d1B8fC584A941768c0348c1178AA906B3",
              startBlock: 34988320,
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
