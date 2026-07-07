import { 
  mysqlTable, 
  mysqlView, 
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
  index, 
  uniqueIndex 
} from "drizzle-orm/mysql-core";
import { sql, relations } from "drizzle-orm";

// ==========================================
// 1. ENUMS
// ==========================================
export const semesterNumbersEnum = mysqlEnum('semesterNumbers', ['1', '2', '3']);
export const courseRemarkEnum = mysqlEnum('courseRemark', ['CORE', 'ELECTIVE', 'OPTIONAL']);
export const programCategoryEnum = mysqlEnum('programCategory', ['DEGREE', 'DIPLOMA', 'CERTIFICATE', 'POSTGRADUATE']);
export const entryGroupEnum = mysqlEnum('entryGroup', ['GH', 'INT']);
export const residentialStatusEnum = mysqlEnum('residentialStatus', ['RESIDENT', 'NON_RESIDENT']);
export const studyModeEnum = mysqlEnum('studyMode', ['MORNING', 'EVENING', 'WEEKEND']);
export const completeTypeEnum = mysqlEnum('completeType', ['GRADUATED', 'WITHDRAWN', 'DECEASED']);
export const courseTypeEnum = mysqlEnum('courseType', ['CORE', 'ELECTIVE']);
export const deferStatusEnum = mysqlEnum('deferStatus', ['PENDED', 'APPROVED', 'REJECTED']);
export const backlogTypeEnum = mysqlEnum('backlogType', ['SCORE_CHANGE', 'REGISTRATION']);
export const scoreTypeEnum = mysqlEnum('scoreType', ['NORMAL', 'RESIT', 'RE-ENTRY']);
export const actionTypeEnum = mysqlEnum('actionType', ['MANUAL', 'AUTOMATIC']);
export const receiverEnum = mysqlEnum('receiver', ['STUDENT', 'STAFF', 'BOTH']);
export const pickModeEnum = mysqlEnum('pickMode', ['PICKUP', 'DELIVERY']);
export const transwiftTypeEnum = mysqlEnum('transwiftType', ['SOFTCOPY', 'HARDCOPY']);
export const transwiftStatusEnum = mysqlEnum('transwiftStatus', ['PENDED', 'PROCESSING', 'COMPLETED', 'CANCELLED']);

// ==========================================
// 2. VIEW
// ==========================================
export const broadsheet = mysqlView("broadsheet", {
  id: varchar("id", { length: 255 }).primaryKey(),
  sessionId: varchar("sessionId", { length: 255 }),
  schemeId: varchar("schemeId", { length: 255 }),
  courseId: varchar("courseId", { length: 255 }),
  indexno: varchar("indexno", { length: 255 }),
  credit: int("credit"),
  semesterNum: int("semesterNum"),
  classScore: float("classScore"),
  examScore: float("examScore"),
  totalScore: float("totalScore"),
  type: varchar("type", { length: 255 }),
  courseTitle: varchar("courseTitle", { length: 255 }),
  fname: varchar("fname", { length: 255 }),
  mname: varchar("mname", { length: 255 }),
  lname: varchar("lname", { length: 255 }),
  program: varchar("program", { length: 255 }),
  programId: varchar("programId", { length: 255 }),
  curSemesterNum: int("curSemesterNum"),
  status: boolean("status"),
  completeStatus: boolean("completeStatus"),
  deferStatus: boolean("deferStatus"),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
}).as(sql`SELECT * FROM broadsheet`);

// ==========================================
// 3. TABLES
// ==========================================

