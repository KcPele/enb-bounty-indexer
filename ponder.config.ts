import { createConfig } from "ponder";
import { http } from "viem";
import ENBBountyABI from "./abis/ENBBountyAbi";
import ENBBountyNFTABI from "./abis/ENBBountyNFTAbi";

// Use environment variable to determine network
const isProduction = process.env.NODE_ENV === "production";

export default createConfig({
  ordering: "multichain",
  database: {
    kind: "postgres",
  },
  chains: isProduction
    ? {
        base: {
          id: 8453,
          rpc: http(process.env.BASE_RPC_URL),
        },
      }
    : {
        localhost: {
          id: 31337,
          rpc: http(process.env.LOCALHOST_RPC_URL || "http://127.0.0.1:8545"),
        },
      },
  contracts: {
    ENBBountyContract: {
      abi: ENBBountyABI,
      chain: isProduction
        ? {
            base: {
              address: "0x68C9cD893341220863e16E27800d81F01F6DFb83",
              startBlock: 33416269,
            },
          }
        : {
            localhost: {
              // From deployments/localhost.json
              address: (process.env.ENB_BOUNTY_ADDRESS ||
                "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44") as `0x${string}`,
              startBlock: 0,
            },
          },
    },
    ENBBountyNFTContract: {
      abi: ENBBountyNFTABI,
      chain: isProduction
        ? {
            base: {
              address: "0xFC3dB3f829765D2D192F3d5C3Aa6f24121068346",
              startBlock: 33416269,
            },
          }
        : {
            localhost: {
              // From deployments/localhost.json
              address: (process.env.ENB_BOUNTY_NFT_ADDRESS ||
                "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1") as `0x${string}`,
              startBlock: 0,
            },
          },
    },
  },
});
