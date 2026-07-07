"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveRequestRelations = exports.promotionRelations = exports.nssRelations = exports.staffRelations = exports.scale = exports.job = exports.relative = exports.leaveRequest = exports.promotion = exports.nss = exports.staff = exports.leaveIdentifierEnum = exports.leaveConstantActionEnum = exports.leaveStatusEnum = exports.transferApplyTypeEnum = exports.positionTypeEnum = exports.respondentStatusEnum = exports.promoTypeEnum = exports.nssStatusEnum = exports.staffStatusEnum = exports.scaleLevelEnum = exports.staffCategoryEnum = exports.jobTypeEnum = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
// ==========================================
// 1. ENUMS
// ==========================================
exports.jobTypeEnum = (0, mysql_core_1.mysqlEnum)('jobType', ['TEACHING', 'NON_TEACHING']);
exports.staffCategoryEnum = (0, mysql_core_1.mysqlEnum)('staffCategory', ['JUNIOR', 'SENIOR', 'SENIOR_MEMBER']);
exports.scaleLevelEnum = (0, mysql_core_1.mysqlEnum)('scaleLevel', ['LEVEL_1', 'LEVEL_2', 'LEVEL_3']); // Add actuals
exports.staffStatusEnum = (0, mysql_core_1.mysqlEnum)('staffStatus', ['PERMANENT', 'CONTRACT', 'CASUAL', 'RETIRED']);
exports.nssStatusEnum = (0, mysql_core_1.mysqlEnum)('nssStatus', ['ACTIVE', 'COMPLETED', 'SUSPENDED']);
exports.promoTypeEnum = (0, mysql_core_1.mysqlEnum)('promoType', ['APPOINTMENT', 'PROMOTION', 'UPGRADING']);
exports.respondentStatusEnum = (0, mysql_core_1.mysqlEnum)('respondentStatus', ['HEAD_PENDING', 'APPROVED', 'REJECTED']);
exports.positionTypeEnum = (0, mysql_core_1.mysqlEnum)('positionType', ['APPOINTMENT', 'ACTING']);
exports.transferApplyTypeEnum = (0, mysql_core_1.mysqlEnum)('transferApplyType', ['INTERNAL', 'EXTERNAL']);
exports.leaveStatusEnum = (0, mysql_core_1.mysqlEnum)('leaveStatus', ['PENDED', 'HEAD_PENDING', 'APPROVED', 'REJECTED']);
exports.leaveConstantActionEnum = (0, mysql_core_1.mysqlEnum)('leaveConstantAction', ['ADD', 'SUBTRACT']);
exports.leaveIdentifierEnum = (0, mysql_core_1.mysqlEnum)('leaveIdentifier', ['UNIT', 'JOB', 'CATEGORY']);
// ==========================================
// 2. TABLES
// ==========================================
exports.staff = (0, mysql_core_1.mysqlTable)("hrs_staff", {
    staffNo: (0, mysql_core_1.varchar)("staffNo", { length: 50 }).primaryKey(),
    titleId: (0, mysql_core_1.varchar)("titleId", { length: 36 }),
    fname: (0, mysql_core_1.varchar)("fname", { length: 255 }).notNull(),
    mname: (0, mysql_core_1.varchar)("mname", { length: 350 }),
    lname: (0, mysql_core_1.varchar)("lname", { length: 255 }).notNull(),
    gender: (0, mysql_core_1.varchar)("gender", { length: 20 }).notNull(),
    dob: (0, mysql_core_1.date)("dob"),
    maritalId: (0, mysql_core_1.varchar)("maritalId", { length: 36 }),
    disabilities: (0, mysql_core_1.varchar)("disabilities", { length: 350 }),
    phone: (0, mysql_core_1.varchar)("phone", { length: 20 }),
    email: (0, mysql_core_1.varchar)("email", { length: 255 }),
    hometown: (0, mysql_core_1.varchar)("hometown", { length: 255 }),
    birthplace: (0, mysql_core_1.varchar)("birthplace", { length: 255 }),
    district: (0, mysql_core_1.varchar)("district", { length: 255 }),
    ssnitNo: (0, mysql_core_1.varchar)("ssnitNo", { length: 255 }),
    ghcardNo: (0, mysql_core_1.varchar)("ghcardNo", { length: 255 }),
    residentAddress: (0, mysql_core_1.varchar)("residentAddress", { length: 350 }),
    ssoPhone: (0, mysql_core_1.varchar)("ssoPhone", { length: 15 }),
    ssoAddress: (0, mysql_core_1.varchar)("ssoAddress", { length: 350 }),
    occupation: (0, mysql_core_1.varchar)("occupation", { length: 350 }),
    qualification: (0, mysql_core_1.varchar)("qualification", { length: 650 }),
    instituteEmail: (0, mysql_core_1.varchar)("instituteEmail", { length: 350 }),
    countryId: (0, mysql_core_1.varchar)("countryId", { length: 36 }),
    regionId: (0, mysql_core_1.varchar)("regionId", { length: 36 }),
    religionId: (0, mysql_core_1.varchar)("religionId", { length: 36 }),
    unitId: (0, mysql_core_1.varchar)("unitId", { length: 36 }),
    jobId: (0, mysql_core_1.varchar)("jobId", { length: 36 }),
    jobMode: (0, mysql_core_1.varchar)("jobMode", { length: 350 }),
    firstOfferId: (0, mysql_core_1.varchar)("firstOfferId", { length: 36 }),
    promotionId: (0, mysql_core_1.varchar)("promotionId", { length: 36 }),
    positionId: (0, mysql_core_1.varchar)("positionId", { length: 36 }),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    staffStatus: exports.staffStatusEnum.default('PERMANENT').notNull(),
    exitDate: (0, mysql_core_1.date)("exitDate"),
    exitRemark: (0, mysql_core_1.text)("exitRemark"),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
}, (t) => ({
    phoneIdx: (0, mysql_core_1.uniqueIndex)("hrs_staff_phone_unique").on(t.phone),
    emailIdx: (0, mysql_core_1.uniqueIndex)("hrs_staff_email_unique").on(t.email),
    ssnitIdx: (0, mysql_core_1.uniqueIndex)("hrs_staff_ssnit_unique").on(t.ssnitNo),
    ghcardIdx: (0, mysql_core_1.uniqueIndex)("hrs_staff_ghcard_unique").on(t.ghcardNo),
}));
exports.nss = (0, mysql_core_1.mysqlTable)("hrs_nss", {
    nssNo: (0, mysql_core_1.varchar)("nssNo", { length: 50 }).primaryKey(),
    titleId: (0, mysql_core_1.varchar)("titleId", { length: 36 }),
    fname: (0, mysql_core_1.varchar)("fname", { length: 255 }).notNull(),
    mname: (0, mysql_core_1.varchar)("mname", { length: 350 }),
    lname: (0, mysql_core_1.varchar)("lname", { length: 255 }).notNull(),
    gender: (0, mysql_core_1.varchar)("gender", { length: 20 }).notNull(),
    dob: (0, mysql_core_1.date)("dob"),
    maritalId: (0, mysql_core_1.varchar)("maritalId", { length: 36 }),
    disabilities: (0, mysql_core_1.varchar)("disabilities", { length: 350 }),
    phone: (0, mysql_core_1.varchar)("phone", { length: 20 }),
    email: (0, mysql_core_1.varchar)("email", { length: 255 }),
    hometown: (0, mysql_core_1.varchar)("hometown", { length: 255 }),
    birthplace: (0, mysql_core_1.varchar)("birthplace", { length: 255 }),
    district: (0, mysql_core_1.varchar)("district", { length: 255 }),
    ssnitNo: (0, mysql_core_1.varchar)("ssnitNo", { length: 255 }),
    ghcardNo: (0, mysql_core_1.varchar)("ghcardNo", { length: 255 }),
    residentAddress: (0, mysql_core_1.varchar)("residentAddress", { length: 350 }),
    ssoPhone: (0, mysql_core_1.varchar)("ssoPhone", { length: 15 }),
    ssoAddress: (0, mysql_core_1.varchar)("ssoAddress", { length: 350 }),
    qualification: (0, mysql_core_1.varchar)("qualification", { length: 650 }),
    countryId: (0, mysql_core_1.varchar)("countryId", { length: 36 }),
    regionId: (0, mysql_core_1.varchar)("regionId", { length: 36 }),
    religionId: (0, mysql_core_1.varchar)("religionId", { length: 36 }),
    unitId: (0, mysql_core_1.varchar)("unitId", { length: 36 }),
    nssStatus: exports.nssStatusEnum.default('ACTIVE').notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
}, (t) => ({
    nssNoIdx: (0, mysql_core_1.uniqueIndex)("hrs_nss_no_unique").on(t.nssNo),
    phoneIdx: (0, mysql_core_1.uniqueIndex)("hrs_nss_phone_unique").on(t.phone),
    emailIdx: (0, mysql_core_1.uniqueIndex)("hrs_nss_email_unique").on(t.email),
}));
exports.promotion = (0, mysql_core_1.mysqlTable)("hrs_promotion", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    staffNo: (0, mysql_core_1.varchar)("staffNo", { length: 50 }),
    jobId: (0, mysql_core_1.varchar)("jobId", { length: 36 }),
    scaleId: (0, mysql_core_1.varchar)("scaleId", { length: 36 }),
    staffCategory: exports.staffCategoryEnum.notNull(),
    letterDate: (0, mysql_core_1.date)("letterDate"),
    effectiveDate: (0, mysql_core_1.date)("effectiveDate"),
    assumeDate: (0, mysql_core_1.date)("assumeDate"),
    confirmDate: (0, mysql_core_1.date)("confirmDate"),
    probation: (0, mysql_core_1.int)("probation"),
    type: exports.promoTypeEnum.default('APPOINTMENT').notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.leaveRequest = (0, mysql_core_1.mysqlTable)("hrs_leave", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    leaveCategoryId: (0, mysql_core_1.varchar)("leaveCategoryId", { length: 36 }),
    staffId: (0, mysql_core_1.varchar)("staffId", { length: 50 }),
    relieverId: (0, mysql_core_1.varchar)("relieverId", { length: 50 }),
    supervisorId: (0, mysql_core_1.varchar)("supervisorId", { length: 50 }),
    approverId: (0, mysql_core_1.varchar)("approverId", { length: 50 }),
    leaveWeight: (0, mysql_core_1.int)("leaveWeight").default(0).notNull(),
    entitledWeight: (0, mysql_core_1.int)("entitledWeight").default(0).notNull(),
    sosPhone: (0, mysql_core_1.varchar)("sosPhone", { length: 20 }),
    sosAddress: (0, mysql_core_1.varchar)("sosAddress", { length: 350 }),
    supervisorRemark: (0, mysql_core_1.text)("supervisorRemark"),
    startDate: (0, mysql_core_1.date)("startDate"),
    endDate: (0, mysql_core_1.date)("endDate"),
    resumeDate: (0, mysql_core_1.date)("resumeDate"),
    approvedDate: (0, mysql_core_1.date)("approvedDate"),
    flagResumed: (0, mysql_core_1.boolean)("flagResumed").default(false).notNull(),
    status: exports.leaveStatusEnum.notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.relative = (0, mysql_core_1.mysqlTable)("hrs_relative", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    staffId: (0, mysql_core_1.varchar)("staffId", { length: 50 }).notNull(),
    relationId: (0, mysql_core_1.varchar)("relationId", { length: 36 }).notNull(),
    titleId: (0, mysql_core_1.varchar)("titleId", { length: 36 }),
    code: (0, mysql_core_1.varchar)("code", { length: 50 }).notNull(),
    fname: (0, mysql_core_1.varchar)("fname", { length: 255 }).notNull(),
    mname: (0, mysql_core_1.varchar)("mname", { length: 350 }),
    lname: (0, mysql_core_1.varchar)("lname", { length: 255 }).notNull(),
    gender: (0, mysql_core_1.varchar)("gender", { length: 20 }).notNull(),
    dob: (0, mysql_core_1.datetime)("dob", { mode: 'date', fsp: 3 }).notNull(),
    phone: (0, mysql_core_1.varchar)("phone", { length: 20 }).notNull(),
    address: (0, mysql_core_1.varchar)("address", { length: 350 }),
    isKin: (0, mysql_core_1.boolean)("isKin").default(true).notNull(),
    isAlive: (0, mysql_core_1.boolean)("isAlive").default(true).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.job = (0, mysql_core_1.mysqlTable)("hrs_job", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    type: exports.jobTypeEnum.notNull(),
    yearsToNextRank: (0, mysql_core_1.int)("yearsToNextRank"),
    allowNextRank: (0, mysql_core_1.boolean)("allowNextRank").default(true).notNull(),
    staffCategory: exports.staffCategoryEnum,
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.scale = (0, mysql_core_1.mysqlTable)("hrs_scale", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    grade: (0, mysql_core_1.varchar)("grade", { length: 350 }),
    gradeNum: (0, mysql_core_1.int)("gradeNum"),
    notch: (0, mysql_core_1.int)("notch"),
    notchAmount: (0, mysql_core_1.float)("notchAmount"),
    level: exports.scaleLevelEnum.notNull(),
    staffCategory: exports.staffCategoryEnum.notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
// ==========================================
// 3. RELATIONS
// ==========================================
exports.staffRelations = (0, drizzle_orm_1.relations)(exports.staff, ({ one, many }) => ({
    relatives: many(exports.relative),
    job: one(exports.job, { fields: [exports.staff.jobId], references: [exports.job.id] }),
    firstOffer: one(exports.promotion, { fields: [exports.staff.firstOfferId], references: [exports.promotion.id], relationName: "firstOffer" }),
    currentPromotion: one(exports.promotion, { fields: [exports.staff.promotionId], references: [exports.promotion.id], relationName: "promotion" }),
    promotions: many(exports.promotion, { relationName: "staffPromotion" }),
    leaveRequests: many(exports.leaveRequest, { relationName: "leaveApplicant" }),
}));
exports.nssRelations = (0, drizzle_orm_1.relations)(exports.nss, ({ one }) => ({
// Define relations for title, marital, unit etc based on other schema files
}));
exports.promotionRelations = (0, drizzle_orm_1.relations)(exports.promotion, ({ one, many }) => ({
    staff: one(exports.staff, { fields: [exports.promotion.staffNo], references: [exports.staff.staffNo], relationName: "staffPromotion" }),
    job: one(exports.job, { fields: [exports.promotion.jobId], references: [exports.job.id] }),
    scale: one(exports.scale, { fields: [exports.promotion.scaleId], references: [exports.scale.id] }),
    firstOfferStaff: many(exports.staff, { relationName: "firstOffer" }),
    promotedStaff: many(exports.staff, { relationName: "promotion" }),
}));
exports.leaveRequestRelations = (0, drizzle_orm_1.relations)(exports.leaveRequest, ({ one }) => ({
    applicant: one(exports.staff, { fields: [exports.leaveRequest.staffId], references: [exports.staff.staffNo], relationName: "leaveApplicant" }),
    supervisor: one(exports.staff, { fields: [exports.leaveRequest.supervisorId], references: [exports.staff.staffNo], relationName: "leaveSupervisor" }),
    reliever: one(exports.staff, { fields: [exports.leaveRequest.relieverId], references: [exports.staff.staffNo], relationName: "leaveReliever" }),
    approver: one(exports.staff, { fields: [exports.leaveRequest.approverId], references: [exports.staff.staffNo], relationName: "leaveApprover" }),
}));
