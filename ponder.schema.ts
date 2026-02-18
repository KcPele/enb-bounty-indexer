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

    createdAt: t.bigint().notNull().default(0n),
    deadline: t.bigint().notNull().default(0n),

    // Position-based bounty
    isPositionBased: t.boolean().default(false),

    // Status fields
    inProgress: t.boolean().default(true),
    isCanceled: t.boolean().default(false),
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
    amount: t.text().notNull(),
    positionIndex: t.integer(),
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
  }),
);

