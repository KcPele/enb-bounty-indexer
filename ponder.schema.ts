import {
  index,
  onchainTable,
  primaryKey,
  relations,
} from "ponder";

export const bounties = onchainTable(
  "Bounties",
  (t) => ({
    id: t.integer().notNull(),
    chainId: t.integer().notNull(),

    title: t.text().notNull(),
    description: t.text().notNull(),
    amount: t.text().notNull(),
    amountSort: t.real().notNull(),
    issuer: t.hex().notNull(),

    // New fields for updated contract
    maxWinners: t.integer().notNull().default(1),
    winnersCount: t.integer().notNull().default(0),
    tokenType: t.integer().notNull().default(0), // 0=ETH, 1=USDC, 2=ENB
    tokenAddress: t.hex(),

    // Status fields
    inProgress: t.boolean().default(true),
    isCanceled: t.boolean().default(false),
    isMultiplayer: t.boolean(),
    isVoting: t.boolean().default(false),
    deadline: t.integer(),
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.id, table.chainId],
    }),
    chain_idx: index().on(table.chainId),
    token_type_idx: index().on(table.tokenType),
  }),
);

export const claims = onchainTable(
  "Claims",
  (t) => ({
    id: t.integer().notNull(),
    chainId: t.integer().notNull(),

    title: t.text().notNull(),
    description: t.text().notNull(),
    url: t.text().notNull(),
    issuer: t.hex().notNull(),

    isAccepted: t.boolean().default(false),

    bountyId: t.integer().notNull(),
    owner: t.hex().notNull(),
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.id, table.chainId],
    }),
    chain_idx: index().on(table.chainId),
    bounty_idx: index().on(table.bountyId),
    owner_idx: index().on(table.owner),
  }),
);

export const users = onchainTable(
  "Users",
  (t) => ({
    address: t.hex().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.address] }),
  }),
);

export const leaderboard = onchainTable(
  "Leaderboard",
  (t) => ({
    address: t.hex().notNull(),
    chainId: t.integer().notNull(),
    earned: t.real().default(0),
    paid: t.real().default(0),
    nfts: t.real().default(0),
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.address, table.chainId],
    }),
    address_idx: index().on(table.address),
    chain_idx: index().on(table.chainId),
  }),
);

export const participationsBounties =
  onchainTable(
    "ParticipationsBounties",
    (t) => ({
      userAddress: t.hex().notNull(),
      bountyId: t.integer().notNull(),
      chainId: t.integer().notNull(),
      amount: t.text().notNull(),
    }),
    (table) => ({
      pk: primaryKey({
        columns: [
          table.userAddress,
          table.bountyId,
          table.chainId,
        ],
      }),
    }),
  );

export const transactions = onchainTable(
  "Transactions",
  (t) => ({
    tx: t.hex().notNull(),
    index: t.integer().notNull(),
    bountyId: t.integer().notNull(),
    chainId: t.integer().notNull(),
    address: t.hex().notNull(),
    action: t.text().notNull(),
    timestamp: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({
      columns: [
        table.tx,
        table.index,
        table.chainId,
      ],
    }),
  }),
);

export const bountiesRelations = relations(
  bounties,
  ({ many, one }) => ({
    claims: many(claims),
    participants: many(participationsBounties),
    issuer: one(users, {
      fields: [bounties.issuer],
      references: [users.address],
    }),
    transactions: many(transactions),
  }),
);

export const usersRelations = relations(
  users,
  ({ many, one }) => ({
    bounties: many(bounties),
    claims: many(claims),
    participations: many(participationsBounties),
    transactions: many(transactions),
    score: many(leaderboard),
  }),
);

export const claimsRelations = relations(
  claims,
  ({ one }) => ({
    bounty: one(bounties, {
      fields: [claims.bountyId, claims.chainId],
      references: [bounties.id, bounties.chainId],
    }),
    issuer: one(users, {
      fields: [claims.issuer],
      references: [users.address],
    }),
    owner: one(users, {
      fields: [claims.owner],
      references: [users.address],
    }),
  }),
);

export const participationsBountiesRelations =
  relations(
    participationsBounties,
    ({ one }) => ({
      user: one(users, {
        fields: [
          participationsBounties.userAddress,
        ],
        references: [users.address],
      }),
      bounty: one(bounties, {
        fields: [participationsBounties.bountyId],
        references: [bounties.id],
      }),
    }),
  );

export const transactionRelations = relations(
  transactions,
  ({ one }) => ({
    user: one(users, {
      fields: [transactions.address],
      references: [users.address],
    }),
    bounties: one(bounties, {
      fields: [transactions.bountyId],
      references: [bounties.id],
    }),
  }),
);

export const leaderboardRelations = relations(
  leaderboard,
  ({ one }) => ({
    user: one(users, {
      fields: [leaderboard.address],
      references: [users.address],
    }),
  }),
);

// New tables for updated contract features

export const bountyWinners = onchainTable(
  "BountyWinners",
  (t) => ({
    bountyId: t.integer().notNull(),
    chainId: t.integer().notNull(),
    winner: t.hex().notNull(),
    claimId: t.integer().notNull(),
    amount: t.text().notNull(),
    timestamp: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.bountyId, table.chainId, table.winner],
    }),
    bounty_idx: index().on(table.bountyId),
    winner_idx: index().on(table.winner),
  }),
);

export const votes = onchainTable(
  "Votes",
  (t) => ({
    bountyId: t.integer().notNull(),
    chainId: t.integer().notNull(),
    claimId: t.integer().notNull(),
    voter: t.hex().notNull(),
    vote: t.boolean().notNull(), // true=yes, false=no
    timestamp: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.bountyId, table.chainId, table.voter, table.claimId],
    }),
    bounty_idx: index().on(table.bountyId),
    claim_idx: index().on(table.claimId),
    voter_idx: index().on(table.voter),
  }),
);

export const supportedTokens = onchainTable(
  "SupportedTokens",
  (t) => ({
    address: t.hex().notNull(),
    chainId: t.integer().notNull(),
    tokenType: t.integer().notNull(),
    symbol: t.text().notNull(),
    decimals: t.integer().notNull(),
    name: t.text().notNull(),
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.address, table.chainId],
    }),
    chain_idx: index().on(table.chainId),
    type_idx: index().on(table.tokenType),
  }),
);

// Add relations for new tables
export const bountyWinnersRelations = relations(
  bountyWinners,
  ({ one }) => ({
    bounty: one(bounties, {
      fields: [bountyWinners.bountyId, bountyWinners.chainId],
      references: [bounties.id, bounties.chainId],
    }),
    winner: one(users, {
      fields: [bountyWinners.winner],
      references: [users.address],
    }),
    claim: one(claims, {
      fields: [bountyWinners.claimId, bountyWinners.chainId],
      references: [claims.id, claims.chainId],
    }),
  }),
);

export const votesRelations = relations(
  votes,
  ({ one }) => ({
    bounty: one(bounties, {
      fields: [votes.bountyId, votes.chainId],
      references: [bounties.id, bounties.chainId],
    }),
    claim: one(claims, {
      fields: [votes.claimId, votes.chainId],
      references: [claims.id, claims.chainId],
    }),
    voter: one(users, {
      fields: [votes.voter],
      references: [users.address],
    }),
  }),
);
