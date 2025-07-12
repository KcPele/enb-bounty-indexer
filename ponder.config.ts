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
          address: "0xb502c5856F7244DccDd0264A541Cc25675353D39",
          startBlock: 14542727,
        },
      },
    },
    ENBBountyNFTContract: {
      abi: ENBBountyNFTABI,
      chain: {
        base: {
          address: "0xDdfb1A53E7b73Dba09f79FCA24765C593D447a80",
          startBlock: 14542570,
        },
      },
    },
  },
});
