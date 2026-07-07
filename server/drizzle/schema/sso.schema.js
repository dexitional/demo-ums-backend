"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerRelations = exports.userRoleRelations = exports.userRelations = exports.groupRelations = exports.appRoleRelations = exports.appRelations = exports.support = exports.provider = exports.userRole = exports.user = exports.group = exports.appRole = exports.app = exports.accountTypeEnum = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
const evs_schema_1 = require("./evs.schema"); // Import from your previously created EVS schema
// Enum Definition
exports.accountTypeEnum = (0, mysql_core_1.mysqlEnum)('AccountType', ['STAFF', 'STUDENT', 'ALUMNI', 'GUEST']); // Add your actual enum values here
// Tables
exports.app = (0, mysql_core_1.mysqlTable)("sso_app", {
    id: (0, mysql_core_1.serial)("id").primaryKey(),
    title: (0, mysql_core_1.varchar)("title", { length: 300 }).notNull(),
    tag: (0, mysql_core_1.varchar)("tag", { length: 50 }).notNull(),
    description: (0, mysql_core_1.varchar)("description", { length: 300 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.appRole = (0, mysql_core_1.mysqlTable)("sso_arole", {
    id: (0, mysql_core_1.serial)("id").primaryKey(),
    appId: (0, mysql_core_1.int)("appId").notNull(),
    title: (0, mysql_core_1.varchar)("title", { length: 300 }).notNull(),
    description: (0, mysql_core_1.varchar)("description", { length: 300 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.group = (0, mysql_core_1.mysqlTable)("sso_group", {
    id: (0, mysql_core_1.serial)("id").primaryKey(),
    title: (0, mysql_core_1.varchar)("title", { length: 300 }).notNull(),
    description: (0, mysql_core_1.varchar)("description", { length: 300 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.user = (0, mysql_core_1.mysqlTable)("sso_user", {
    id: (0, mysql_core_1.serial)("id").primaryKey(),
    groupId: (0, mysql_core_1.int)("groupId").notNull(),
    tag: (0, mysql_core_1.varchar)("tag", { length: 50 }).notNull(),
    username: (0, mysql_core_1.varchar)("username", { length: 50 }).notNull(),
    password: (0, mysql_core_1.varchar)("password", { length: 50 }).notNull(),
    unlockPin: (0, mysql_core_1.varchar)("unlockPin", { length: 4 }),
    locked: (0, mysql_core_1.boolean)("locked").default(false).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
}, (table) => ({
    tagIdx: (0, mysql_core_1.uniqueIndex)("sso_user_tag_unique").on(table.tag),
}));
exports.userRole = (0, mysql_core_1.mysqlTable)("sso_urole", {
    id: (0, mysql_core_1.serial)("id").primaryKey(),
    userId: (0, mysql_core_1.int)("userId").notNull(),
    appRoleId: (0, mysql_core_1.int)("appRoleId").notNull(),
    roleMeta: (0, mysql_core_1.varchar)("roleMeta", { length: 255 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.provider = (0, mysql_core_1.mysqlTable)("sso_provider", {
    providerId: (0, mysql_core_1.serial)("providerId").primaryKey(),
    userId: (0, mysql_core_1.int)("userId"),
    accountType: exports.accountTypeEnum.notNull(),
    accountId: (0, mysql_core_1.varchar)("accountId", { length: 255 }),
    accountSecret: (0, mysql_core_1.varchar)("accountSecret", { length: 255 }),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
});
exports.support = (0, mysql_core_1.mysqlTable)("sso_support", {
    supportNo: (0, mysql_core_1.serial)("supportNo").primaryKey(),
    fname: (0, mysql_core_1.varchar)("fname", { length: 255 }).notNull(),
    mname: (0, mysql_core_1.varchar)("mname", { length: 350 }),
    lname: (0, mysql_core_1.varchar)("lname", { length: 255 }).notNull(),
    gender: (0, mysql_core_1.varchar)("gender", { length: 20 }).notNull(),
    phone: (0, mysql_core_1.varchar)("phone", { length: 20 }).notNull(),
    email: (0, mysql_core_1.varchar)("email", { length: 255 }),
    address: (0, mysql_core_1.varchar)("address", { length: 350 }),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
// Relations
exports.appRelations = (0, drizzle_orm_1.relations)(exports.app, ({ many }) => ({
    roles: many(exports.appRole),
    providers: many(exports.provider),
}));
exports.appRoleRelations = (0, drizzle_orm_1.relations)(exports.appRole, ({ one, many }) => ({
    app: one(exports.app, { fields: [exports.appRole.appId], references: [exports.app.id] }),
    userRoles: many(exports.userRole),
}));
exports.groupRelations = (0, drizzle_orm_1.relations)(exports.group, ({ many }) => ({
    users: many(exports.user),
    elections: many(evs_schema_1.election),
}));
exports.userRelations = (0, drizzle_orm_1.relations)(exports.user, ({ one, many }) => ({
    group: one(exports.group, { fields: [exports.user.groupId], references: [exports.group.id] }),
    userRoles: many(exports.userRole),
    providers: many(exports.provider),
}));
exports.userRoleRelations = (0, drizzle_orm_1.relations)(exports.userRole, ({ one }) => ({
    user: one(exports.user, { fields: [exports.userRole.userId], references: [exports.user.id] }),
    appRole: one(exports.appRole, { fields: [exports.userRole.appRoleId], references: [exports.appRole.id] }),
}));
exports.providerRelations = (0, drizzle_orm_1.relations)(exports.provider, ({ one }) => ({
    user: one(exports.user, { fields: [exports.provider.userId], references: [exports.user.id] }),
}));
