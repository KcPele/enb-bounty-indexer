const ENBBountyABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_ENBBountyNft",
        type: "address",
      },
      {
        internalType: "address",
        name: "_treasury",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_startClaimIndex",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AlreadyVoted",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadyWon",
    type: "error",
  },
  {
    inputs: [],
    name: "BountyClaimed",
    type: "error",
  },
  {
    inputs: [],
    name: "BountyClaimed",
    type: "error",
  },
  {
    inputs: [],
    name: "BountyClaimed",
    type: "error",
  },
  {
    inputs: [],
    name: "BountyClosed",
    type: "error",
  },
  {
    inputs: [],
    name: "BountyClosed",
    type: "error",
  },
  {
    inputs: [],
    name: "BountyClosed",
    type: "error",
  },
  {
    inputs: [],
    name: "BountyNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "BountyNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "BountyNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "ClaimNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "ETHTransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTokenAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "IssuerCannotClaim",
    type: "error",
  },
  {
    inputs: [],
    name: "IssuerCannotWithdraw",
    type: "error",
  },
  {
    inputs: [],
    name: "NoActiveVoting",
    type: "error",
  },
  {
    inputs: [],
    name: "NoEther",
    type: "error",
  },
  {
    inputs: [],
    name: "NoVotingPeriodSet",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAParticipant",
    type: "error",
  },
  {
    inputs: [],
    name: "NotActiveParticipant",
    type: "error",
  },
  {
    inputs: [],
    name: "NotOpenBounty",
    type: "error",
  },
  {
    inputs: [],
    name: "NotOpenBounty",
    type: "error",
  },
  {
    inputs: [],
    name: "NotSoloBounty",
    type: "error",
  },
  {
    inputs: [],
    name: "NotSoloBounty",
    type: "error",
  },
  {
    inputs: [],
    name: "TokenNotSupported",
    type: "error",
  },
  {
    inputs: [],
    name: "UnsupportedToken",
    type: "error",
  },
  {
    inputs: [],
    name: "VotingNotEnded",
    type: "error",
  },
  {
    inputs: [],
    name: "VotingOngoing",
    type: "error",
  },
  {
    inputs: [],
    name: "VotingOngoing",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongCaller",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongCaller",
    type: "error",
  },
  {
    inputs: [],
    name: "WrongCaller",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroValue",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "issuer",
        type: "address",
      },
    ],
    name: "BountyCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "participant",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BountyJoined",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "claimId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "claimIssuer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bountyIssuer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "ClaimAccepted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "issuer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "bountyIssuer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
    ],
    name: "ClaimCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "claimId",
        type: "uint256",
      },
    ],
    name: "ClaimSubmittedForVote",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
    ],
    name: "ResetVotingPeriod",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum BountyStorageLib.TokenType",
        name: "tokenType",
        type: "uint8",
      },
    ],
    name: "SupportedTokenAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "SupportedTokenRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "issuer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "maxWinners",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum BountyStorageLib.TokenType",
        name: "tokenType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
    ],
    name: "TokenBountyCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "claimId",
        type: "uint256",
      },
    ],
    name: "VoteClaim",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
    ],
    name: "VotingPeriodReset",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "participant",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "WithdrawFromOpenBounty",
    type: "event",
  },
  {
    inputs: [],
    name: "ENBBountyNft",
    outputs: [
      {
        internalType: "contract IENBBountyNft",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "claimId",
        type: "uint256",
      },
    ],
    name: "acceptClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "enum BountyStorageLib.TokenType",
        name: "tokenType",
        type: "uint8",
      },
    ],
    name: "addSupportedToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "bounties",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "issuer",
        type: "address",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "claimer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "claimId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxWinners",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "winnersCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "bountyCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
    ],
    name: "bountyWinners",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
    ],
    name: "bountyWinningClaims",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
    ],
    name: "cancelOpenBounty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
    ],
    name: "cancelSoloBounty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "claims",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "issuer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "bountyIssuer",
        type: "address",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "createdAt",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "accepted",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "uri",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    name: "createClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "maxWinners",
        type: "uint256",
      },
    ],
    name: "createOpenBounty",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    name: "createOpenBounty",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "maxWinners",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    name: "createOpenTokenBounty",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "maxWinners",
        type: "uint256",
      },
    ],
    name: "createSoloBounty",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
    ],
    name: "createSoloBounty",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "maxWinners",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    name: "createTokenBounty",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "offset",
        type: "uint256",
      },
    ],
    name: "getBounties",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "issuer",
            type: "address",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "claimer",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "claimId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxWinners",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "winnersCount",
            type: "uint256",
          },
          {
            internalType: "enum BountyStorageLib.TokenType",
            name: "tokenType",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
        ],
        internalType: "struct BountyStorageLib.Bounty[10]",
        name: "",
        type: "tuple[10]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "offset",
        type: "uint256",
      },
    ],
    name: "getBountiesByUser",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "issuer",
            type: "address",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "claimer",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "claimId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxWinners",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "winnersCount",
            type: "uint256",
          },
          {
            internalType: "enum BountyStorageLib.TokenType",
            name: "tokenType",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
        ],
        internalType: "struct BountyStorageLib.Bounty[10]",
        name: "",
        type: "tuple[10]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBountiesLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
    ],
    name: "getBountyTokenInfo",
    outputs: [
      {
        internalType: "enum BountyStorageLib.TokenType",
        name: "tokenType",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
    ],
    name: "getBountyWinners",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
    ],
    name: "getClaimsByBountyId",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "issuer",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "bountyId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "bountyIssuer",
            type: "address",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "accepted",
            type: "bool",
          },
        ],
        internalType: "struct BountyStorageLib.Claim[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getClaimsByUser",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "issuer",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "bountyId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "bountyIssuer",
            type: "address",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "accepted",
            type: "bool",
          },
        ],
        internalType: "struct BountyStorageLib.Claim[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getClaimsLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
    ],
    name: "getParticipants",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
    ],
    name: "getRemainingWinnerSlots",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "getTokenType",
    outputs: [
      {
        internalType: "enum BountyStorageLib.TokenType",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum BountyStorageLib.TokenType",
        name: "tokenType",
        type: "uint8",
      },
    ],
    name: "getTokenTypeName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    name: "hasAddressWon",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "winner",
        type: "address",
      },
    ],
    name: "hasWon",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "isTokenSupported",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
    ],
    name: "joinOpenBounty",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
    ],
    name: "joinOpenBountyWithToken",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "participantAmounts",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "participants",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "removeSupportedToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
    ],
    name: "resetVotingPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
    ],
    name: "resolveVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "claimId",
        type: "uint256",
      },
    ],
    name: "submitClaimForVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "vote",
        type: "bool",
      },
    ],
    name: "voteClaim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "votingPeriod",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bountyId",
        type: "uint256",
      },
    ],
    name: "withdrawFromOpenBounty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
export default ENBBountyABI;
