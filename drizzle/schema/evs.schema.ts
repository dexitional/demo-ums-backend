import { relations } from "drizzle-orm";
import {
  boolean,
  datetime,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar
} from "drizzle-orm/mysql-core";

// 1. Enum Definition
export const evsActionTypeEnum = mysqlEnum('EvsActionType', ['STAGED', 'STARTED', 'ENDED', 'PAUSED']);

// 2. Table Definitions
export const election = mysqlTable("evs_election", {
  id: serial("id").primaryKey(),
  groupId: int("groupId"),
  type: varchar("type", { length: 300 }).notNull(),
  title: varchar("title", { length: 450 }),
  tag: varchar("tag", { length: 100 }),
  logo: varchar("logo", { length: 450 }),
  admins: json("admins"),
  voterCount: int("voterCount").default(0).notNull(),
  voterList: json("voterList"),
  voterData: json("voterData"),
  allowMonitor: boolean("allowMonitor").default(false).notNull(),
  allowEcMonitor: boolean("allowEcMonitor").default(false).notNull(),
  allowVip: boolean("allowVip").default(false).notNull(),
  allowEcVip: boolean("allowEcVip").default(false).notNull(),
  allowResult: boolean("allowResult").default(false).notNull(),
  allowEcResult: boolean("allowEcResult").default(false).notNull(),
  allowMask: boolean("allowMask").default(false).notNull(),
  autoStop: boolean("autoStop").default(false).notNull(),
  startAt: datetime("startAt"),
  endAt: datetime("endAt"),
  action: evsActionTypeEnum.default('STAGED').notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const elector = mysqlTable("evs_elector", {
  id: serial("id").primaryKey(),
  electionId: int("electionId").notNull(),
  tag: varchar("tag", { length: 100 }),
  name: varchar("name", { length: 450 }),
  descriptor: varchar("descriptor", { length: 450 }),
  gender: varchar("gender", { length: 1 }),
  voteTime: timestamp("voteTime").defaultNow().notNull(),
  voteSum: varchar("voteSum", { length: 750 }),
  voteHash: varchar("voteHash", { length: 100 }),
  voteIp: varchar("voteIp", { length: 50 }),
  voteStatus: boolean("voteStatus").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const portfolio = mysqlTable("evs_portfolio", {
  id: serial("id").primaryKey(),
  electionId: int("electionId").notNull(),
  title: text("title"),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const candidate = mysqlTable("evs_candidate", {
  id: serial("id").primaryKey(),
  portfolioId: int("portfolioId"),
  tag: varchar("tag", { length: 100 }),
  name: varchar("name", { length: 450 }),
  teaser: varchar("teaser", { length: 100 }),
  orderNo: int("orderNo").default(1).notNull(),
  photo: varchar("photo", { length: 450 }),
  votes: int("votes").default(0).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const attack = mysqlTable("evs_attack", {
  id: serial("id").primaryKey(),
  electionId: int("electionId"),
  tag: varchar("tag", { length: 100 }),
  location: varchar("location", { length: 450 }),
  ip: varchar("ip", { length: 50 }),
  meta: text("meta"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// 3. Relation Definitions (Optional but recommended for Relational Query Builder)
export const electionRelations = relations(election, ({ many }) => ({
  portfolios: many(portfolio),
  electors: many(elector),
  attacks: many(attack),
}));

export const portfolioRelations = relations(portfolio, ({ one, many }) => ({
  election: one(election, { fields: [portfolio.electionId], references: [election.id] }),
  candidates: many(candidate),
}));

export const candidateRelations = relations(candidate, ({ one }) => ({
  portfolio: one(portfolio, { fields: [candidate.portfolioId], references: [portfolio.id] }),
}));
