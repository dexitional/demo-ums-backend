"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentAccountRelations = exports.transactionRelations = exports.billRelations = exports.bankaccRelations = exports.activityFinanceVoucher = exports.activityFinanceApi = exports.studentAccount = exports.transaction = exports.transtype = exports.collector = exports.charge = exports.activityBill = exports.bill = exports.bankacc = exports.transactTypeEnum = exports.feeTypeEnum = exports.payTypeEnum = exports.visibilityEnum = exports.chargeGroupEnum = exports.residentialStatusEnum = exports.currencyEnum = exports.billGroupEnum = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
// Assuming these are imported from your previous consolidated pieces
const util_schema_1 = require("../schema/util.schema");
const ais_schema_1 = require("../schema/ais.schema");
const ams_schema_1 = require("../schema/ams.schema");
// ==========================================
// 1. ENUMS
// ==========================================
exports.billGroupEnum = (0, mysql_core_1.mysqlEnum)('billGroup', ['GH', 'INT']);
exports.currencyEnum = (0, mysql_core_1.mysqlEnum)('currency', ['GHC', 'USD', 'GBP', 'EUR']);
exports.residentialStatusEnum = (0, mysql_core_1.mysqlEnum)('residentialStatus', ['RESIDENTIAL', 'NON_RESIDENTIAL']);
exports.chargeGroupEnum = (0, mysql_core_1.mysqlEnum)('chargeGroup', ['LATE_REGISTRATION', 'PENALTY', 'OTHER']);
exports.visibilityEnum = (0, mysql_core_1.mysqlEnum)('visibility', ['PUBLIC', 'PRIVATE', 'HIDDEN']);
exports.payTypeEnum = (0, mysql_core_1.mysqlEnum)('payType', ['BANK', 'MOBILE_MONEY', 'CASH', 'ONLINE']);
exports.feeTypeEnum = (0, mysql_core_1.mysqlEnum)('feeType', ['NORMAL', 'RESIT', 'GRADUATION', 'TRANSCRIPT']);
exports.transactTypeEnum = (0, mysql_core_1.mysqlEnum)('transactType', ['DEBIT', 'CREDIT']);
// ==========================================
// 2. TABLES
// ==========================================
exports.bankacc = (0, mysql_core_1.mysqlTable)("fms_bankacc", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    unitId: (0, mysql_core_1.varchar)("unitId", { length: 36 }).notNull(),
    tag: (0, mysql_core_1.varchar)("tag", { length: 255 }).notNull(),
    accountName: (0, mysql_core_1.varchar)("accountName", { length: 450 }).notNull(),
    accountDescription: (0, mysql_core_1.varchar)("accountDescription", { length: 450 }).notNull(),
    bankName: (0, mysql_core_1.varchar)("bankName", { length: 350 }).notNull(),
    bankAccount: (0, mysql_core_1.varchar)("bankAccount", { length: 30 }).notNull(),
    bankBranch: (0, mysql_core_1.varchar)("bankBranch", { length: 255 }).notNull(),
    bankContact: (0, mysql_core_1.varchar)("bankContact", { length: 20 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.bill = (0, mysql_core_1.mysqlTable)("fms_bill", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    sessionId: (0, mysql_core_1.varchar)("sessionId", { length: 36 }).notNull(),
    bankaccId: (0, mysql_core_1.varchar)("bankaccId", { length: 36 }),
    programId: (0, mysql_core_1.varchar)("programId", { length: 36 }),
    includeStudentIds: (0, mysql_core_1.json)("includeStudentIds"),
    excludeStudentIds: (0, mysql_core_1.json)("excludeStudentIds"),
    mainGroupCode: (0, mysql_core_1.varchar)("mainGroupCode", { length: 4 }).notNull(),
    discountGroupCode: (0, mysql_core_1.varchar)("discountGroupCode", { length: 4 }),
    narrative: (0, mysql_core_1.varchar)("narrative", { length: 255 }).notNull(),
    type: exports.billGroupEnum.default('GH').notNull(),
    residentialStatus: exports.residentialStatusEnum.default('RESIDENTIAL'),
    currency: exports.currencyEnum.default('GHC').notNull(),
    amount: (0, mysql_core_1.float)("amount").notNull(),
    discount: (0, mysql_core_1.float)("discount"),
    quota: (0, mysql_core_1.float)("quota"),
    posted: (0, mysql_core_1.boolean)("posted").default(false).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.activityBill = (0, mysql_core_1.mysqlTable)("fms_activity_bill", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    billId: (0, mysql_core_1.varchar)("billId", { length: 36 }),
    userId: (0, mysql_core_1.int)("userId"),
    amount: (0, mysql_core_1.float)("amount"),
    discount: (0, mysql_core_1.float)("discount"),
    receivers: (0, mysql_core_1.json)("receivers"),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.charge = (0, mysql_core_1.mysqlTable)("fms_charge", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    studentId: (0, mysql_core_1.varchar)("studentId", { length: 36 }),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    type: exports.chargeGroupEnum,
    currency: exports.currencyEnum.default('GHC').notNull(),
    amount: (0, mysql_core_1.float)("amount").notNull(),
    posted: (0, mysql_core_1.boolean)("posted").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.collector = (0, mysql_core_1.mysqlTable)("fms_collector", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    address: (0, mysql_core_1.text)("address"),
    phone: (0, mysql_core_1.int)("phone"),
    technicianName: (0, mysql_core_1.varchar)("technicianName", { length: 450 }),
    technicianPhone: (0, mysql_core_1.int)("technicianPhone"),
    apiToken: (0, mysql_core_1.varchar)("apiToken", { length: 350 }),
    apiEnabled: (0, mysql_core_1.boolean)("apiEnabled").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.transtype = (0, mysql_core_1.mysqlTable)("fms_transtype", {
    id: (0, mysql_core_1.serial)("id").primaryKey(),
    bankaccId: (0, mysql_core_1.varchar)("bankaccId", { length: 36 }),
    bankaccMeta: (0, mysql_core_1.json)("bankaccMeta"),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    visibility: exports.visibilityEnum.default('PUBLIC').notNull(),
    amountInGhc: (0, mysql_core_1.float)("amountInGhc"),
    amountInUsd: (0, mysql_core_1.float)("amountInUsd"),
    remark: (0, mysql_core_1.varchar)("remark", { length: 350 }),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.transaction = (0, mysql_core_1.mysqlTable)("fms_transaction", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    collectorId: (0, mysql_core_1.varchar)("collectorId", { length: 36 }),
    transtypeId: (0, mysql_core_1.int)("transtypeId"),
    bankaccId: (0, mysql_core_1.varchar)("bankaccId", { length: 36 }),
    studentId: (0, mysql_core_1.varchar)("studentId", { length: 36 }),
    reference: (0, mysql_core_1.varchar)("reference", { length: 255 }),
    transtag: (0, mysql_core_1.varchar)("transtag", { length: 255 }).notNull(),
    payType: exports.payTypeEnum.default('BANK'),
    feeType: exports.feeTypeEnum.default('NORMAL'),
    currency: exports.currencyEnum.default('GHC').notNull(),
    amount: (0, mysql_core_1.float)("amount").notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
}, (table) => ({
    tagIdx: (0, mysql_core_1.index)("fms_transaction_transtag_idx").on(table.transtag),
    studentIdx: (0, mysql_core_1.index)("fms_transaction_studentId_idx").on(table.studentId),
    refIdx: (0, mysql_core_1.index)("fms_transaction_reference_idx").on(table.reference),
}));
exports.studentAccount = (0, mysql_core_1.mysqlTable)("fms_studaccount", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    studentId: (0, mysql_core_1.varchar)("studentId", { length: 36 }),
    transactId: (0, mysql_core_1.varchar)("transactId", { length: 36 }),
    sessionId: (0, mysql_core_1.varchar)("sessionId", { length: 36 }),
    chargeId: (0, mysql_core_1.varchar)("chargeId", { length: 36 }),
    billId: (0, mysql_core_1.varchar)("billId", { length: 36 }),
    type: exports.transactTypeEnum,
    narrative: (0, mysql_core_1.varchar)("narrative", { length: 255 }).notNull(),
    currency: exports.currencyEnum.default('GHC').notNull(),
    amount: (0, mysql_core_1.float)("amount").notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
}, (table) => ({
    billIdx: (0, mysql_core_1.index)("fms_studaccount_billId_idx").on(table.billId),
    chargeIdx: (0, mysql_core_1.index)("fms_studaccount_chargeId_idx").on(table.chargeId),
    narrIdx: (0, mysql_core_1.index)("fms_studaccount_narrative_idx").on(table.narrative),
    studIdx: (0, mysql_core_1.index)("fms_studaccount_studentId_idx").on(table.studentId),
    sessIdx: (0, mysql_core_1.index)("fms_studaccount_sessionId_idx").on(table.sessionId),
}));
exports.activityFinanceApi = (0, mysql_core_1.mysqlTable)("fms_activity_api", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    ip: (0, mysql_core_1.varchar)("ip", { length: 50 }),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    meta: (0, mysql_core_1.json)("meta"),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.activityFinanceVoucher = (0, mysql_core_1.mysqlTable)("fms_activity_voucher", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    transactId: (0, mysql_core_1.varchar)("transactId", { length: 36 }),
    admissionId: (0, mysql_core_1.varchar)("admissionId", { length: 36 }),
    serial: (0, mysql_core_1.varchar)("serial", { length: 255 }),
    pin: (0, mysql_core_1.varchar)("pin", { length: 8 }),
    buyerName: (0, mysql_core_1.varchar)("buyerName", { length: 255 }).notNull(),
    buyerPhone: (0, mysql_core_1.varchar)("buyerPhone", { length: 15 }).notNull(),
    smsCode: (0, mysql_core_1.int)("smsCode"),
    generated: (0, mysql_core_1.boolean)("generated").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
// ==========================================
// 3. RELATIONS
// ==========================================
exports.bankaccRelations = (0, drizzle_orm_1.relations)(exports.bankacc, ({ one, many }) => ({
    unit: one(util_schema_1.unit, { fields: [exports.bankacc.unitId], references: [util_schema_1.unit.id] }),
    bills: many(exports.bill),
    transactions: many(exports.transaction),
    transtypes: many(exports.transtype),
}));
exports.billRelations = (0, drizzle_orm_1.relations)(exports.bill, ({ one, many }) => ({
    session: one(ais_schema_1.session, { fields: [exports.bill.sessionId], references: [ais_schema_1.session.id] }),
    bankacc: one(exports.bankacc, { fields: [exports.bill.bankaccId], references: [exports.bankacc.id] }),
    program: one(ais_schema_1.program, { fields: [exports.bill.programId], references: [ais_schema_1.program.id] }),
    studentAccounts: many(exports.studentAccount),
    freshers: many(ams_schema_1.fresher),
    activities: many(exports.activityBill),
}));
exports.transactionRelations = (0, drizzle_orm_1.relations)(exports.transaction, ({ one, many }) => ({
    collector: one(exports.collector, { fields: [exports.transaction.collectorId], references: [exports.collector.id] }),
    bankacc: one(exports.bankacc, { fields: [exports.transaction.bankaccId], references: [exports.bankacc.id] }),
    student: one(ais_schema_1.student, { fields: [exports.transaction.studentId], references: [ais_schema_1.student.id] }),
    transtype: one(exports.transtype, { fields: [exports.transaction.transtypeId], references: [exports.transtype.id] }),
    studentAccounts: many(exports.studentAccount),
    vouchers: many(exports.activityFinanceVoucher),
}));
exports.studentAccountRelations = (0, drizzle_orm_1.relations)(exports.studentAccount, ({ one }) => ({
    student: one(ais_schema_1.student, { fields: [exports.studentAccount.studentId], references: [ais_schema_1.student.id] }),
    transaction: one(exports.transaction, { fields: [exports.studentAccount.transactId], references: [exports.transaction.id] }),
    session: one(ais_schema_1.session, { fields: [exports.studentAccount.sessionId], references: [ais_schema_1.session.id] }),
    charge: one(exports.charge, { fields: [exports.studentAccount.chargeId], references: [exports.charge.id] }),
    bill: one(exports.bill, { fields: [exports.studentAccount.billId], references: [exports.bill.id] }),
}));
