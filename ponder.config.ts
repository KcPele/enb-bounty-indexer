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
          address: "0x68C9cD893341220863e16E27800d81F01F6DFb83",
          startBlock: 33416269,
        },
      },
    },
    ENBBountyNFTContract: {
      abi: ENBBountyNFTABI,
      chain: {
        base: {
          address: "0xFC3dB3f829765D2D192F3d5C3Aa6f24121068346",
          startBlock: 33416269,
        },
      },
    },
  },
});
