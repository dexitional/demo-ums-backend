import { 
  mysqlTable, 
  varchar, 
  int, 
  boolean, 
  timestamp, 
  datetime, 
  mysqlEnum, 
  float, 
  text, 
  longtext, 
  json, 
  date, 
  uniqueIndex 
} from "drizzle-orm/mysql-core";
import { sql, relations } from "drizzle-orm";

// ==========================================
// 1. ENUMS
// ==========================================
export const jobTypeEnum = mysqlEnum('jobType', ['TEACHING', 'NON_TEACHING']);
export const staffCategoryEnum = mysqlEnum('staffCategory', ['JUNIOR', 'SENIOR', 'SENIOR_MEMBER']);
export const scaleLevelEnum = mysqlEnum('scaleLevel', ['LEVEL_1', 'LEVEL_2', 'LEVEL_3']); // Add actuals
export const staffStatusEnum = mysqlEnum('staffStatus', ['PERMANENT', 'CONTRACT', 'CASUAL', 'RETIRED']);
export const nssStatusEnum = mysqlEnum('nssStatus', ['ACTIVE', 'COMPLETED', 'SUSPENDED']);
export const promoTypeEnum = mysqlEnum('promoType', ['APPOINTMENT', 'PROMOTION', 'UPGRADING']);
export const respondentStatusEnum = mysqlEnum('respondentStatus', ['HEAD_PENDING', 'APPROVED', 'REJECTED']);
export const positionTypeEnum = mysqlEnum('positionType', ['APPOINTMENT', 'ACTING']);
export const transferApplyTypeEnum = mysqlEnum('transferApplyType', ['INTERNAL', 'EXTERNAL']);
export const leaveStatusEnum = mysqlEnum('leaveStatus', ['PENDED', 'HEAD_PENDING', 'APPROVED', 'REJECTED']);
export const leaveConstantActionEnum = mysqlEnum('leaveConstantAction', ['ADD', 'SUBTRACT']);
export const leaveIdentifierEnum = mysqlEnum('leaveIdentifier', ['UNIT', 'JOB', 'CATEGORY']);

// ==========================================
// 2. TABLES
// ==========================================

