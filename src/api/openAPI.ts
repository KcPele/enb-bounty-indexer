import { OpenAPIHono } from "@hono/zod-openapi";
import {
  getChainBountiesRoute,
  getBountyRoute,
  getBountyParticipationsRouter,
  getBountyClaimsRoute,
  getLiveBountiesRoute,
  getVotingBountiesRoute,
  getPastBountiesRoute,
  getChainClaimsRoute,
  getClaimRoute,
  getBountyWinnersRoute,
  getBountyVotesRoute,
  getBountyVotingStatsRoute,
  getBountiesByTokenTypeRoute,
  getSupportedTokensRoute,
  getMultiplayerBountiesRoute,
  getUserWinsRoute,
} from "../openapi/routes";

const app = new OpenAPIHono();

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "ENB Indexer API",
  },
});

app.openapi(getChainBountiesRoute, (c) => {
  return c.json([
    {
      id: 1337,
      chainId: 8453,
      title: "say something nice about someone on farcaster 💜",
      description:
        "celebrate ENB's multichain launch 🎉 - post something nice about someone else on farcaster and tag them in your post - upload a screenshot here and share a link to your post in your claim description - this bounty is created by the ENB team - we will choose our favorite entry tuesday, june 18th",
      amount: "3300000000000000",
      amountSort: 0.0033,
      issuer: "0xbed82560c39c133a3d64516ecda82c71b72f3cd7",
      inProgress: false,
      isJoinedBounty: false,
      isCanceled: false,
      isMultiplayer: true,
      isVoting: false,
      deadline: 1730000000,
      maxWinners: 3,
      winnersCount: 1,
      tokenType: 0,
      tokenAddress: null,
    },
    {
      id: 420,
      chainId: 8453,
      title: "your favorite vinyl 🎵",
      description:
        "celebrate ENB's multichain launch 🎉 - upload a pic of a vinyl record that you own and say what you love about the record - this bounty is created by the ENB team - we will choose our favorite entry tuesday, june 18th",
      amount: "3300000000000000",
      amountSort: 0.0033,
      issuer: "0xbed82560c39c133a3d64516ecda82c71b72f3cd7",
      inProgress: false,
      isJoinedBounty: false,
      isCanceled: false,
      isMultiplayer: false,
      isVoting: false,
      deadline: 1730000000,
      maxWinners: 1,
      winnersCount: 0,
      tokenType: 0,
      tokenAddress: null,
    },
    {
      id: 777,
      chainId: 8453,
      title: "touch grass 🌱",
      description:
        "celebrate ENB's multichain launch 🎉 - upload a pic of yourself touching grass - this bounty is created by the ENB team - we will choose our favorite entry tuesday, june 18th",
      amount: "3300000000000000",
      amountSort: 0.0033,
      issuer: "0xbed82560c39c133a3d64516ecda82c71b72f3cd7",
      inProgress: false,
      isJoinedBounty: false,
      isCanceled: false,
      isMultiplayer: false,
      isVoting: false,
      deadline: null,
      maxWinners: 1,
      winnersCount: 0,
      tokenType: 0,
      tokenAddress: null,
    },
  ]);
});

