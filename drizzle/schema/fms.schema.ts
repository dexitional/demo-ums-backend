import { 
  mysqlTable, 
  varchar, 
  int, 
  boolean, 
  timestamp, 
  mysqlEnum, 
  json, 
  float, 
  text, 
  index, 
  serial 
} from "drizzle-orm/mysql-core";
import { sql, relations } from "drizzle-orm";
// Assuming these are imported from your previous consolidated pieces
import { unit } from "../schema/util.schema";
import { session, program, student } from "../schema/ais.schema";
import { fresher, admission } from "../schema/ams.schema";
import { user } from "../schema/sso.schema";

// ==========================================
// 1. ENUMS
// ==========================================
export const billGroupEnum = mysqlEnum('billGroup', ['GH', 'INT']);
export const currencyEnum = mysqlEnum('currency', ['GHC', 'USD', 'GBP', 'EUR']);
export const residentialStatusEnum = mysqlEnum('residentialStatus', ['RESIDENTIAL', 'NON_RESIDENTIAL']);
export const chargeGroupEnum = mysqlEnum('chargeGroup', ['LATE_REGISTRATION', 'PENALTY', 'OTHER']);
export const visibilityEnum = mysqlEnum('visibility', ['PUBLIC', 'PRIVATE', 'HIDDEN']);
export const payTypeEnum = mysqlEnum('payType', ['BANK', 'MOBILE_MONEY', 'CASH', 'ONLINE']);
export const feeTypeEnum = mysqlEnum('feeType', ['NORMAL', 'RESIT', 'GRADUATION', 'TRANSCRIPT']);
export const transactTypeEnum = mysqlEnum('transactType', ['DEBIT', 'CREDIT']);

// ==========================================
// 2. TABLES
// ==========================================

