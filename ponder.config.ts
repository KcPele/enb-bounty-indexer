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
              address: "0xE7B8B42d1B8fC584A941768c0348c1178AA906B3",
              startBlock: 34988320,
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
              address: "0xf0b03A35C4fc40395fd0dB8f3661240534D22a00",
              startBlock: 34988320,
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