app.openapi(getLiveBountiesRoute, (c) => {
  return c.json([
    {
      id: 1337,
      chainId: 8453,
      title: "say something nice about someone on farcaster 💜",
      description:
        "celebrate ENB's multichain launch 🎉 - post something nice about someone else on farcaster and tag them in your post - upload a screenshot here and share a link to your post in your claim description - this bounty is created by the ENB team - we will choose our favorite entry tuesday, june 18th",
      amount: "3300000000000000",
      amountSort: 0.0033,
      issuer: "0xbed82560c39c133a3d64516ecda82c71b72f3cd7",
      inProgress: false,
      isJoinedBounty: false,
      isCanceled: false,
      isMultiplayer: true,
      isVoting: false,
      deadline: 1730000000,
      maxWinners: 1,
      winnersCount: 0,
      tokenType: 0,
      tokenAddress: null,
    },
    {
      id: 777,
      chainId: 8453,
      title: "touch grass 🌱",
      description:
        "celebrate ENB's multichain launch 🎉 - upload a pic of yourself touching grass - this bounty is created by the ENB team - we will choose our favorite entry tuesday, june 18th",
      amount: "3300000000000000",
      amountSort: 0.0033,
      issuer: "0xbed82560c39c133a3d64516ecda82c71b72f3cd7",
      inProgress: false,
      isJoinedBounty: false,
      isCanceled: false,
      isMultiplayer: false,
      isVoting: false,
      deadline: null,
      maxWinners: 1,
      winnersCount: 0,
      tokenType: 0,
      tokenAddress: null,
    },
  ]);
});
app.openapi(getVotingBountiesRoute, (c) => {
  return c.json([
    {
      id: 420,
      chainId: 8453,
      title: "your favorite vinyl 🎵",
      description:
        "celebrate ENB's multichain launch 🎉 - upload a pic of a vinyl record that you own and say what you love about the record - this bounty is created by the ENB team - we will choose our favorite entry tuesday, june 18th",
      amount: "3300000000000000",
      amountSort: 0.0033,
      issuer: "0xbed82560c39c133a3d64516ecda82c71b72f3cd7",
      inProgress: false,
      isJoinedBounty: false,
      isCanceled: false,
      isMultiplayer: false,
      isVoting: false,
      deadline: 1730000000,
      maxWinners: 1,
      winnersCount: 0,
      tokenType: 0,
      tokenAddress: null,
    },
    {
      id: 777,
      chainId: 8453,
      title: "touch grass 🌱",
      description:
        "celebrate ENB's multichain launch 🎉 - upload a pic of yourself touching grass - this bounty is created by the ENB team - we will choose our favorite entry tuesday, june 18th",
      amount: "3300000000000000",
      amountSort: 0.0033,
      issuer: "0xbed82560c39c133a3d64516ecda82c71b72f3cd7",
      inProgress: false,
      isJoinedBounty: false,
      isCanceled: false,
      isMultiplayer: false,
      isVoting: false,
      deadline: null,
      maxWinners: 1,
      winnersCount: 0,
      tokenType: 0,
      tokenAddress: null,
    },
  ]);
});

app.openapi(getPastBountiesRoute, (c) => {
  return c.json([
    {
      id: 1337,
      chainId: 8453,
      title: "say something nice about someone on farcaster 💜",
      description:
        "celebrate ENB's multichain launch 🎉 - post something nice about someone else on farcaster and tag them in your post - upload a screenshot here and share a link to your post in your claim description - this bounty is created by the ENB team - we will choose our favorite entry tuesday, june 18th",
      amount: "3300000000000000",
      amountSort: 0.0033,
      issuer: "0xbed82560c39c133a3d64516ecda82c71b72f3cd7",
      inProgress: false,
      isJoinedBounty: false,
      isCanceled: false,
      isMultiplayer: true,
      isVoting: false,
      deadline: 1730000000,
      maxWinners: 1,
      winnersCount: 0,
      tokenType: 0,
      tokenAddress: null,
    },
    {
      id: 777,
      chainId: 8453,
      title: "touch grass 🌱",
      description:
        "celebrate ENB's multichain launch 🎉 - upload a pic of yourself touching grass - this bounty is created by the ENB team - we will choose our favorite entry tuesday, june 18th",
      amount: "3300000000000000",
      amountSort: 0.0033,
      issuer: "0xbed82560c39c133a3d64516ecda82c71b72f3cd7",
      inProgress: false,
      isJoinedBounty: false,
      isCanceled: false,
      isMultiplayer: false,
      isVoting: false,
      deadline: null,
      maxWinners: 1,
      winnersCount: 0,
      tokenType: 0,
      tokenAddress: null,
    },
  ]);
});

app.openapi(getBountyRoute, (c) => {
  return c.json({
    id: 1337,
    chainId: 8453,
    title: "say something nice about someone on farcaster 💜",
    description:
      "celebrate ENB's multichain launch 🎉 - post something nice about someone else on farcaster and tag them in your post - upload a screenshot here and share a link to your post in your claim description - this bounty is created by the ENB team - we will choose our favorite entry tuesday, june 18th",
    amount: "3300000000000000",
    amountSort: 0.0033,
    issuer: "0xbed82560c39c133a3d64516ecda82c71b72f3cd7",
    inProgress: false,
    isJoinedBounty: false,
    isCanceled: false,
    isMultiplayer: true,
    isVoting: false,
    deadline: 1730000000,
  });
});