export const bankacc = mysqlTable("fms_bankacc", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  unitId: varchar("unitId", { length: 36 }).notNull(),
  tag: varchar("tag", { length: 255 }).notNull(),
  accountName: varchar("accountName", { length: 450 }).notNull(),
  accountDescription: varchar("accountDescription", { length: 450 }).notNull(),
  bankName: varchar("bankName", { length: 350 }).notNull(),
  bankAccount: varchar("bankAccount", { length: 30 }).notNull(),
  bankBranch: varchar("bankBranch", { length: 255 }).notNull(),
  bankContact: varchar("bankContact", { length: 20 }).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const bill = mysqlTable("fms_bill", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  sessionId: varchar("sessionId", { length: 36 }).notNull(),
  bankaccId: varchar("bankaccId", { length: 36 }),
  programId: varchar("programId", { length: 36 }),
  includeStudentIds: json("includeStudentIds"),
  excludeStudentIds: json("excludeStudentIds"),
  mainGroupCode: varchar("mainGroupCode", { length: 4 }).notNull(),
  discountGroupCode: varchar("discountGroupCode", { length: 4 }),
  narrative: varchar("narrative", { length: 255 }).notNull(),
  type: billGroupEnum.default('GH').notNull(),
  residentialStatus: residentialStatusEnum.default('RESIDENTIAL'),
  currency: currencyEnum.default('GHC').notNull(),
  amount: float("amount").notNull(),
  discount: float("discount"),
  quota: float("quota"),
  posted: boolean("posted").default(false).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const activityBill = mysqlTable("fms_activity_bill", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  billId: varchar("billId", { length: 36 }),
  userId: int("userId"),
  amount: float("amount"),
  discount: float("discount"),
  receivers: json("receivers"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const charge = mysqlTable("fms_charge", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  studentId: varchar("studentId", { length: 36 }),
  title: varchar("title", { length: 255 }).notNull(),
  type: chargeGroupEnum,
  currency: currencyEnum.default('GHC').notNull(),
  amount: float("amount").notNull(),
  posted: boolean("posted").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const collector = mysqlTable("fms_collector", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  phone: int("phone"),
  technicianName: varchar("technicianName", { length: 450 }),
  technicianPhone: int("technicianPhone"),
  apiToken: varchar("apiToken", { length: 350 }),
  apiEnabled: boolean("apiEnabled").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const transtype = mysqlTable("fms_transtype", {
  id: serial("id").primaryKey(),
  bankaccId: varchar("bankaccId", { length: 36 }),
  bankaccMeta: json("bankaccMeta"),
  title: varchar("title", { length: 255 }).notNull(),
  visibility: visibilityEnum.default('PUBLIC').notNull(),
  amountInGhc: float("amountInGhc"),
  amountInUsd: float("amountInUsd"),
  remark: varchar("remark", { length: 350 }),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const transaction = mysqlTable("fms_transaction", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  collectorId: varchar("collectorId", { length: 36 }),
  transtypeId: int("transtypeId"),
  bankaccId: varchar("bankaccId", { length: 36 }),
  studentId: varchar("studentId", { length: 36 }),
  reference: varchar("reference", { length: 255 }),
  transtag: varchar("transtag", { length: 255 }).notNull(),
  payType: payTypeEnum.default('BANK'),
  feeType: feeTypeEnum.default('NORMAL'),
  currency: currencyEnum.default('GHC').notNull(),
  amount: float("amount").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
}, (table) => ({
  tagIdx: index("fms_transaction_transtag_idx").on(table.transtag),
  studentIdx: index("fms_transaction_studentId_idx").on(table.studentId),
  refIdx: index("fms_transaction_reference_idx").on(table.reference),
}));

export const studentAccount = mysqlTable("fms_studaccount", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  studentId: varchar("studentId", { length: 36 }),
  transactId: varchar("transactId", { length: 36 }),
  sessionId: varchar("sessionId", { length: 36 }),
  chargeId: varchar("chargeId", { length: 36 }),
  billId: varchar("billId", { length: 36 }),
  type: transactTypeEnum,
  narrative: varchar("narrative", { length: 255 }).notNull(),
  currency: currencyEnum.default('GHC').notNull(),
  amount: float("amount").notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
}, (table) => ({
  billIdx: index("fms_studaccount_billId_idx").on(table.billId),
  chargeIdx: index("fms_studaccount_chargeId_idx").on(table.chargeId),
  narrIdx: index("fms_studaccount_narrative_idx").on(table.narrative),
  studIdx: index("fms_studaccount_studentId_idx").on(table.studentId),
  sessIdx: index("fms_studaccount_sessionId_idx").on(table.sessionId),
}));

export const activityFinanceApi = mysqlTable("fms_activity_api", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  ip: varchar("ip", { length: 50 }),
  title: varchar("title", { length: 255 }).notNull(),
  meta: json("meta"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const activityFinanceVoucher = mysqlTable("fms_activity_voucher", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  transactId: varchar("transactId", { length: 36 }),
  admissionId: varchar("admissionId", { length: 36 }),
  serial: varchar("serial", { length: 255 }),
  pin: varchar("pin", { length: 8 }),
  buyerName: varchar("buyerName", { length: 255 }).notNull(),
  buyerPhone: varchar("buyerPhone", { length: 15 }).notNull(),
  smsCode: int("smsCode"),
  generated: boolean("generated").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

// ==========================================
// 3. RELATIONS
// ==========================================

export const bankaccRelations = relations(bankacc, ({ one, many }) => ({
  unit: one(unit, { fields: [bankacc.unitId], references: [unit.id] }),
  bills: many(bill),
  transactions: many(transaction),
  transtypes: many(transtype),
}));

export const billRelations = relations(bill, ({ one, many }) => ({
  session: one(session, { fields: [bill.sessionId], references: [session.id] }),
  bankacc: one(bankacc, { fields: [bill.bankaccId], references: [bankacc.id] }),
  program: one(program, { fields: [bill.programId], references: [program.id] }),
  studentAccounts: many(studentAccount),
  freshers: many(fresher),
  activities: many(activityBill),
}));

export const transactionRelations = relations(transaction, ({ one, many }) => ({
  collector: one(collector, { fields: [transaction.collectorId], references: [collector.id] }),
  bankacc: one(bankacc, { fields: [transaction.bankaccId], references: [bankacc.id] }),
  student: one(student, { fields: [transaction.studentId], references: [student.id] }),
  transtype: one(transtype, { fields: [transaction.transtypeId], references: [transtype.id] }),
  studentAccounts: many(studentAccount),
  vouchers: many(activityFinanceVoucher),
}));

export const studentAccountRelations = relations(studentAccount, ({ one }) => ({
  student: one(student, { fields: [studentAccount.studentId], references: [student.id] }),
  transaction: one(transaction, { fields: [studentAccount.transactId], references: [transaction.id] }),
  session: one(session, { fields: [studentAccount.sessionId], references: [session.id] }),
  charge: one(charge, { fields: [studentAccount.chargeId], references: [charge.id] }),
  bill: one(bill, { fields: [studentAccount.billId], references: [bill.id] }),
}));
