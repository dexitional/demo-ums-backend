"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.candidateRelations = exports.portfolioRelations = exports.electionRelations = exports.attack = exports.candidate = exports.portfolio = exports.elector = exports.election = exports.evsActionTypeEnum = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_1 = require("drizzle-orm/mysql-core");
// 1. Enum Definition
exports.evsActionTypeEnum = (0, mysql_core_1.mysqlEnum)('EvsActionType', ['STAGED', 'STARTED', 'ENDED', 'PAUSED']);
// 2. Table Definitions
exports.election = (0, mysql_core_1.mysqlTable)("evs_election", {
    id: (0, mysql_core_1.serial)("id").primaryKey(),
    groupId: (0, mysql_core_1.int)("groupId"),
    type: (0, mysql_core_1.varchar)("type", { length: 300 }).notNull(),
    title: (0, mysql_core_1.varchar)("title", { length: 450 }),
    tag: (0, mysql_core_1.varchar)("tag", { length: 100 }),
    logo: (0, mysql_core_1.varchar)("logo", { length: 450 }),
    admins: (0, mysql_core_1.json)("admins"),
    voterCount: (0, mysql_core_1.int)("voterCount").default(0).notNull(),
    voterList: (0, mysql_core_1.json)("voterList"),
    voterData: (0, mysql_core_1.json)("voterData"),
    allowMonitor: (0, mysql_core_1.boolean)("allowMonitor").default(false).notNull(),
    allowEcMonitor: (0, mysql_core_1.boolean)("allowEcMonitor").default(false).notNull(),
    allowVip: (0, mysql_core_1.boolean)("allowVip").default(false).notNull(),
    allowEcVip: (0, mysql_core_1.boolean)("allowEcVip").default(false).notNull(),
    allowResult: (0, mysql_core_1.boolean)("allowResult").default(false).notNull(),
    allowEcResult: (0, mysql_core_1.boolean)("allowEcResult").default(false).notNull(),
    allowMask: (0, mysql_core_1.boolean)("allowMask").default(false).notNull(),
    autoStop: (0, mysql_core_1.boolean)("autoStop").default(false).notNull(),
    startAt: (0, mysql_core_1.datetime)("startAt"),
    endAt: (0, mysql_core_1.datetime)("endAt"),
    action: exports.evsActionTypeEnum.default('STAGED').notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.elector = (0, mysql_core_1.mysqlTable)("evs_elector", {
    id: (0, mysql_core_1.serial)("id").primaryKey(),
    electionId: (0, mysql_core_1.int)("electionId").notNull(),
    tag: (0, mysql_core_1.varchar)("tag", { length: 100 }),
    name: (0, mysql_core_1.varchar)("name", { length: 450 }),
    descriptor: (0, mysql_core_1.varchar)("descriptor", { length: 450 }),
    gender: (0, mysql_core_1.varchar)("gender", { length: 1 }),
    voteTime: (0, mysql_core_1.timestamp)("voteTime").defaultNow().notNull(),
    voteSum: (0, mysql_core_1.varchar)("voteSum", { length: 750 }),
    voteHash: (0, mysql_core_1.varchar)("voteHash", { length: 100 }),
    voteIp: (0, mysql_core_1.varchar)("voteIp", { length: 50 }),
    voteStatus: (0, mysql_core_1.boolean)("voteStatus").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.portfolio = (0, mysql_core_1.mysqlTable)("evs_portfolio", {
    id: (0, mysql_core_1.serial)("id").primaryKey(),
    electionId: (0, mysql_core_1.int)("electionId").notNull(),
    title: (0, mysql_core_1.text)("title"),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.candidate = (0, mysql_core_1.mysqlTable)("evs_candidate", {
    id: (0, mysql_core_1.serial)("id").primaryKey(),
    portfolioId: (0, mysql_core_1.int)("portfolioId"),
    tag: (0, mysql_core_1.varchar)("tag", { length: 100 }),
    name: (0, mysql_core_1.varchar)("name", { length: 450 }),
    teaser: (0, mysql_core_1.varchar)("teaser", { length: 100 }),
    orderNo: (0, mysql_core_1.int)("orderNo").default(1).notNull(),
    photo: (0, mysql_core_1.varchar)("photo", { length: 450 }),
    votes: (0, mysql_core_1.int)("votes").default(0).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.attack = (0, mysql_core_1.mysqlTable)("evs_attack", {
    id: (0, mysql_core_1.serial)("id").primaryKey(),
    electionId: (0, mysql_core_1.int)("electionId"),
    tag: (0, mysql_core_1.varchar)("tag", { length: 100 }),
    location: (0, mysql_core_1.varchar)("location", { length: 450 }),
    ip: (0, mysql_core_1.varchar)("ip", { length: 50 }),
    meta: (0, mysql_core_1.text)("meta"),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
});
// 3. Relation Definitions (Optional but recommended for Relational Query Builder)
exports.electionRelations = (0, drizzle_orm_1.relations)(exports.election, ({ many }) => ({
    portfolios: many(exports.portfolio),
    electors: many(exports.elector),
    attacks: many(exports.attack),
}));
exports.portfolioRelations = (0, drizzle_orm_1.relations)(exports.portfolio, ({ one, many }) => ({
    election: one(exports.election, { fields: [exports.portfolio.electionId], references: [exports.election.id] }),
    candidates: many(exports.candidate),
}));
exports.candidateRelations = (0, drizzle_orm_1.relations)(exports.candidate, ({ one }) => ({
    portfolio: one(exports.portfolio, { fields: [exports.candidate.portfolioId], references: [exports.portfolio.id] }),
}));
