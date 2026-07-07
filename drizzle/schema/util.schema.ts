import { 
    mysqlTable, 
    varchar, 
    int, 
    boolean, 
    timestamp, 
    mysqlEnum, 
    json, 
    serial 
  } from "drizzle-orm/mysql-core";
  import { sql, relations } from "drizzle-orm";
  
  // ==========================================
  // 1. ENUMS (Consolidated from util.prisma)
  // ==========================================
  
  export const entryGroupEnum = mysqlEnum('entryGroup', ['GH', 'INT']);
  export const completeTypeEnum = mysqlEnum('completeType', ['GRADUATION', 'RASTICATED', 'FORFEITED', 'DEAD', 'DISMISSED']);
  export const programCategoryEnum = mysqlEnum('programCategory', ['CP', 'DP', 'UG', 'PG']);
  export const unitTypeEnum = mysqlEnum('unitType', ['ACADEMIC', 'NON_ACADEMIC']);
  export const semesterNumbersEnum = mysqlEnum('semesterNumbers', ['1', '2']);
  export const courseTypeEnum = mysqlEnum('courseType', ['C', 'E', 'O']);
  export const scoreTypeEnum = mysqlEnum('scoreType', ['N', 'R']);
  export const courseRemarkEnum = mysqlEnum('courseRemark', ['FADED', 'ACTIVE']);
  export const deferStatusEnum = mysqlEnum('deferStatus', ['PENDED', 'APPROVED', 'DECLINED', 'RESUMED']);
  export const receiverEnum = mysqlEnum('receiver', ['APPLICANT', 'FRESHER', 'FINAL', 'STUDENT', 'UNDERGRAD', 'POSTGRAD', 'ALUMNI', 'STAFF', 'HOD', 'DEAN', 'ASSESSOR', 'DEBTOR']);
  export const pickModeEnum = mysqlEnum('pickMode', ['PICKUP', 'INLAND', 'FOREIGN']);
  export const transwiftStatusEnum = mysqlEnum('transwiftStatus', ['PENDED', 'PRINTED', 'COMPLETED']);
  export const transwiftTypeEnum = mysqlEnum('transwiftType', ['SOFTCOPY', 'HARDCOPY']);
  export const actionTypeEnum = mysqlEnum('actionType', ['APPEND', 'REPLACE']);
  export const billGroupEnum = mysqlEnum('billGroup', ['GH', 'INT']);
  export const currencyEnum = mysqlEnum('currency', ['GHC', 'USD']);
  export const chargeGroupEnum = mysqlEnum('chargeGroup', ['FINE', 'FEES', 'GRADUATION', 'RESIT']);
  export const visibilityEnum = mysqlEnum('visibility', ['PUBLIC', 'LOCAL']);
  export const payTypeEnum = mysqlEnum('payType', ['BANK', 'MOMO']);
  export const feeTypeEnum = mysqlEnum('feeType', ['NORMAL', 'SCHOLARSHIP']);
  export const transactTypeEnum = mysqlEnum('transactType', ['CHARGE', 'BILL', 'PAYMENT']);
  export const sessionModeEnum = mysqlEnum('sessionMode', ['M', 'W', 'E']);
  export const jobTypeEnum = mysqlEnum('jobType', ['ACADEMIC', 'NON_ACADEMIC']);
  export const staffCategoryEnum = mysqlEnum('staffCategory', ['JS', 'SS', 'SM']);
  export const staffStatusEnum = mysqlEnum('staffStatus', ['TEMPORAL', 'PERMANENT', 'DEAD', 'RETIRED', 'ABSENCE', 'EXITED']);
  export const nssStatusEnum = mysqlEnum('nssStatus', ['ACTIVE', 'RELEASED', 'COMPLETED']);
  export const promoTypeEnum = mysqlEnum('promoType', ['APPOINTMENT', 'PROMOTION', 'UPGRADE']);
  export const positionTypeEnum = mysqlEnum('positionType', ['APPOINTMENT', 'RENEWAL']);
  export const scaleLevelEnum = mysqlEnum('scaleLevel', ['L', 'H', 'AH']);
  export const residentialStatusEnum = mysqlEnum('residentialStatus', ['RESIDENTIAL', 'NON_RESIDENTIAL']);
  export const studyModeEnum = mysqlEnum('studyMode', ['M', 'W', 'E', 'A', 'f']);
  export const evsActionTypeEnum = mysqlEnum('EvsActionType', ['STAGED', 'STARTED', 'ENDED']);
  export const leaveStatusEnum = mysqlEnum('leaveStatus', ['HEAD_PENDING', 'HR_PENDING', 'GRANTED', 'ENDED', 'APPROVED', 'DECLINED', 'CANCELLED']);
  
  // ==========================================
  // 2. TABLES
  // ==========================================
  
  export const log = mysqlTable("log", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
    action: varchar("action", { length: 255 }).notNull(),
    user: varchar("user", { length: 255 }),
    student: varchar("student", { length: 255 }),
    meta: json("meta").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  });
  
  export const country = mysqlTable("country", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
    code: int("code"),
    shortName: varchar("shortName", { length: 10 }),
    longName: varchar("longName", { length: 255 }).notNull(),
    nationality: varchar("nationality", { length: 300 }),
    status: boolean("status").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  });
  
  export const region = mysqlTable("region", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
    tag: varchar("tag", { length: 50 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    status: boolean("status").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  });
  
  export const title = mysqlTable("title", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
    tag: varchar("tag", { length: 50 }).notNull(),
    label: varchar("label", { length: 50 }).notNull(),
    status: boolean("status").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  });
  
  export const relation = mysqlTable("relation", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
    title: varchar("title", { length: 255 }).notNull(),
    status: boolean("status").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  });
  
  export const marital = mysqlTable("marital", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
    title: varchar("title", { length: 255 }).notNull(),
    status: boolean("status").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  });
  
  export const religion = mysqlTable("religion", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
    title: varchar("title", { length: 255 }).notNull(),
    status: boolean("status").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  });
  
  export const disability = mysqlTable("disability", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
    title: varchar("title", { length: 255 }).notNull(),
    status: boolean("status").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  });
  
  export const unit = mysqlTable("unit", {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
    code: varchar("code", { length: 50 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    type: unitTypeEnum.notNull(),
    levelNum: int("levelNum").notNull(),
    level1Id: varchar("level1Id", { length: 36 }),
    level2Id: varchar("level2Id", { length: 36 }),
    level3Id: varchar("level3Id", { length: 36 }),
    location: varchar("location", { length: 255 }),
    headStaffNo: varchar("headStaffNo", { length: 50 }),
    subheadStaffNo: varchar("subheadStaffNo", { length: 50 }),
    status: boolean("status").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  });
  
  // ==========================================
  // 3. HIERARCHICAL RELATIONS (Self-joins for Unit)
  // ==========================================
  
  export const unitRelations = relations(unit, ({ one, many }) => ({
    level1: one(unit, { fields: [unit.level1Id], references: [unit.id], relationName: "level1" }),
    level2: one(unit, { fields: [unit.level2Id], references: [unit.id], relationName: "level2" }),
    level3: one(unit, { fields: [unit.level3Id], references: [unit.id], relationName: "level3" }),
    levelI: many(unit, { relationName: "level1" }),
    levelII: many(unit, { relationName: "level2" }),
    levelIII: many(unit, { relationName: "level3" }),
  }));
  