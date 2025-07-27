import { createConfig } from "ponder";
import { http } from "viem";
import ENBBountyABI from "./abis/ENBBountyAbi";
import ENBBountyNFTABI from "./abis/ENBBountyNFTAbi";

export default createConfig({
  ordering: "multichain",
  database: {
    kind: "postgres",
  },
  chains: {
    base: {
      id: 8453,
      rpc: http(process.env.BASE_RPC_URL),
    },
  },
  contracts: {
    ENBBountyContract: {
      abi: ENBBountyABI,
      chain: {
        base: {
          address: "0x54C9089ba815f2d934ea693fd1AD1844563649cc",
          startBlock: 33414605,
        },
      },
    },
    ENBBountyNFTContract: {
      abi: ENBBountyNFTABI,
      chain: {
        base: {
          address: "0xC4427a1De63885446B0c90889c6CCfaf27fFA525",
          startBlock: 33414605,
        },
      },
    },
  },
});
