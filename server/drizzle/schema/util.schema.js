"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitRelations = exports.unit = exports.disability = exports.religion = exports.marital = exports.relation = exports.title = exports.region = exports.country = exports.log = exports.leaveStatusEnum = exports.evsActionTypeEnum = exports.studyModeEnum = exports.residentialStatusEnum = exports.scaleLevelEnum = exports.positionTypeEnum = exports.promoTypeEnum = exports.nssStatusEnum = exports.staffStatusEnum = exports.staffCategoryEnum = exports.jobTypeEnum = exports.sessionModeEnum = exports.transactTypeEnum = exports.feeTypeEnum = exports.payTypeEnum = exports.visibilityEnum = exports.chargeGroupEnum = exports.currencyEnum = exports.billGroupEnum = exports.actionTypeEnum = exports.transwiftTypeEnum = exports.transwiftStatusEnum = exports.pickModeEnum = exports.receiverEnum = exports.deferStatusEnum = exports.courseRemarkEnum = exports.scoreTypeEnum = exports.courseTypeEnum = exports.semesterNumbersEnum = exports.unitTypeEnum = exports.programCategoryEnum = exports.completeTypeEnum = exports.entryGroupEnum = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
// ==========================================
// 1. ENUMS (Consolidated from util.prisma)
// ==========================================
exports.entryGroupEnum = (0, mysql_core_1.mysqlEnum)('entryGroup', ['GH', 'INT']);
exports.completeTypeEnum = (0, mysql_core_1.mysqlEnum)('completeType', ['GRADUATION', 'RASTICATED', 'FORFEITED', 'DEAD', 'DISMISSED']);
exports.programCategoryEnum = (0, mysql_core_1.mysqlEnum)('programCategory', ['CP', 'DP', 'UG', 'PG']);
exports.unitTypeEnum = (0, mysql_core_1.mysqlEnum)('unitType', ['ACADEMIC', 'NON_ACADEMIC']);
exports.semesterNumbersEnum = (0, mysql_core_1.mysqlEnum)('semesterNumbers', ['1', '2']);
exports.courseTypeEnum = (0, mysql_core_1.mysqlEnum)('courseType', ['C', 'E', 'O']);
exports.scoreTypeEnum = (0, mysql_core_1.mysqlEnum)('scoreType', ['N', 'R']);
exports.courseRemarkEnum = (0, mysql_core_1.mysqlEnum)('courseRemark', ['FADED', 'ACTIVE']);
exports.deferStatusEnum = (0, mysql_core_1.mysqlEnum)('deferStatus', ['PENDED', 'APPROVED', 'DECLINED', 'RESUMED']);
exports.receiverEnum = (0, mysql_core_1.mysqlEnum)('receiver', ['APPLICANT', 'FRESHER', 'FINAL', 'STUDENT', 'UNDERGRAD', 'POSTGRAD', 'ALUMNI', 'STAFF', 'HOD', 'DEAN', 'ASSESSOR', 'DEBTOR']);
exports.pickModeEnum = (0, mysql_core_1.mysqlEnum)('pickMode', ['PICKUP', 'INLAND', 'FOREIGN']);
exports.transwiftStatusEnum = (0, mysql_core_1.mysqlEnum)('transwiftStatus', ['PENDED', 'PRINTED', 'COMPLETED']);
exports.transwiftTypeEnum = (0, mysql_core_1.mysqlEnum)('transwiftType', ['SOFTCOPY', 'HARDCOPY']);
exports.actionTypeEnum = (0, mysql_core_1.mysqlEnum)('actionType', ['APPEND', 'REPLACE']);
exports.billGroupEnum = (0, mysql_core_1.mysqlEnum)('billGroup', ['GH', 'INT']);
exports.currencyEnum = (0, mysql_core_1.mysqlEnum)('currency', ['GHC', 'USD']);
exports.chargeGroupEnum = (0, mysql_core_1.mysqlEnum)('chargeGroup', ['FINE', 'FEES', 'GRADUATION', 'RESIT']);
exports.visibilityEnum = (0, mysql_core_1.mysqlEnum)('visibility', ['PUBLIC', 'LOCAL']);
exports.payTypeEnum = (0, mysql_core_1.mysqlEnum)('payType', ['BANK', 'MOMO']);
exports.feeTypeEnum = (0, mysql_core_1.mysqlEnum)('feeType', ['NORMAL', 'SCHOLARSHIP']);
exports.transactTypeEnum = (0, mysql_core_1.mysqlEnum)('transactType', ['CHARGE', 'BILL', 'PAYMENT']);
exports.sessionModeEnum = (0, mysql_core_1.mysqlEnum)('sessionMode', ['M', 'W', 'E']);
exports.jobTypeEnum = (0, mysql_core_1.mysqlEnum)('jobType', ['ACADEMIC', 'NON_ACADEMIC']);
exports.staffCategoryEnum = (0, mysql_core_1.mysqlEnum)('staffCategory', ['JS', 'SS', 'SM']);
exports.staffStatusEnum = (0, mysql_core_1.mysqlEnum)('staffStatus', ['TEMPORAL', 'PERMANENT', 'DEAD', 'RETIRED', 'ABSENCE', 'EXITED']);
exports.nssStatusEnum = (0, mysql_core_1.mysqlEnum)('nssStatus', ['ACTIVE', 'RELEASED', 'COMPLETED']);
exports.promoTypeEnum = (0, mysql_core_1.mysqlEnum)('promoType', ['APPOINTMENT', 'PROMOTION', 'UPGRADE']);
exports.positionTypeEnum = (0, mysql_core_1.mysqlEnum)('positionType', ['APPOINTMENT', 'RENEWAL']);
exports.scaleLevelEnum = (0, mysql_core_1.mysqlEnum)('scaleLevel', ['L', 'H', 'AH']);
exports.residentialStatusEnum = (0, mysql_core_1.mysqlEnum)('residentialStatus', ['RESIDENTIAL', 'NON_RESIDENTIAL']);
exports.studyModeEnum = (0, mysql_core_1.mysqlEnum)('studyMode', ['M', 'W', 'E', 'A', 'f']);
exports.evsActionTypeEnum = (0, mysql_core_1.mysqlEnum)('EvsActionType', ['STAGED', 'STARTED', 'ENDED']);
exports.leaveStatusEnum = (0, mysql_core_1.mysqlEnum)('leaveStatus', ['HEAD_PENDING', 'HR_PENDING', 'GRANTED', 'ENDED', 'APPROVED', 'DECLINED', 'CANCELLED']);
// ==========================================
// 2. TABLES
// ==========================================
exports.log = (0, mysql_core_1.mysqlTable)("log", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    action: (0, mysql_core_1.varchar)("action", { length: 255 }).notNull(),
    user: (0, mysql_core_1.varchar)("user", { length: 255 }),
    student: (0, mysql_core_1.varchar)("student", { length: 255 }),
    meta: (0, mysql_core_1.json)("meta").notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
});
exports.country = (0, mysql_core_1.mysqlTable)("country", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    code: (0, mysql_core_1.int)("code"),
    shortName: (0, mysql_core_1.varchar)("shortName", { length: 10 }),
    longName: (0, mysql_core_1.varchar)("longName", { length: 255 }).notNull(),
    nationality: (0, mysql_core_1.varchar)("nationality", { length: 300 }),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.region = (0, mysql_core_1.mysqlTable)("region", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    tag: (0, mysql_core_1.varchar)("tag", { length: 50 }).notNull(),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.title = (0, mysql_core_1.mysqlTable)("title", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    tag: (0, mysql_core_1.varchar)("tag", { length: 50 }).notNull(),
    label: (0, mysql_core_1.varchar)("label", { length: 50 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.relation = (0, mysql_core_1.mysqlTable)("relation", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.marital = (0, mysql_core_1.mysqlTable)("marital", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.religion = (0, mysql_core_1.mysqlTable)("religion", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.disability = (0, mysql_core_1.mysqlTable)("disability", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.unit = (0, mysql_core_1.mysqlTable)("unit", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    code: (0, mysql_core_1.varchar)("code", { length: 50 }).notNull(),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    type: exports.unitTypeEnum.notNull(),
    levelNum: (0, mysql_core_1.int)("levelNum").notNull(),
    level1Id: (0, mysql_core_1.varchar)("level1Id", { length: 36 }),
    level2Id: (0, mysql_core_1.varchar)("level2Id", { length: 36 }),
    level3Id: (0, mysql_core_1.varchar)("level3Id", { length: 36 }),
    location: (0, mysql_core_1.varchar)("location", { length: 255 }),
    headStaffNo: (0, mysql_core_1.varchar)("headStaffNo", { length: 50 }),
    subheadStaffNo: (0, mysql_core_1.varchar)("subheadStaffNo", { length: 50 }),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
// ==========================================
// 3. HIERARCHICAL RELATIONS (Self-joins for Unit)
// ==========================================
exports.unitRelations = (0, drizzle_orm_1.relations)(exports.unit, ({ one, many }) => ({
    level1: one(exports.unit, { fields: [exports.unit.level1Id], references: [exports.unit.id], relationName: "level1" }),
    level2: one(exports.unit, { fields: [exports.unit.level2Id], references: [exports.unit.id], relationName: "level2" }),
    level3: one(exports.unit, { fields: [exports.unit.level3Id], references: [exports.unit.id], relationName: "level3" }),
    levelI: many(exports.unit, { relationName: "level1" }),
    levelII: many(exports.unit, { relationName: "level2" }),
    levelIII: many(exports.unit, { relationName: "level3" }),
}));
