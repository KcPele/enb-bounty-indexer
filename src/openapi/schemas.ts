import { z } from "@hono/zod-openapi";

export const BountySchema = z
  .object({
    id: z.number().openapi({
      example: 1337,
      description: "Bounty ID",
    }),
    chainId: z.number().openapi({
      example: 8453,
      description: "Chain ID",
    }),
    title: z.string().openapi({
      example: "Find a bug",
      description: "Bounty title",
    }),
    description: z.string().openapi({
      example: "Find a bug in the code",
      description: "Bounty description",
    }),
    amount: z.string().openapi({
      example: "13370000000",
      description: "Bounty amount (bigint)",
    }),
    amountSort: z.number().openapi({
      example: 1337,
      description: "Bounty amount (decimal)",
    }),
    issuer: z.string().openapi({
      example: "0x1337567890abcdef",
      description: "Bounty issuer address",
    }),
    inProgress: z.boolean().openapi({
      example: false,
      default: true,
      description: "Is the bounty in progress",
    }),
    isJoinedBounty: z.boolean().openapi({
      example: false,
      default: false,
      description: "Is the bounty joined",
    }),
    isCanceled: z.boolean().openapi({
      example: false,
      description: "Is the bounty canceled",
      default: false,
    }),
    isMultiplayer: z.boolean().openapi({
      example: false,
      description: "Is a multiplayer bounty",
    }),
    isVoting: z.boolean().openapi({
      example: false,
      description: "Is voting in progress",
      default: false,
    }),
    deadline: z.number().nullable().openapi({
      example: 1713370239,
      description: "Voting deadline",
    }),
    maxWinners: z.number().openapi({
      example: 1,
      description: "Maximum number of winners",
      default: 1,
    }),
    winnersCount: z.number().openapi({
      example: 0,
      description: "Current number of winners",
      default: 0,
    }),
    tokenType: z.number().openapi({
      example: 0,
      description: "Token type (0=ETH, 1=USDC, 2=ENB)",
      default: 0,
    }),
    tokenAddress: z.string().nullable().openapi({
      example: "0x0000000000000000000000000000000000000000",
      description: "Token contract address",
    }),
  })
  .openapi("Bounty");

export const ClaimSchema = z
  .object({
    id: z.number().openapi({
      example: 777,
      description: "Claim id",
    }),
    chainId: z.number().openapi({
      example: 8453,
      description: "Chain ID",
    }),
    bountyId: z.number().openapi({
      example: 1337,
      description: "Bounty ID",
    }),
    title: z.string().openapi({
      example: "Find a bug",
      description: "Bounty title",
    }),
    description: z.string().openapi({
      example: "Find a bug in the code",
      description: "Bounty description",
    }),
    url: z.string().openapi({
      example:
        "https://images.pexels.com/photos/11129937/pexels-photo-11129937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "Claim image url",
    }),
    issuer: z.string().openapi({
      example: "0x1337567890abcdef",
      description: "Claim issuer address",
    }),
    isAccepted: z.boolean().openapi({
      example: true,
      description: "Is claim accepted",
      default: false,
    }),
    owner: z.string().openapi({
      example: "0x1337567890abcdef",
      description: "NFT owner address",
    }),
  })
  .openapi("Claim");

export const ParticipationSchema = z
  .object({
    amount: z.string(),
    bountyId: z.number(),
    userAddress: z.string(),
  })
  .openapi("Participation");

export const BountiesSchema = z
  .array(BountySchema)
  .openapi("Bounties");

export const ClaimsSchema = z
  .array(ClaimSchema)
  .openapi("Claims");

export const ParticipationsSchema = z
  .array(ParticipationSchema)
  .openapi("Participations");

export const GetByChainId = z.object({
  chainId: z.number().openapi({
    param: {
      name: "chainId",
      in: "path",
    },
    example: 8453,
  }),
});

export const GetByBountyIdAndChainIdParamsSchema =
  z.object({
    chainId: z.number().openapi({
      param: {
        name: "chainId",
        in: "path",
      },
      example: 8453,
    }),
    bountyId: z.number().openapi({
      param: {
        name: "bountyId",
        in: "path",
      },
      example: 332,
    }),
  });