export const staff = mysqlTable("hrs_staff", {
  staffNo: varchar("staffNo", { length: 50 }).primaryKey(),
  titleId: varchar("titleId", { length: 36 }),
  fname: varchar("fname", { length: 255 }).notNull(),
  mname: varchar("mname", { length: 350 }),
  lname: varchar("lname", { length: 255 }).notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),
  dob: date("dob"),
  maritalId: varchar("maritalId", { length: 36 }),
  disabilities: varchar("disabilities", { length: 350 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  hometown: varchar("hometown", { length: 255 }),
  birthplace: varchar("birthplace", { length: 255 }),
  district: varchar("district", { length: 255 }),
  ssnitNo: varchar("ssnitNo", { length: 255 }),
  ghcardNo: varchar("ghcardNo", { length: 255 }),
  residentAddress: varchar("residentAddress", { length: 350 }),
  ssoPhone: varchar("ssoPhone", { length: 15 }),
  ssoAddress: varchar("ssoAddress", { length: 350 }),
  occupation: varchar("occupation", { length: 350 }),
  qualification: varchar("qualification", { length: 650 }),
  instituteEmail: varchar("instituteEmail", { length: 350 }),
  countryId: varchar("countryId", { length: 36 }),
  regionId: varchar("regionId", { length: 36 }),
  religionId: varchar("religionId", { length: 36 }),
  unitId: varchar("unitId", { length: 36 }),
  jobId: varchar("jobId", { length: 36 }),
  jobMode: varchar("jobMode", { length: 350 }),
  firstOfferId: varchar("firstOfferId", { length: 36 }),
  promotionId: varchar("promotionId", { length: 36 }),
  positionId: varchar("positionId", { length: 36 }),
  status: boolean("status").default(true).notNull(),
  staffStatus: staffStatusEnum.default('PERMANENT').notNull(),
  exitDate: date("exitDate"),
  exitRemark: text("exitRemark"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
}, (t) => ({
  phoneIdx: uniqueIndex("hrs_staff_phone_unique").on(t.phone),
  emailIdx: uniqueIndex("hrs_staff_email_unique").on(t.email),
  ssnitIdx: uniqueIndex("hrs_staff_ssnit_unique").on(t.ssnitNo),
  ghcardIdx: uniqueIndex("hrs_staff_ghcard_unique").on(t.ghcardNo),
}));

export const nss = mysqlTable("hrs_nss", {
  nssNo: varchar("nssNo", { length: 50 }).primaryKey(),
  titleId: varchar("titleId", { length: 36 }),
  fname: varchar("fname", { length: 255 }).notNull(),
  mname: varchar("mname", { length: 350 }),
  lname: varchar("lname", { length: 255 }).notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),
  dob: date("dob"),
  maritalId: varchar("maritalId", { length: 36 }),
  disabilities: varchar("disabilities", { length: 350 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  hometown: varchar("hometown", { length: 255 }),
  birthplace: varchar("birthplace", { length: 255 }),
  district: varchar("district", { length: 255 }),
  ssnitNo: varchar("ssnitNo", { length: 255 }),
  ghcardNo: varchar("ghcardNo", { length: 255 }),
  residentAddress: varchar("residentAddress", { length: 350 }),
  ssoPhone: varchar("ssoPhone", { length: 15 }),
  ssoAddress: varchar("ssoAddress", { length: 350 }),
  qualification: varchar("qualification", { length: 650 }),
  countryId: varchar("countryId", { length: 36 }),
  regionId: varchar("regionId", { length: 36 }),
  religionId: varchar("religionId", { length: 36 }),
  unitId: varchar("unitId", { length: 36 }),
  nssStatus: nssStatusEnum.default('ACTIVE').notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
}, (t) => ({
  nssNoIdx: uniqueIndex("hrs_nss_no_unique").on(t.nssNo),
  phoneIdx: uniqueIndex("hrs_nss_phone_unique").on(t.phone),
  emailIdx: uniqueIndex("hrs_nss_email_unique").on(t.email),
}));

export const promotion = mysqlTable("hrs_promotion", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  staffNo: varchar("staffNo", { length: 50 }),
  jobId: varchar("jobId", { length: 36 }),
  scaleId: varchar("scaleId", { length: 36 }),
  staffCategory: staffCategoryEnum.notNull(),
  letterDate: date("letterDate"),
  effectiveDate: date("effectiveDate"),
  assumeDate: date("assumeDate"),
  confirmDate: date("confirmDate"),
  probation: int("probation"),
  type: promoTypeEnum.default('APPOINTMENT').notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const leaveRequest = mysqlTable("hrs_leave", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  leaveCategoryId: varchar("leaveCategoryId", { length: 36 }),
  staffId: varchar("staffId", { length: 50 }),
  relieverId: varchar("relieverId", { length: 50 }),
  supervisorId: varchar("supervisorId", { length: 50 }),
  approverId: varchar("approverId", { length: 50 }),
  leaveWeight: int("leaveWeight").default(0).notNull(),
  entitledWeight: int("entitledWeight").default(0).notNull(),
  sosPhone: varchar("sosPhone", { length: 20 }),
  sosAddress: varchar("sosAddress", { length: 350 }),
  supervisorRemark: text("supervisorRemark"),
  startDate: date("startDate"),
  endDate: date("endDate"),
  resumeDate: date("resumeDate"),
  approvedDate: date("approvedDate"),
  flagResumed: boolean("flagResumed").default(false).notNull(),
  status: leaveStatusEnum.notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const relative = mysqlTable("hrs_relative", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  staffId: varchar("staffId", { length: 50 }).notNull(),
  relationId: varchar("relationId", { length: 36 }).notNull(),
  titleId: varchar("titleId", { length: 36 }),
  code: varchar("code", { length: 50 }).notNull(),
  fname: varchar("fname", { length: 255 }).notNull(),
  mname: varchar("mname", { length: 350 }),
  lname: varchar("lname", { length: 255 }).notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),
  dob: datetime("dob", { mode: 'date', fsp: 3 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: varchar("address", { length: 350 }),
  isKin: boolean("isKin").default(true).notNull(),
  isAlive: boolean("isAlive").default(true).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const job = mysqlTable("hrs_job", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  title: varchar("title", { length: 255 }).notNull(),
  type: jobTypeEnum.notNull(),
  yearsToNextRank: int("yearsToNextRank"),
  allowNextRank: boolean("allowNextRank").default(true).notNull(),
  staffCategory: staffCategoryEnum,
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const scale = mysqlTable("hrs_scale", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  grade: varchar("grade", { length: 350 }),
  gradeNum: int("gradeNum"),
  notch: int("notch"),
  notchAmount: float("notchAmount"),
  level: scaleLevelEnum.notNull(),
  staffCategory: staffCategoryEnum.notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

// ==========================================
// 3. RELATIONS
// ==========================================

export const staffRelations = relations(staff, ({ one, many }) => ({
  relatives: many(relative),
  job: one(job, { fields: [staff.jobId], references: [job.id] }),
  firstOffer: one(promotion, { fields: [staff.firstOfferId], references: [promotion.id], relationName: "firstOffer" }),
  currentPromotion: one(promotion, { fields: [staff.promotionId], references: [promotion.id], relationName: "promotion" }),
  promotions: many(promotion, { relationName: "staffPromotion" }),
  leaveRequests: many(leaveRequest, { relationName: "leaveApplicant" }),
}));

export const nssRelations = relations(nss, ({ one }) => ({
  // Define relations for title, marital, unit etc based on other schema files
}));

export const promotionRelations = relations(promotion, ({ one, many }) => ({
  staff: one(staff, { fields: [promotion.staffNo], references: [staff.staffNo], relationName: "staffPromotion" }),
  job: one(job, { fields: [promotion.jobId], references: [job.id] }),
  scale: one(scale, { fields: [promotion.scaleId], references: [scale.id] }),
  firstOfferStaff: many(staff, { relationName: "firstOffer" }),
  promotedStaff: many(staff, { relationName: "promotion" }),
}));

export const leaveRequestRelations = relations(leaveRequest, ({ one }) => ({
  applicant: one(staff, { fields: [leaveRequest.staffId], references: [staff.staffNo], relationName: "leaveApplicant" }),
  supervisor: one(staff, { fields: [leaveRequest.supervisorId], references: [staff.staffNo], relationName: "leaveSupervisor" }),
  reliever: one(staff, { fields: [leaveRequest.relieverId], references: [staff.staffNo], relationName: "leaveReliever" }),
  approver: one(staff, { fields: [leaveRequest.approverId], references: [staff.staffNo], relationName: "leaveApprover" }),
}));