export const scheme = mysqlTable("ais_scheme", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  title: varchar("title", { length: 255 }).notNull(),
  gradeMeta: json("gradeMeta").notNull(),
  classMeta: json("classMeta").notNull(),
  scoreRange: json("scoreRange").notNull(),
  passMark: float("passMark").notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const mode = mysqlTable("ais_mode", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  code: varchar("code", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const course = mysqlTable("ais_course", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: varchar("title", { length: 450 }).notNull(),
  creditHour: int("creditHour").notNull(),
  theoryHour: int("theoryHour"),
  practicalHour: int("practicalHour"),
  remark: courseRemarkEnum,
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const major = mysqlTable("ais_major", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  programId: varchar("programId", { length: 36 }),
  shortName: varchar("shortName", { length: 255 }),
  longName: varchar("longName", { length: 355 }),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const program = mysqlTable("ais_program", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  schemeId: varchar("schemeId", { length: 36 }),
  unitId: varchar("unitId", { length: 36 }),
  modeId: varchar("modeId", { length: 36 }),
  code: varchar("code", { length: 50 }).notNull(),
  prefix: varchar("prefix", { length: 50 }),
  stype: int("stype"),
  shortName: varchar("shortName", { length: 255 }).notNull(),
  longName: varchar("longName", { length: 450 }).notNull(),
  category: programCategoryEnum.notNull(),
  semesterTotal: int("semesterTotal"),
  creditTotal: int("creditTotal"),
  shallAdmit: boolean("shallAdmit").default(false).notNull(),
  hasMajor: boolean("hasMajor").default(false).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const student = mysqlTable("ais_student", {
  id: varchar("id", { length: 36 }).primaryKey(),
  indexno: varchar("indexno", { length: 50 }),
  titleId: varchar("titleId", { length: 36 }),
  fname: varchar("fname", { length: 255 }),
  mname: varchar("mname", { length: 350 }),
  lname: varchar("lname", { length: 255 }),
  gender: varchar("gender", { length: 20 }),
  dob: datetime("dob", { mode: 'date', fsp: 3 }),
  maritalId: varchar("maritalId", { length: 36 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 25 }),
  hometown: varchar("hometown", { length: 255 }),
  address: varchar("address", { length: 350 }),
  guardianName: varchar("guardianName", { length: 350 }),
  guardianPhone: varchar("guardianPhone", { length: 15 }),
  ghcardNo: varchar("ghcardNo", { length: 255 }),
  nationalityId: varchar("nationalityId", { length: 36 }),
  countryId: varchar("countryId", { length: 36 }),
  regionId: varchar("regionId", { length: 36 }),
  religionId: varchar("religionId", { length: 36 }),
  disabilityId: varchar("disabilityId", { length: 36 }),
  programId: varchar("programId", { length: 36 }),
  majorId: varchar("majorId", { length: 36 }),
  progCount: int("progCount"),
  semesterNum: int("semesterNum"),
  semesterDone: int("semesterDone"),
  creditDone: int("creditDone"),
  entrySemesterNum: int("entrySemesterNum"),
  entryGroup: entryGroupEnum.default('GH'),
  entryDate: datetime("entryDate"),
  exitDate: datetime("exitDate"),
  residentialStatus: residentialStatusEnum,
  studyMode: studyModeEnum,
  deferStatus: boolean("deferStatus").default(false).notNull(),
  completeStatus: boolean("completeStatus").default(false).notNull(),
  completeType: completeTypeEnum,
  graduateStatus: boolean("graduateStatus").default(false).notNull(),
  instituteEmail: varchar("instituteEmail", { length: 350 }),
  instituteAffliate: varchar("instituteAffliate", { length: 350 }),
  flagPardon: boolean("flagPardon").default(false).notNull(),
  accountNet: float("accountNet").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
}, (table) => ({
  indexIdx: uniqueIndex("student_index_unique").on(table.indexno),
}));

export const session = mysqlTable("ais_session", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  tag: varchar("tag", { length: 50 }).default("main"),
  title: varchar("title", { length: 255 }).notNull(),
  year: varchar("year", { length: 50 }),
  semester: semesterNumbersEnum.notNull(),
  registerStart: datetime("registerStart"),
  registerEnd: datetime("registerEnd"),
  registerEndLate: datetime("registerEndLate"),
  registerPause: boolean("registerPause").default(false).notNull(),
  orientStart: datetime("orientStart"),
  orientEnd: datetime("orientEnd"),
  lectureStart: datetime("lectureStart"),
  lectureEnd: datetime("lectureEnd"),
  paymentEnd: datetime("paymentEnd"),
  matriculateStart: datetime("matriculateStart"),
  medicalStart: datetime("medicalStart"),
  medicalEnd: datetime("medicalEnd"),
  examStart: datetime("examStart"),
  examEnd: datetime("examEnd"),
  entryStart: datetime("entryStart"),
  entryEnd: datetime("entryEnd"),
  admissionPrefix: varchar("admissionPrefix", { length: 255 }),
  assignLateSheet: boolean("assignLateSheet").default(false).notNull(),
  progressStudent: boolean("progressStudent").default(false).notNull(),
  stageSheet: boolean("stageSheet").default(false).notNull(),
  isDefault: boolean("default").default(false).notNull(),
  status: boolean("status").default(true).notNull(),
  evaluationStart: datetime("evaluationStart"),
  evaluationEnd: datetime("evaluationEnd"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const structure = mysqlTable("ais_structure", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  unitId: varchar("unitId", { length: 36 }),
  programId: varchar("programId", { length: 36 }).notNull(),
  majorId: varchar("majorId", { length: 36 }),
  courseId: varchar("courseId", { length: 36 }).notNull(),
  semesterNum: int("semesterNum").notNull(),
  type: courseTypeEnum.notNull(),
  lock: boolean("lock").default(false).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const structmeta = mysqlTable("ais_structmeta", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  programId: varchar("programId", { length: 36 }).notNull(),
  majorId: varchar("majorId", { length: 36 }),
  semesterNum: int("semesterNum").notNull(),
  minCredit: int("minCredit").notNull(),
  maxCredit: int("maxCredit").notNull(),
  maxElectiveNum: int("maxElectiveNum"),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const activityRegister = mysqlTable("ais_activity_register", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  sessionId: varchar("sessionId", { length: 36 }),
  indexno: varchar("indexno", { length: 50 }),
  courses: int("courses").notNull(),
  credits: int("credits").notNull(),
  semesterNum: int("semesterNum").notNull(),
  dump: json("dump"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const assessment = mysqlTable("ais_assessment", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  sessionId: varchar("sessionId", { length: 36 }).notNull(),
  schemeId: varchar("schemeId", { length: 36 }).notNull(),
  courseId: varchar("courseId", { length: 36 }).notNull(),
  indexno: varchar("indexno", { length: 50 }).notNull(),
  credit: int("credit").notNull(),
  semesterNum: int("semesterNum").notNull(),
  classScore: float("classScore"),
  examScore: float("examScore"),
  totalScore: float("totalScore"),
  type: scoreTypeEnum.notNull(),
  scoreA: float("scoreA"),
  scoreB: float("scoreB"),
  scoreC: float("scoreC"),
  status: boolean("status").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
}, (table) => ({
  evalIdx: index("ais_assessment_lookup_idx").on(table.sessionId, table.courseId, table.indexno),
  semesterIdx: index("ais_assessment_sem_idx").on(table.sessionId, table.courseId, table.semesterNum),
}));

export const sheet = mysqlTable("ais_sheet", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  sessionId: varchar("sessionId", { length: 36 }).notNull(),
  courseId: varchar("courseId", { length: 36 }).notNull(),
  unitId: varchar("unitId", { length: 36 }),
  programId: varchar("programId", { length: 36 }).notNull(),
  majorId: varchar("majorId", { length: 36 }),
  assignStaffId: varchar("assignStaffId", { length: 36 }),
  assessorId: varchar("assessorId", { length: 36 }),
  certifierId: varchar("certifierId", { length: 36 }),
  semesterNum: int("semesterNum").notNull(),
  studyMode: varchar("studyMode", { length: 50 }),
  studentCount: int("studentCount").default(0),
  completeRatio: float("completeRatio"),
  classTimetable: json("classTimetable"),
  examTimetable: json("examTimetable"),
  assessed: boolean("assessed").default(false).notNull(),
  certified: boolean("certified").default(false).notNull(),
  finalized: boolean("finalized").default(false).notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
}, (table) => ({
  sheetIdx: index("ais_sheet_comp_idx").on(table.sessionId, table.programId, table.courseId, table.semesterNum, table.majorId),
}));

export const resit = mysqlTable("ais_resit", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  sessionId: varchar("sessionId", { length: 36 }),
  registerSessionId: varchar("registerSessionId", { length: 36 }),
  trailSessionId: varchar("trailSessionId", { length: 36 }).notNull(),
  schemeId: varchar("schemeId", { length: 36 }).notNull(),
  courseId: varchar("courseId", { length: 36 }).notNull(),
  indexno: varchar("indexno", { length: 50 }).notNull(),
  semesterNum: int("semesterNum").notNull(),
  totalScore: int("totalScore"),
  approveScore: boolean("approveScore").default(false).notNull(),
  taken: boolean("taken").default(false).notNull(),
  paid: boolean("paid").default(false).notNull(),
  actionType: actionTypeEnum,
  actionMeta: json("actionMeta"),
  registeredAt: datetime("registeredAt"),
  entryAt: datetime("entryAt"),
  approvedAt: datetime("approvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
}, (table) => ({
  resitUnique: uniqueIndex("resit_id_unique").on(table.trailSessionId, table.indexno, table.courseId),
}));

export const courseEvaluation = mysqlTable("evaluation", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  courseId: varchar("courseId", { length: 36 }).notNull(),
  staffNo: varchar("staffNo", { length: 50 }),
  indexno: varchar("indexno", { length: 50 }),
  sessionId: varchar("sessionId", { length: 36 }),
  status: varchar("status", { length: 50 }).notNull(),
  startedAt: datetime("startedAt"),
  completedAt: datetime("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
}, (table) => ({
  evalUnique: uniqueIndex("evaluation_unique_idx").on(table.indexno, table.sessionId, table.courseId),
}));

export const evaluationResponse = mysqlTable("evaluation_response", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  evaluationId: varchar("evaluationId", { length: 36 }).notNull(),
  questionId: varchar("questionId", { length: 36 }).notNull(),
  optionId: varchar("optionId", { length: 36 }),
  response: text("response"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
}, (table) => ({
  respUnique: uniqueIndex("eval_resp_unique").on(table.evaluationId, table.questionId),
}));

export const informer = mysqlTable("informer", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  reference: varchar("reference", { length: 255 }),
  title: varchar("title", { length: 350 }).notNull(),
  content: text("content"),
  smsContent: text("smsContent"),
  receiver: receiverEnum.notNull(),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

export const letter = mysqlTable("ais_letter", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  tag: varchar("tag", { length: 255 }),
  title: varchar("title", { length: 350 }).notNull(),
  signatory: text("signatory").notNull(),
  signature: longtext("signature").notNull(),
  template: longtext("template").notNull(),
  cc: text("cc"),
  status: boolean("status").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

// ==========================================
// 4. RELATIONS
// ==========================================

export const sessionRelations = relations(session, ({ many }) => ({
  registrations: many(activityRegister),
  assessments: many(assessment),
  sheets: many(sheet),
  trailResits: many(resit, { relationName: "trailSession" }),
  registerResits: many(resit, { relationName: "registerSession" }),
  evaluations: many(courseEvaluation),
}));

export const studentRelations = relations(student, ({ one, many }) => ({
  program: one(program, { fields: [student.programId], references: [program.id] }),
  major: one(major, { fields: [student.majorId], references: [major.id] }),
  assessments: many(assessment),
  resits: many(resit),
  evaluations: many(courseEvaluation),
  registrations: many(activityRegister),
}));

export const programRelations = relations(program, ({ one, many }) => ({
  scheme: one(scheme, { fields: [program.schemeId], references: [scheme.id] }),
  mode: one(mode, { fields: [program.modeId], references: [mode.id] }),
  students: many(student),
  majors: many(major),
  sheets: many(sheet),
  structures: many(structure),
}));

export const courseRelations = relations(course, ({ many }) => ({
  assessments: many(assessment),
  sheets: many(sheet),
  resits: many(resit),
  evaluations: many(courseEvaluation),
}));

export const resitRelations = relations(resit, ({ one }) => ({
  trailSession: one(session, { fields: [resit.trailSessionId], references: [session.id], relationName: "trailSession" }),
  registerSession: one(session, { fields: [resit.registerSessionId], references: [session.id], relationName: "registerSession" }),
  course: one(course, { fields: [resit.courseId], references: [course.id] }),
  student: one(student, { fields: [resit.indexno], references: [student.indexno] }),
  scheme: one(scheme, { fields: [resit.schemeId], references: [scheme.id] }),
}));

export const evaluationRelations = relations(courseEvaluation, ({ one, many }) => ({
  course: one(course, { fields: [courseEvaluation.courseId], references: [course.id] }),
  student: one(student, { fields: [courseEvaluation.indexno], references: [student.indexno] }),
  session: one(session, { fields: [courseEvaluation.sessionId], references: [session.id] }),
  responses: many(evaluationResponse),
}));

export const responseRelations = relations(evaluationResponse, ({ one }) => ({
  evaluation: one(courseEvaluation, { fields: [evaluationResponse.evaluationId], references: [courseEvaluation.id] }),
}));