app.openapi(getBountyParticipationsRouter, (c) => {
  return c.json([
    {
      userAddress: "0x01a29134723ef72a968838cb1df498bc4f910bec",
      bountyId: 332,
      chainId: 8453,
      amount: "10000000000000000",
    },
    {
      userAddress: "0x0e467a0288a439ba2678eb7d3b0b64b01e2bbbfc",
      bountyId: 332,
      chainId: 8453,
      amount: "15000000000000000",
    },
    {
      userAddress: "0x2cd1353cf0e402770643b54011a63b546a189c44",
      bountyId: 332,
      chainId: 8453,
      amount: "100000000000",
    },
    {
      userAddress: "0xee0c0d565b483aaa02581841d071986e7dc00c82",
      bountyId: 332,
      chainId: 8453,
      amount: "700000000000000",
    },
    {
      userAddress: "0x122b561df0fcbead160293125fd0bcea3416c2c0",
      bountyId: 332,
      chainId: 8453,
      amount: "100000000000000",
    },
  ]);
});

app.openapi(getBountyClaimsRoute, (c) => {
  return c.json([
    {
      id: 893,
      chainId: 8453,
      title: "Lfg",
      description: "Lfg",
      url: "https://beige-impossible-dragon-883.mypinata.cloud/ipfs/QmNWeu67n4NJfGbuCyAiAZSiu9FqzA5TR8tQZaMj4dmKr5",
      issuer: "0x18cefa841bdc634dcd640049505dbd8ae22e312f",
      isAccepted: false,
      bountyId: 332,
      owner: "0xb502c5856f7244dccdd0264a541cc25675353d39",
    },
    {
      id: 898,
      chainId: 8453,
      title: "test",
      description: "test",
      url: "https://images.pexels.com/photos/11129937/pexels-photo-11129937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      issuer: "0x2cd1353cf0e402770643b54011a63b546a189c44",
      isAccepted: false,
      bountyId: 332,
      owner: "0xb502c5856f7244dccdd0264a541cc25675353d39",
    },
    {
      id: 908,
      chainId: 8453,
      title: "seems like he was here already?",
      description: "if he’s here then lfg",
      url: "https://beige-impossible-dragon-883.mypinata.cloud/ipfs/QmUMr4mQv3iVCrwU635vKAMrmxcFZ5K9Bxfn49Bsm8VkLm",
      issuer: "0xc2b96fd7a6d5ee1cf775ea19e8ae6c852ec8db79",
      isAccepted: false,
      bountyId: 332,
      owner: "0xb502c5856f7244dccdd0264a541cc25675353d39",
    },
    {
      id: 960,
      chainId: 8453,
      title: "test",
      description: "test",
      url: "https://beige-impossible-dragon-883.mypinata.cloud/ipfs/QmNU9w9BWZ7htmHVo3mHKLnWjohevJhR3Q3yd8W59LLTFj",
      issuer: "0x023875c1c757953aa2ff410da001e79f2edb730d",
      isAccepted: false,
      bountyId: 332,
      owner: "0xb502c5856f7244dccdd0264a541cc25675353d39",
    },
  ]);
});

app.openapi(getChainClaimsRoute, (c) => {
  return c.json([
    {
      id: 893,
      chainId: 8453,
      title: "Lfg",
      description: "Lfg",
      url: "https://beige-impossible-dragon-883.mypinata.cloud/ipfs/QmNWeu67n4NJfGbuCyAiAZSiu9FqzA5TR8tQZaMj4dmKr5",
      issuer: "0x18cefa841bdc634dcd640049505dbd8ae22e312f",
      isAccepted: false,
      bountyId: 332,
      owner: "0xb502c5856f7244dccdd0264a541cc25675353d39",
    },
    {
      id: 898,
      chainId: 8453,
      title: "test",
      description: "test",
      url: "https://images.pexels.com/photos/11129937/pexels-photo-11129937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      issuer: "0x2cd1353cf0e402770643b54011a63b546a189c44",
      isAccepted: false,
      bountyId: 332,
      owner: "0xb502c5856f7244dccdd0264a541cc25675353d39",
    },
  ]);
});

app.openapi(getClaimRoute, (c) => {
  return c.json({
    id: 893,
    chainId: 8453,
    title: "Lfg",
    description: "Lfg",
    url: "https://beige-impossible-dragon-883.mypinata.cloud/ipfs/QmNWeu67n4NJfGbuCyAiAZSiu9FqzA5TR8tQZaMj4dmKr5",
    issuer: "0x18cefa841bdc634dcd640049505dbd8ae22e312f",
    isAccepted: false,
    bountyId: 332,
    owner: "0xb502c5856f7244dccdd0264a541cc25675353d39",
  });
});

