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
          address: "0x547B4c8ae443FC5e696af0134dc615c119e1688b",
          startBlock: 32773373,
        },
      },
    },
    ENBBountyNFTContract: {
      abi: ENBBountyNFTABI,
      chain: {
        base: {
          address: "0x8977144fd56d1f1B5D6a16a3772549EFCec863cB",
          startBlock: 32773373,
        },
      },
    },
  },
});
