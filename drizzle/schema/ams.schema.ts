import { 
  mysqlTable, 
  varchar, 
  int, 
  boolean, 
  timestamp, 
  datetime, 
  mysqlEnum, 
  json, 
  float, 
  text, 
  longtext, 
  tinyint 
} from "drizzle-orm/mysql-core";
import { sql, relations } from "drizzle-orm";

// ==========================================
// 1. ENUMS
// ==========================================
export const currencyEnum = mysqlEnum('currency', ['GHC', 'USD', 'GBP', 'EUR']);
export const residentialStatusEnum = mysqlEnum('residentialStatus', ['RESIDENT', 'NON_RESIDENT']);
export const studyModeEnum = mysqlEnum('studyMode', ['MORNING', 'EVENING', 'WEEKEND']);
export const sessionModeEnum = mysqlEnum('sessionMode', ['MORNING', 'EVENING', 'WEEKEND']);

// ==========================================
// 2. TABLES
// ==========================================

export const activityApplicant = mysqlTable("ams_activity_applicant", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  serial: int("serial"),
  meta: json("meta"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const vendor = mysqlTable("ams_vendor", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  address: varchar("address", { length: 350 }).notNull(),
  technicianName: varchar("technicianName", { length: 255 }).notNull(),
  technicianPhone: varchar("technicianPhone", { length: 50 }).notNull(),
  technicianEmail: varchar("technicianEmail", { length: 255 }).notNull(),
  verified: boolean("verified").default(true).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const category = mysqlTable("ams_category", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const examCategory = mysqlTable("ams_exam_category", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  title: varchar("title", { length: 100 }).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const certCategory = mysqlTable("ams_cert_category", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  instituteCategoryId: varchar("instituteCategoryId", { length: 36 }),
  title: varchar("title", { length: 100 }).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const instituteCategory = mysqlTable("ams_institute_category", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  title: varchar("title", { length: 100 }).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const gradeWeight = mysqlTable("ams_grade_weight", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  certCategoryId: varchar("certCategoryId", { length: 36 }),
  title: varchar("title", { length: 100 }).notNull(),
  weight: tinyint("weight"),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const subject = mysqlTable("ams_subject", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  title: varchar("title", { length: 255 }).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const amsPrice = mysqlTable("ams_price", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  categoryId: varchar("categoryId", { length: 36 }),
  title: varchar("title", { length: 255 }).notNull(),
  sellType: int("sellType"),
  currency: currencyEnum.default('GHC').notNull(),
  amount: float("amount").notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const amsForm = mysqlTable("ams_form", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  categoryId: varchar("categoryId", { length: 36 }),
  title: varchar("title", { length: 255 }).notNull(),
  meta: json("meta"),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const stage = mysqlTable("ams_stage", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  categoryId: varchar("categoryId", { length: 36 }),
  formId: varchar("formId", { length: 36 }).notNull(),
  title: varchar("title", { length: 350 }).notNull(),
  sellType: int("sellType"),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const applyType = mysqlTable("ams_applytype", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  title: varchar("title", { length: 350 }).notNull(),
  stages: json("stages").notNull(),
  letterCondition: varchar("letterCondition", { length: 255 }).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const admissionLetter = mysqlTable("ams_letter", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  categoryId: varchar("categoryId", { length: 36 }),
  title: varchar("title", { length: 350 }).notNull(),
  signatory: text("signatory").notNull(),
  signature: longtext("signature").notNull(),
  template: longtext("template").notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const voucher = mysqlTable("ams_voucher", {
  serial: varchar("serial", { length: 255 }).primaryKey(),
  pin: varchar("pin", { length: 255 }).notNull(),
  admissionId: varchar("admissionId", { length: 36 }),
  vendorId: varchar("vendorId", { length: 36 }),
  categoryId: varchar("categoryId", { length: 36 }),
  sellType: int("sellType"),
  applicantName: varchar("applicantName", { length: 255 }),
  applicantPhone: varchar("applicantPhone", { length: 50 }),
  sold: boolean("sold").default(false).notNull(),
  soldAt: datetime("soldAt"),
  soldBy: varchar("soldBy", { length: 255 }),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const admission = mysqlTable("ams_admission", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  pgletterId: varchar("pgletterId", { length: 36 }),
  ugletterId: varchar("ugletterId", { length: 36 }),
  dpletterId: varchar("dpletterId", { length: 36 }),
  cpletterId: varchar("cpletterId", { length: 36 }),
  sessionId: varchar("sessionId", { length: 36 }),
  title: varchar("title", { length: 255 }).notNull(),
  examStart: datetime("examStart"),
  examEnd: datetime("examEnd"),
  applyStart: datetime("applyStart"),
  applyEnd: datetime("applyEnd"),
  applyPause: boolean("applyPause").default(true).notNull(),
  showAdmitted: boolean("showAdmitted").default(true).notNull(),
  voucherIndex: int("voucherIndex"),
  isDefault: boolean("default").default(false).notNull(),
  status: boolean("status").default(true).notNull(),
  admittedAt: datetime("admittedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const sortedApplicant = mysqlTable("ams_sorted", {
  serial: varchar("serial", { length: 255 }).primaryKey(),
  admissionId: varchar("admissionId", { length: 36 }).notNull(),
  stageId: varchar("stageId", { length: 36 }).notNull(),
  applyTypeId: varchar("applyTypeId", { length: 36 }).notNull(),
  categoryId: varchar("categoryId", { length: 36 }),
  sellType: int("sellType"),
  choice1Id: varchar("choice1Id", { length: 36 }),
  choice2Id: varchar("choice2Id", { length: 36 }),
  profileId: varchar("profileId", { length: 255 }),
  gradeValue: int("gradeValue"),
  classValue: int("classValue"),
  admitted: boolean("admitted").default(false).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const applicant = mysqlTable("ams_applicant", {
  serial: varchar("serial", { length: 255 }).primaryKey(),
  admissionId: varchar("admissionId", { length: 36 }).notNull(),
  stageId: varchar("stageId", { length: 36 }).notNull(),
  applyTypeId: varchar("applyTypeId", { length: 36 }).notNull(),
  choiceId: varchar("choiceId", { length: 36 }),
  profileId: varchar("profileId", { length: 255 }),
  photo: longtext("photo"),
  meta: json("meta"),
  gradeValue: int("gradeValue"),
  classValue: int("classValue"),
  sorted: boolean("sorted").default(false).notNull(),
  submitted: boolean("submitted").default(false).notNull(),
  submittedAt: datetime("submittedAt"),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const fresher = mysqlTable("ams_fresher", {
  serial: varchar("serial", { length: 255 }).primaryKey(),
  admissionId: varchar("admissionId", { length: 36 }).notNull(),
  letterId: varchar("letterId", { length: 36 }),
  sessionId: varchar("sessionId", { length: 36 }).notNull(),
  billId: varchar("billId", { length: 36 }),
  programId: varchar("programId", { length: 36 }).notNull(),
  majorId: varchar("majorId", { length: 36 }),
  sessionMode: sessionModeEnum,
  categoryId: varchar("categoryId", { length: 36 }),
  sellType: int("sellType"),
  semesterNum: int("semesterNum").notNull(),
  username: varchar("username", { length: 255 }),
  password: varchar("password", { length: 255 }),
  accept: boolean("accept").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const stepProfile = mysqlTable("ams_step_profile", {
  serial: varchar("serial", { length: 255 }).primaryKey(),
  titleId: varchar("titleId", { length: 36 }).notNull(),
  fname: varchar("fname", { length: 255 }).notNull(),
  mname: varchar("mname", { length: 350 }),
  lname: varchar("lname", { length: 255 }).notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),
  dob: datetime("dob", { mode: 'date', fsp: 3 }).notNull(),
  maritalId: varchar("maritalId", { length: 50 }),
  disabilities: varchar("disabilities", { length: 350 }),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }),
  hometown: varchar("hometown", { length: 255 }),
  residentAddress: varchar("residentAddress", { length: 350 }),
  postalAddress: varchar("postalAddress", { length: 350 }),
  occupation: varchar("occupation", { length: 350 }),
  workPlace: varchar("workPlace", { length: 255 }),
  bondInstitute: varchar("bondInstitute", { length: 255 }),
  residentialStatus: residentialStatusEnum,
  studyMode: studyModeEnum,
  nationalityId: varchar("nationalityId", { length: 36 }),
  countryId: varchar("countryId", { length: 36 }),
  regionId: varchar("regionId", { length: 36 }),
  religionId: varchar("religionId", { length: 36 }),
  disabilityId: varchar("disabilityId", { length: 36 }),
  bonded: boolean("bonded").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const stepEducation = mysqlTable("ams_step_education", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  serial: varchar("serial", { length: 255 }).notNull(),
  instituteCategoryId: varchar("instituteCategoryId", { length: 36 }),
  certCategoryId: varchar("certCategoryId", { length: 36 }),
  instituteName: varchar("instituteName", { length: 255 }).notNull(),
  certName: varchar("certName", { length: 350 }),
  gradeValue: int("gradeValue"),
  classValue: int("classValue"),
  startMonth: int("startMonth").notNull(),
  startYear: int("startYear").notNull(),
  endMonth: int("endMonth"),
  endYear: int("endYear"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const stepResult = mysqlTable("ams_step_result", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  serial: varchar("serial", { length: 255 }).notNull(),
  certCategoryId: varchar("certCategoryId", { length: 36 }),
  indexNumber: varchar("indexNumber", { length: 255 }).notNull(),
  sitting: int("sitting"),
  startYear: int("startYear").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const stepGrade = mysqlTable("ams_step_grade", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  resultId: varchar("resultId", { length: 36 }),
  subjectId: varchar("subjectId", { length: 36 }),
  gradeWeightId: varchar("gradeWeightId", { length: 36 }),
  serial: varchar("serial", { length: 255 }).notNull(),
  gradeValue: int("gradeValue").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const stepDocument = mysqlTable("ams_step_document", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  documentCategoryId: varchar("documentCategoryId", { length: 36 }),
  serial: varchar("serial", { length: 255 }).notNull(),
  base64: longtext("base64"),
  mime: varchar("mime", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const stepChoice = mysqlTable("ams_step_choice", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  programId: varchar("programId", { length: 36 }),
  majorId: varchar("majorId", { length: 36 }),
  serial: varchar("serial", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const stepReferee = mysqlTable("ams_step_referee", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  serial: varchar("serial", { length: 255 }).notNull(),
  titleId: varchar("titleId", { length: 36 }).notNull(),
  fname: varchar("fname", { length: 255 }).notNull(),
  mname: varchar("mname", { length: 350 }),
  lname: varchar("lname", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }),
  address: varchar("address", { length: 350 }),
  occupation: varchar("occupation", { length: 350 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

// ==========================================
// 3. RELATIONS
// ==========================================

export const admissionRelations = relations(admission, ({ one, many }) => ({
  pgletter: one(admissionLetter, { fields: [admission.pgletterId], references: [admissionLetter.id], relationName: "pgletter" }),
  ugletter: one(admissionLetter, { fields: [admission.ugletterId], references: [admissionLetter.id], relationName: "ugletter" }),
  dpletter: one(admissionLetter, { fields: [admission.dpletterId], references: [admissionLetter.id], relationName: "dpletter" }),
  cpletter: one(admissionLetter, { fields: [admission.cpletterId], references: [admissionLetter.id], relationName: "cpletter" }),
  applicants: many(applicant),
  sortedApplicants: many(sortedApplicant),
  vouchers: many(voucher),
}));

export const applicantRelations = relations(applicant, ({ one }) => ({
  admission: one(admission, { fields: [applicant.admissionId], references: [admission.id] }),
  stage: one(stage, { fields: [applicant.stageId], references: [stage.id] }),
  applyType: one(applyType, { fields: [applicant.applyTypeId], references: [applyType.id] }),
  profile: one(stepProfile, { fields: [applicant.profileId], references: [stepProfile.serial] }),
  choice: one(stepChoice, { fields: [applicant.choiceId], references: [stepChoice.id] }),
}));

export const stepResultRelations = relations(stepResult, ({ one, many }) => ({
  certCategory: one(certCategory, { fields: [stepResult.certCategoryId], references: [certCategory.id] }),
  grades: many(stepGrade),
}));

export const stepGradeRelations = relations(stepGrade, ({ one }) => ({
  result: one(stepResult, { fields: [stepGrade.resultId], references: [stepResult.id] }),
  subject: one(subject, { fields: [stepGrade.subjectId], references: [subject.id] }),
  weight: one(gradeWeight, { fields: [stepGrade.gradeWeightId], references: [gradeWeight.id] }),
}));

export const sortedApplicantRelations = relations(sortedApplicant, ({ one }) => ({
  admission: one(admission, { fields: [sortedApplicant.admissionId], references: [admission.id] }),
  choice1: one(stepChoice, { fields: [sortedApplicant.choice1Id], references: [stepChoice.id], relationName: "choice1" }),
  choice2: one(stepChoice, { fields: [sortedApplicant.choice2Id], references: [stepChoice.id], relationName: "choice2" }),
}));