export const GetByClaimIdAndChainIdParamsSchema =
  z.object({
    chainId: z.number().openapi({
      param: {
        name: "chainId",
        in: "path",
      },
      example: 8453,
    }),
    claimId: z.number().openapi({
      param: {
        name: "claimId",
        in: "path",
      },
      example: 777,
    }),
  });

// New schemas for enhanced features

export const BountyWinnerSchema = z
  .object({
    bountyId: z.number().openapi({
      example: 1337,
      description: "Bounty ID",
    }),
    chainId: z.number().openapi({
      example: 8453,
      description: "Chain ID",
    }),
    winner: z.string().openapi({
      example: "0x1337567890abcdef",
      description: "Winner address",
    }),
    claimId: z.number().openapi({
      example: 777,
      description: "Winning claim ID",
    }),
    amount: z.string().openapi({
      example: "1000000000000000000",
      description: "Amount won (bigint)",
    }),
    timestamp: z.string().openapi({
      example: "1713370239000",
      description: "Timestamp (bigint)",
    }),
  })
  .openapi("BountyWinner");

export const VoteSchema = z
  .object({
    bountyId: z.number().openapi({
      example: 1337,
      description: "Bounty ID",
    }),
    chainId: z.number().openapi({
      example: 8453,
      description: "Chain ID",
    }),
    claimId: z.number().openapi({
      example: 777,
      description: "Claim ID",
    }),
    voter: z.string().openapi({
      example: "0x1337567890abcdef",
      description: "Voter address",
    }),
    vote: z.boolean().openapi({
      example: true,
      description: "Vote (true=yes, false=no)",
    }),
    timestamp: z.string().openapi({
      example: "1713370239000",
      description: "Timestamp (bigint)",
    }),
  })
  .openapi("Vote");

export const SupportedTokenSchema = z
  .object({
    address: z.string().openapi({
      example: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      description: "Token contract address",
    }),
    chainId: z.number().openapi({
      example: 8453,
      description: "Chain ID",
    }),
    tokenType: z.number().openapi({
      example: 1,
      description: "Token type (0=ETH, 1=USDC, 2=ENB)",
    }),
    symbol: z.string().openapi({
      example: "USDC",
      description: "Token symbol",
    }),
    decimals: z.number().openapi({
      example: 6,
      description: "Token decimals",
    }),
    name: z.string().openapi({
      example: "USD Coin",
      description: "Token name",
    }),
  })
  .openapi("SupportedToken");

export const VotingStatsSchema = z
  .object({
    bountyId: z.number().openapi({
      example: 1337,
      description: "Bounty ID",
    }),
    chainId: z.number().openapi({
      example: 8453,
      description: "Chain ID",
    }),
    totalVotes: z.number().openapi({
      example: 10,
      description: "Total number of votes",
    }),
    votesByClaimId: z.record(
      z.object({
        yesVotes: z.number(),
        noVotes: z.number(),
      })
    ).openapi({
      example: {
        "777": { yesVotes: 5, noVotes: 2 },
        "888": { yesVotes: 3, noVotes: 0 },
      },
      description: "Votes grouped by claim ID",
    }),
  })
  .openapi("VotingStats");

export const GetByTokenTypeParamsSchema = z.object({
  chainId: z.number().openapi({
    param: {
      name: "chainId",
      in: "path",
    },
    example: 8453,
  }),
  tokenType: z.number().openapi({
    param: {
      name: "tokenType",
      in: "path",
    },
    example: 1,
    description: "Token type (0=ETH, 1=USDC, 2=ENB)",
  }),
});

export const GetByUserAddressParamsSchema = z.object({
  address: z.string().openapi({
    param: {
      name: "address",
      in: "path",
    },
    example: "0x1337567890abcdef",
  }),
  chainId: z.number().openapi({
    param: {
      name: "chainId",
      in: "path",
    },
    example: 8453,
  }),
});

export const BountyWinnersSchema = z
  .array(BountyWinnerSchema)
  .openapi("BountyWinners");

export const VotesSchema = z
  .array(VoteSchema)
  .openapi("Votes");

export const SupportedTokensSchema = z
  .array(SupportedTokenSchema)
  .openapi("SupportedTokens");
