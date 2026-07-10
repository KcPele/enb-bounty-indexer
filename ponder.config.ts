import { createConfig, loadBalance, rateLimit } from "ponder";
import { http } from "viem";
import ENBBountyABI from "./abis/ENBBountyAbi";
import ENBTaskRewardsABI from "./abis/ENBTaskRewardsAbi";

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
        ethGetLogsBlockRange: 10,
        rpc: loadBalance([
          rateLimit(http(process.env.BASE_RPC_URL!), { requestsPerSecond: 7 }),
          // rateLimit(http(process.env.BASE_RPC_URL_2!), { requestsPerSecond: 7 }),
          // rateLimit(http(process.env.BASE_RPC_URL_3!), { requestsPerSecond: 7 }),
          // rateLimit(http(process.env.BASE_RPC_URL_4!), { requestsPerSecond: 7 }),
          rateLimit(http(process.env.BASE_RPC_URL_5!), { requestsPerSecond: 7 }),
          rateLimit(http(process.env.BASE_RPC_URL_6!), { requestsPerSecond: 7 }),
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
            startBlock: 44981537,
          },
        }
        : {
          localhost: {
            address: (process.env.ENB_BOUNTY_ADDRESS ||
              "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0") as `0x${string}`,
            startBlock: 0,
          },
        },
    },
    ENBTaskRewardsContract: {
      abi: ENBTaskRewardsABI,
      chain: isProduction
        ? {
          base: {
            address: process.env.ENB_TASK_REWARDS_ADDRESS as `0x${string}`,
            startBlock: 43139476,
          },
        }
        : {
          localhost: {
            address: (process.env.ENB_TASK_REWARDS_ADDRESS ||
              "0x0000000000000000000000000000000000000000") as `0x${string}`,
            startBlock: 0,
          },
        },
    },
  },
});
