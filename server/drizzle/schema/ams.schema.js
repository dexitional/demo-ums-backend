"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortedApplicantRelations = exports.stepGradeRelations = exports.stepResultRelations = exports.applicantRelations = exports.admissionRelations = exports.stepReferee = exports.stepChoice = exports.stepDocument = exports.stepGrade = exports.stepResult = exports.stepEducation = exports.stepProfile = exports.fresher = exports.applicant = exports.sortedApplicant = exports.admission = exports.voucher = exports.admissionLetter = exports.applyType = exports.stage = exports.amsForm = exports.amsPrice = exports.subject = exports.gradeWeight = exports.instituteCategory = exports.certCategory = exports.examCategory = exports.category = exports.vendor = exports.activityApplicant = exports.sessionModeEnum = exports.studyModeEnum = exports.residentialStatusEnum = exports.currencyEnum = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
// ==========================================
// 1. ENUMS
// ==========================================
exports.currencyEnum = (0, mysql_core_1.mysqlEnum)('currency', ['GHC', 'USD', 'GBP', 'EUR']);
exports.residentialStatusEnum = (0, mysql_core_1.mysqlEnum)('residentialStatus', ['RESIDENT', 'NON_RESIDENT']);
exports.studyModeEnum = (0, mysql_core_1.mysqlEnum)('studyMode', ['MORNING', 'EVENING', 'WEEKEND']);
exports.sessionModeEnum = (0, mysql_core_1.mysqlEnum)('sessionMode', ['MORNING', 'EVENING', 'WEEKEND']);
// ==========================================
// 2. TABLES
// ==========================================
exports.activityApplicant = (0, mysql_core_1.mysqlTable)("ams_activity_applicant", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    serial: (0, mysql_core_1.int)("serial"),
    meta: (0, mysql_core_1.json)("meta"),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.vendor = (0, mysql_core_1.mysqlTable)("ams_vendor", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    phone: (0, mysql_core_1.varchar)("phone", { length: 50 }).notNull(),
    email: (0, mysql_core_1.varchar)("email", { length: 255 }).notNull(),
    address: (0, mysql_core_1.varchar)("address", { length: 350 }).notNull(),
    technicianName: (0, mysql_core_1.varchar)("technicianName", { length: 255 }).notNull(),
    technicianPhone: (0, mysql_core_1.varchar)("technicianPhone", { length: 50 }).notNull(),
    technicianEmail: (0, mysql_core_1.varchar)("technicianEmail", { length: 255 }).notNull(),
    verified: (0, mysql_core_1.boolean)("verified").default(true).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.category = (0, mysql_core_1.mysqlTable)("ams_category", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey(),
    title: (0, mysql_core_1.varchar)("title", { length: 100 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.examCategory = (0, mysql_core_1.mysqlTable)("ams_exam_category", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    title: (0, mysql_core_1.varchar)("title", { length: 100 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.certCategory = (0, mysql_core_1.mysqlTable)("ams_cert_category", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    instituteCategoryId: (0, mysql_core_1.varchar)("instituteCategoryId", { length: 36 }),
    title: (0, mysql_core_1.varchar)("title", { length: 100 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.instituteCategory = (0, mysql_core_1.mysqlTable)("ams_institute_category", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    title: (0, mysql_core_1.varchar)("title", { length: 100 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.gradeWeight = (0, mysql_core_1.mysqlTable)("ams_grade_weight", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    certCategoryId: (0, mysql_core_1.varchar)("certCategoryId", { length: 36 }),
    title: (0, mysql_core_1.varchar)("title", { length: 100 }).notNull(),
    weight: (0, mysql_core_1.tinyint)("weight"),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.subject = (0, mysql_core_1.mysqlTable)("ams_subject", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.amsPrice = (0, mysql_core_1.mysqlTable)("ams_price", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    categoryId: (0, mysql_core_1.varchar)("categoryId", { length: 36 }),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    sellType: (0, mysql_core_1.int)("sellType"),
    currency: exports.currencyEnum.default('GHC').notNull(),
    amount: (0, mysql_core_1.float)("amount").notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.amsForm = (0, mysql_core_1.mysqlTable)("ams_form", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    categoryId: (0, mysql_core_1.varchar)("categoryId", { length: 36 }),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    meta: (0, mysql_core_1.json)("meta"),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.stage = (0, mysql_core_1.mysqlTable)("ams_stage", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    categoryId: (0, mysql_core_1.varchar)("categoryId", { length: 36 }),
    formId: (0, mysql_core_1.varchar)("formId", { length: 36 }).notNull(),
    title: (0, mysql_core_1.varchar)("title", { length: 350 }).notNull(),
    sellType: (0, mysql_core_1.int)("sellType"),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.applyType = (0, mysql_core_1.mysqlTable)("ams_applytype", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    title: (0, mysql_core_1.varchar)("title", { length: 350 }).notNull(),
    stages: (0, mysql_core_1.json)("stages").notNull(),
    letterCondition: (0, mysql_core_1.varchar)("letterCondition", { length: 255 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.admissionLetter = (0, mysql_core_1.mysqlTable)("ams_letter", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    categoryId: (0, mysql_core_1.varchar)("categoryId", { length: 36 }),
    title: (0, mysql_core_1.varchar)("title", { length: 350 }).notNull(),
    signatory: (0, mysql_core_1.text)("signatory").notNull(),
    signature: (0, mysql_core_1.longtext)("signature").notNull(),
    template: (0, mysql_core_1.longtext)("template").notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.voucher = (0, mysql_core_1.mysqlTable)("ams_voucher", {
    serial: (0, mysql_core_1.varchar)("serial", { length: 255 }).primaryKey(),
    pin: (0, mysql_core_1.varchar)("pin", { length: 255 }).notNull(),
    admissionId: (0, mysql_core_1.varchar)("admissionId", { length: 36 }),
    vendorId: (0, mysql_core_1.varchar)("vendorId", { length: 36 }),
    categoryId: (0, mysql_core_1.varchar)("categoryId", { length: 36 }),
    sellType: (0, mysql_core_1.int)("sellType"),
    applicantName: (0, mysql_core_1.varchar)("applicantName", { length: 255 }),
    applicantPhone: (0, mysql_core_1.varchar)("applicantPhone", { length: 50 }),
    sold: (0, mysql_core_1.boolean)("sold").default(false).notNull(),
    soldAt: (0, mysql_core_1.datetime)("soldAt"),
    soldBy: (0, mysql_core_1.varchar)("soldBy", { length: 255 }),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.admission = (0, mysql_core_1.mysqlTable)("ams_admission", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    pgletterId: (0, mysql_core_1.varchar)("pgletterId", { length: 36 }),
    ugletterId: (0, mysql_core_1.varchar)("ugletterId", { length: 36 }),
    dpletterId: (0, mysql_core_1.varchar)("dpletterId", { length: 36 }),
    cpletterId: (0, mysql_core_1.varchar)("cpletterId", { length: 36 }),
    sessionId: (0, mysql_core_1.varchar)("sessionId", { length: 36 }),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    examStart: (0, mysql_core_1.datetime)("examStart"),
    examEnd: (0, mysql_core_1.datetime)("examEnd"),
    applyStart: (0, mysql_core_1.datetime)("applyStart"),
    applyEnd: (0, mysql_core_1.datetime)("applyEnd"),
    applyPause: (0, mysql_core_1.boolean)("applyPause").default(true).notNull(),
    showAdmitted: (0, mysql_core_1.boolean)("showAdmitted").default(true).notNull(),
    voucherIndex: (0, mysql_core_1.int)("voucherIndex"),
    isDefault: (0, mysql_core_1.boolean)("default").default(false).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    admittedAt: (0, mysql_core_1.datetime)("admittedAt"),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.sortedApplicant = (0, mysql_core_1.mysqlTable)("ams_sorted", {
    serial: (0, mysql_core_1.varchar)("serial", { length: 255 }).primaryKey(),
    admissionId: (0, mysql_core_1.varchar)("admissionId", { length: 36 }).notNull(),
    stageId: (0, mysql_core_1.varchar)("stageId", { length: 36 }).notNull(),
    applyTypeId: (0, mysql_core_1.varchar)("applyTypeId", { length: 36 }).notNull(),
    categoryId: (0, mysql_core_1.varchar)("categoryId", { length: 36 }),
    sellType: (0, mysql_core_1.int)("sellType"),
    choice1Id: (0, mysql_core_1.varchar)("choice1Id", { length: 36 }),
    choice2Id: (0, mysql_core_1.varchar)("choice2Id", { length: 36 }),
    profileId: (0, mysql_core_1.varchar)("profileId", { length: 255 }),
    gradeValue: (0, mysql_core_1.int)("gradeValue"),
    classValue: (0, mysql_core_1.int)("classValue"),
    admitted: (0, mysql_core_1.boolean)("admitted").default(false).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.applicant = (0, mysql_core_1.mysqlTable)("ams_applicant", {
    serial: (0, mysql_core_1.varchar)("serial", { length: 255 }).primaryKey(),
    admissionId: (0, mysql_core_1.varchar)("admissionId", { length: 36 }).notNull(),
    stageId: (0, mysql_core_1.varchar)("stageId", { length: 36 }).notNull(),
    applyTypeId: (0, mysql_core_1.varchar)("applyTypeId", { length: 36 }).notNull(),
    choiceId: (0, mysql_core_1.varchar)("choiceId", { length: 36 }),
    profileId: (0, mysql_core_1.varchar)("profileId", { length: 255 }),
    photo: (0, mysql_core_1.longtext)("photo"),
    meta: (0, mysql_core_1.json)("meta"),
    gradeValue: (0, mysql_core_1.int)("gradeValue"),
    classValue: (0, mysql_core_1.int)("classValue"),
    sorted: (0, mysql_core_1.boolean)("sorted").default(false).notNull(),
    submitted: (0, mysql_core_1.boolean)("submitted").default(false).notNull(),
    submittedAt: (0, mysql_core_1.datetime)("submittedAt"),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.fresher = (0, mysql_core_1.mysqlTable)("ams_fresher", {
    serial: (0, mysql_core_1.varchar)("serial", { length: 255 }).primaryKey(),
    admissionId: (0, mysql_core_1.varchar)("admissionId", { length: 36 }).notNull(),
    letterId: (0, mysql_core_1.varchar)("letterId", { length: 36 }),
    sessionId: (0, mysql_core_1.varchar)("sessionId", { length: 36 }).notNull(),
    billId: (0, mysql_core_1.varchar)("billId", { length: 36 }),
    programId: (0, mysql_core_1.varchar)("programId", { length: 36 }).notNull(),
    majorId: (0, mysql_core_1.varchar)("majorId", { length: 36 }),
    sessionMode: exports.sessionModeEnum,
    categoryId: (0, mysql_core_1.varchar)("categoryId", { length: 36 }),
    sellType: (0, mysql_core_1.int)("sellType"),
    semesterNum: (0, mysql_core_1.int)("semesterNum").notNull(),
    username: (0, mysql_core_1.varchar)("username", { length: 255 }),
    password: (0, mysql_core_1.varchar)("password", { length: 255 }),
    accept: (0, mysql_core_1.boolean)("accept").default(false).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.stepProfile = (0, mysql_core_1.mysqlTable)("ams_step_profile", {
    serial: (0, mysql_core_1.varchar)("serial", { length: 255 }).primaryKey(),
    titleId: (0, mysql_core_1.varchar)("titleId", { length: 36 }).notNull(),
    fname: (0, mysql_core_1.varchar)("fname", { length: 255 }).notNull(),
    mname: (0, mysql_core_1.varchar)("mname", { length: 350 }),
    lname: (0, mysql_core_1.varchar)("lname", { length: 255 }).notNull(),
    gender: (0, mysql_core_1.varchar)("gender", { length: 20 }).notNull(),
    dob: (0, mysql_core_1.datetime)("dob", { mode: 'date', fsp: 3 }).notNull(),
    maritalId: (0, mysql_core_1.varchar)("maritalId", { length: 50 }),
    disabilities: (0, mysql_core_1.varchar)("disabilities", { length: 350 }),
    phone: (0, mysql_core_1.varchar)("phone", { length: 20 }).notNull(),
    email: (0, mysql_core_1.varchar)("email", { length: 255 }),
    hometown: (0, mysql_core_1.varchar)("hometown", { length: 255 }),
    residentAddress: (0, mysql_core_1.varchar)("residentAddress", { length: 350 }),
    postalAddress: (0, mysql_core_1.varchar)("postalAddress", { length: 350 }),
    occupation: (0, mysql_core_1.varchar)("occupation", { length: 350 }),
    workPlace: (0, mysql_core_1.varchar)("workPlace", { length: 255 }),
    bondInstitute: (0, mysql_core_1.varchar)("bondInstitute", { length: 255 }),
    residentialStatus: exports.residentialStatusEnum,
    studyMode: exports.studyModeEnum,
    nationalityId: (0, mysql_core_1.varchar)("nationalityId", { length: 36 }),
    countryId: (0, mysql_core_1.varchar)("countryId", { length: 36 }),
    regionId: (0, mysql_core_1.varchar)("regionId", { length: 36 }),
    religionId: (0, mysql_core_1.varchar)("religionId", { length: 36 }),
    disabilityId: (0, mysql_core_1.varchar)("disabilityId", { length: 36 }),
    bonded: (0, mysql_core_1.boolean)("bonded").default(false).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.stepEducation = (0, mysql_core_1.mysqlTable)("ams_step_education", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    serial: (0, mysql_core_1.varchar)("serial", { length: 255 }).notNull(),
    instituteCategoryId: (0, mysql_core_1.varchar)("instituteCategoryId", { length: 36 }),
    certCategoryId: (0, mysql_core_1.varchar)("certCategoryId", { length: 36 }),
    instituteName: (0, mysql_core_1.varchar)("instituteName", { length: 255 }).notNull(),
    certName: (0, mysql_core_1.varchar)("certName", { length: 350 }),
    gradeValue: (0, mysql_core_1.int)("gradeValue"),
    classValue: (0, mysql_core_1.int)("classValue"),
    startMonth: (0, mysql_core_1.int)("startMonth").notNull(),
    startYear: (0, mysql_core_1.int)("startYear").notNull(),
    endMonth: (0, mysql_core_1.int)("endMonth"),
    endYear: (0, mysql_core_1.int)("endYear"),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.stepResult = (0, mysql_core_1.mysqlTable)("ams_step_result", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    serial: (0, mysql_core_1.varchar)("serial", { length: 255 }).notNull(),
    certCategoryId: (0, mysql_core_1.varchar)("certCategoryId", { length: 36 }),
    indexNumber: (0, mysql_core_1.varchar)("indexNumber", { length: 255 }).notNull(),
    sitting: (0, mysql_core_1.int)("sitting"),
    startYear: (0, mysql_core_1.int)("startYear").notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.stepGrade = (0, mysql_core_1.mysqlTable)("ams_step_grade", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    resultId: (0, mysql_core_1.varchar)("resultId", { length: 36 }),
    subjectId: (0, mysql_core_1.varchar)("subjectId", { length: 36 }),
    gradeWeightId: (0, mysql_core_1.varchar)("gradeWeightId", { length: 36 }),
    serial: (0, mysql_core_1.varchar)("serial", { length: 255 }).notNull(),
    gradeValue: (0, mysql_core_1.int)("gradeValue").notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.stepDocument = (0, mysql_core_1.mysqlTable)("ams_step_document", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    documentCategoryId: (0, mysql_core_1.varchar)("documentCategoryId", { length: 36 }),
    serial: (0, mysql_core_1.varchar)("serial", { length: 255 }).notNull(),
    base64: (0, mysql_core_1.longtext)("base64"),
    mime: (0, mysql_core_1.varchar)("mime", { length: 255 }),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.stepChoice = (0, mysql_core_1.mysqlTable)("ams_step_choice", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    programId: (0, mysql_core_1.varchar)("programId", { length: 36 }),
    majorId: (0, mysql_core_1.varchar)("majorId", { length: 36 }),
    serial: (0, mysql_core_1.varchar)("serial", { length: 255 }).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.stepReferee = (0, mysql_core_1.mysqlTable)("ams_step_referee", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    serial: (0, mysql_core_1.varchar)("serial", { length: 255 }).notNull(),
    titleId: (0, mysql_core_1.varchar)("titleId", { length: 36 }).notNull(),
    fname: (0, mysql_core_1.varchar)("fname", { length: 255 }).notNull(),
    mname: (0, mysql_core_1.varchar)("mname", { length: 350 }),
    lname: (0, mysql_core_1.varchar)("lname", { length: 255 }).notNull(),
    phone: (0, mysql_core_1.varchar)("phone", { length: 20 }).notNull(),
    email: (0, mysql_core_1.varchar)("email", { length: 255 }),
    address: (0, mysql_core_1.varchar)("address", { length: 350 }),
    occupation: (0, mysql_core_1.varchar)("occupation", { length: 350 }),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
// ==========================================
// 3. RELATIONS
// ==========================================
exports.admissionRelations = (0, drizzle_orm_1.relations)(exports.admission, ({ one, many }) => ({
    pgletter: one(exports.admissionLetter, { fields: [exports.admission.pgletterId], references: [exports.admissionLetter.id], relationName: "pgletter" }),
    ugletter: one(exports.admissionLetter, { fields: [exports.admission.ugletterId], references: [exports.admissionLetter.id], relationName: "ugletter" }),
    dpletter: one(exports.admissionLetter, { fields: [exports.admission.dpletterId], references: [exports.admissionLetter.id], relationName: "dpletter" }),
    cpletter: one(exports.admissionLetter, { fields: [exports.admission.cpletterId], references: [exports.admissionLetter.id], relationName: "cpletter" }),
    applicants: many(exports.applicant),
    sortedApplicants: many(exports.sortedApplicant),
    vouchers: many(exports.voucher),
}));
exports.applicantRelations = (0, drizzle_orm_1.relations)(exports.applicant, ({ one }) => ({
    admission: one(exports.admission, { fields: [exports.applicant.admissionId], references: [exports.admission.id] }),
    stage: one(exports.stage, { fields: [exports.applicant.stageId], references: [exports.stage.id] }),
    applyType: one(exports.applyType, { fields: [exports.applicant.applyTypeId], references: [exports.applyType.id] }),
    profile: one(exports.stepProfile, { fields: [exports.applicant.profileId], references: [exports.stepProfile.serial] }),
    choice: one(exports.stepChoice, { fields: [exports.applicant.choiceId], references: [exports.stepChoice.id] }),
}));
exports.stepResultRelations = (0, drizzle_orm_1.relations)(exports.stepResult, ({ one, many }) => ({
    certCategory: one(exports.certCategory, { fields: [exports.stepResult.certCategoryId], references: [exports.certCategory.id] }),
    grades: many(exports.stepGrade),
}));
exports.stepGradeRelations = (0, drizzle_orm_1.relations)(exports.stepGrade, ({ one }) => ({
    result: one(exports.stepResult, { fields: [exports.stepGrade.resultId], references: [exports.stepResult.id] }),
    subject: one(exports.subject, { fields: [exports.stepGrade.subjectId], references: [exports.subject.id] }),
    weight: one(exports.gradeWeight, { fields: [exports.stepGrade.gradeWeightId], references: [exports.gradeWeight.id] }),
}));
exports.sortedApplicantRelations = (0, drizzle_orm_1.relations)(exports.sortedApplicant, ({ one }) => ({
    admission: one(exports.admission, { fields: [exports.sortedApplicant.admissionId], references: [exports.admission.id] }),
    choice1: one(exports.stepChoice, { fields: [exports.sortedApplicant.choice1Id], references: [exports.stepChoice.id], relationName: "choice1" }),
    choice2: one(exports.stepChoice, { fields: [exports.sortedApplicant.choice2Id], references: [exports.stepChoice.id], relationName: "choice2" }),
}));