// New endpoints mock data

app.openapi(getBountyWinnersRoute, (c) => {
  return c.json([
    {
      bountyId: 1337,
      chainId: 8453,
      winner: "0x18cefa841bdc634dcd640049505dbd8ae22e312f",
      claimId: 893,
      amount: "3300000000000000",
      timestamp: "1713370239000",
    },
  ]);
});

app.openapi(getBountyVotesRoute, (c) => {
  return c.json([
    {
      bountyId: 420,
      chainId: 8453,
      claimId: 898,
      voter: "0x2cd1353cf0e402770643b54011a63b546a189c44",
      vote: true,
      timestamp: "1713370239000",
    },
    {
      bountyId: 420,
      chainId: 8453,
      claimId: 898,
      voter: "0xee0c0d565b483aaa02581841d071986e7dc00c82",
      vote: false,
      timestamp: "1713370240000",
    },
  ]);
});

app.openapi(getBountyVotingStatsRoute, (c) => {
  return c.json({
    bountyId: 420,
    chainId: 8453,
    totalVotes: 5,
    votesByClaimId: {
      "898": { yesVotes: 3, noVotes: 2 },
      "908": { yesVotes: 0, noVotes: 0 },
    },
  });
});

app.openapi(getBountiesByTokenTypeRoute, (c) => {
  return c.json([
    {
      id: 777,
      chainId: 8453,
      title: "touch grass 🌱",
      description:
        "celebrate ENB's multichain launch 🎉 - upload a pic of yourself touching grass - this bounty is created by the ENB team - we will choose our favorite entry tuesday, june 18th",
      amount: "1000000", // 1 USDC
      amountSort: 1.0,
      issuer: "0xbed82560c39c133a3d64516ecda82c71b72f3cd7",
      inProgress: false,
      isJoinedBounty: false,
      isCanceled: false,
      isMultiplayer: false,
      isVoting: false,
      deadline: null,
      maxWinners: 1,
      winnersCount: 0,
      tokenType: 1,
      tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    },
  ]);
});

app.openapi(getSupportedTokensRoute, (c) => {
  return c.json([
    {
      address: "0x0000000000000000000000000000000000000000",
      chainId: 8453,
      tokenType: 0,
      symbol: "ETH",
      decimals: 18,
      name: "Ethereum",
    },
    {
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      chainId: 8453,
      tokenType: 1,
      symbol: "USDC",
      decimals: 6,
      name: "USD Coin",
    },
    {
      address: "0x12345678901234567890123456789012345678ab",
      chainId: 8453,
      tokenType: 2,
      symbol: "ENB",
      decimals: 18,
      name: "ENB Token",
    },
  ]);
});

app.openapi(getMultiplayerBountiesRoute, (c) => {
  return c.json([
    {
      id: 1337,
      chainId: 8453,
      title: "say something nice about someone on farcaster 💜",
      description:
        "celebrate ENB's multichain launch 🎉 - post something nice about someone else on farcaster and tag them in your post - upload a screenshot here and share a link to your post in your claim description - this bounty is created by the ENB team - we will choose our favorite entry tuesday, june 18th",
      amount: "3300000000000000",
      amountSort: 0.0033,
      issuer: "0xbed82560c39c133a3d64516ecda82c71b72f3cd7",
      inProgress: false,
      isJoinedBounty: false,
      isCanceled: false,
      isMultiplayer: true,
      isVoting: false,
      deadline: 1730000000,
      maxWinners: 3,
      winnersCount: 1,
      tokenType: 0,
      tokenAddress: null,
    },
  ]);
});

app.openapi(getUserWinsRoute, (c) => {
  return c.json([
    {
      bountyId: 1337,
      chainId: 8453,
      winner: "0x18cefa841bdc634dcd640049505dbd8ae22e312f",
      claimId: 893,
      amount: "3300000000000000",
      timestamp: "1713370239000",
    },
    {
      bountyId: 420,
      chainId: 8453,
      winner: "0x18cefa841bdc634dcd640049505dbd8ae22e312f",
      claimId: 1024,
      amount: "5000000000000000",
      timestamp: "1713380000000",
    },
  ]);
});

export { app as openAPI };
