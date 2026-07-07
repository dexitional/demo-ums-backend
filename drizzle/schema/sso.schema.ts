import { 
  mysqlTable, 
  serial, 
  int, 
  varchar, 
  boolean, 
  timestamp, 
  mysqlEnum,
  uniqueIndex
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { election } from "./evs.schema"; // Import from your previously created EVS schema

// Enum Definition
export const accountTypeEnum = mysqlEnum('AccountType', ['STAFF', 'STUDENT', 'ALUMNI', 'GUEST']); // Add your actual enum values here

// Tables
export const app = mysqlTable("sso_app", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  tag: varchar("tag", { length: 50 }).notNull(),
  description: varchar("description", { length: 300 }).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const appRole = mysqlTable("sso_arole", {
  id: serial("id").primaryKey(),
  appId: int("appId").notNull(),
  title: varchar("title", { length: 300 }).notNull(),
  description: varchar("description", { length: 300 }).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const group = mysqlTable("sso_group", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  description: varchar("description", { length: 300 }).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const user = mysqlTable("sso_user", {
  id: serial("id").primaryKey(),
  groupId: int("groupId").notNull(),
  tag: varchar("tag", { length: 50 }).notNull(),
  username: varchar("username", { length: 50 }).notNull(),
  password: varchar("password", { length: 50 }).notNull(),
  unlockPin: varchar("unlockPin", { length: 4 }),
  locked: boolean("locked").default(false).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
}, (table) => ({
  tagIdx: uniqueIndex("sso_user_tag_unique").on(table.tag),
}));

export const userRole = mysqlTable("sso_urole", {
  id: serial("id").primaryKey(),
  userId: int("userId").notNull(),
  appRoleId: int("appRoleId").notNull(),
  roleMeta: varchar("roleMeta", { length: 255 }).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const provider = mysqlTable("sso_provider", {
  providerId: serial("providerId").primaryKey(),
  userId: int("userId"),
  accountType: accountTypeEnum.notNull(),
  accountId: varchar("accountId", { length: 255 }),
  accountSecret: varchar("accountSecret", { length: 255 }),
  status: boolean("status").default(true).notNull(),
});

export const support = mysqlTable("sso_support", {
  supportNo: serial("supportNo").primaryKey(),
  fname: varchar("fname", { length: 255 }).notNull(),
  mname: varchar("mname", { length: 350 }),
  lname: varchar("lname", { length: 255 }).notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }),
  address: varchar("address", { length: 350 }),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

// Relations
export const appRelations = relations(app, ({ many }) => ({
  roles: many(appRole),
  providers: many(provider),
}));

export const appRoleRelations = relations(appRole, ({ one, many }) => ({
  app: one(app, { fields: [appRole.appId], references: [app.id] }),
  userRoles: many(userRole),
}));

export const groupRelations = relations(group, ({ many }) => ({
  users: many(user),
  elections: many(election),
}));

export const userRelations = relations(user, ({ one, many }) => ({
  group: one(group, { fields: [user.groupId], references: [group.id] }),
  userRoles: many(userRole),
  providers: many(provider),
}));

export const userRoleRelations = relations(userRole, ({ one }) => ({
  user: one(user, { fields: [userRole.userId], references: [user.id] }),
  appRole: one(appRole, { fields: [userRole.appRoleId], references: [appRole.id] }),
}));

export const providerRelations = relations(provider, ({ one }) => ({
  user: one(user, { fields: [provider.userId], references: [user.id] }),
}));
