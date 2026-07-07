"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseRelations = exports.evaluationRelations = exports.resitRelations = exports.courseRelations = exports.programRelations = exports.studentRelations = exports.sessionRelations = exports.letter = exports.informer = exports.evaluationResponse = exports.courseEvaluation = exports.resit = exports.sheet = exports.assessment = exports.activityRegister = exports.structmeta = exports.structure = exports.session = exports.student = exports.program = exports.major = exports.course = exports.mode = exports.scheme = exports.broadsheet = exports.transwiftStatusEnum = exports.transwiftTypeEnum = exports.pickModeEnum = exports.receiverEnum = exports.actionTypeEnum = exports.scoreTypeEnum = exports.backlogTypeEnum = exports.deferStatusEnum = exports.courseTypeEnum = exports.completeTypeEnum = exports.studyModeEnum = exports.residentialStatusEnum = exports.entryGroupEnum = exports.programCategoryEnum = exports.courseRemarkEnum = exports.semesterNumbersEnum = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
// ==========================================
// 1. ENUMS
// ==========================================
exports.semesterNumbersEnum = (0, mysql_core_1.mysqlEnum)('semesterNumbers', ['1', '2', '3']);
exports.courseRemarkEnum = (0, mysql_core_1.mysqlEnum)('courseRemark', ['CORE', 'ELECTIVE', 'OPTIONAL']);
exports.programCategoryEnum = (0, mysql_core_1.mysqlEnum)('programCategory', ['DEGREE', 'DIPLOMA', 'CERTIFICATE', 'POSTGRADUATE']);
exports.entryGroupEnum = (0, mysql_core_1.mysqlEnum)('entryGroup', ['GH', 'INT']);
exports.residentialStatusEnum = (0, mysql_core_1.mysqlEnum)('residentialStatus', ['RESIDENT', 'NON_RESIDENT']);
exports.studyModeEnum = (0, mysql_core_1.mysqlEnum)('studyMode', ['MORNING', 'EVENING', 'WEEKEND']);
exports.completeTypeEnum = (0, mysql_core_1.mysqlEnum)('completeType', ['GRADUATED', 'WITHDRAWN', 'DECEASED']);
exports.courseTypeEnum = (0, mysql_core_1.mysqlEnum)('courseType', ['CORE', 'ELECTIVE']);
exports.deferStatusEnum = (0, mysql_core_1.mysqlEnum)('deferStatus', ['PENDED', 'APPROVED', 'REJECTED']);
exports.backlogTypeEnum = (0, mysql_core_1.mysqlEnum)('backlogType', ['SCORE_CHANGE', 'REGISTRATION']);
exports.scoreTypeEnum = (0, mysql_core_1.mysqlEnum)('scoreType', ['NORMAL', 'RESIT', 'RE-ENTRY']);
exports.actionTypeEnum = (0, mysql_core_1.mysqlEnum)('actionType', ['MANUAL', 'AUTOMATIC']);
exports.receiverEnum = (0, mysql_core_1.mysqlEnum)('receiver', ['STUDENT', 'STAFF', 'BOTH']);
exports.pickModeEnum = (0, mysql_core_1.mysqlEnum)('pickMode', ['PICKUP', 'DELIVERY']);
exports.transwiftTypeEnum = (0, mysql_core_1.mysqlEnum)('transwiftType', ['SOFTCOPY', 'HARDCOPY']);
exports.transwiftStatusEnum = (0, mysql_core_1.mysqlEnum)('transwiftStatus', ['PENDED', 'PROCESSING', 'COMPLETED', 'CANCELLED']);
// ==========================================
// 2. VIEW
// ==========================================
exports.broadsheet = (0, mysql_core_1.mysqlView)("broadsheet", {
    id: (0, mysql_core_1.varchar)("id", { length: 255 }).primaryKey(),
    sessionId: (0, mysql_core_1.varchar)("sessionId", { length: 255 }),
    schemeId: (0, mysql_core_1.varchar)("schemeId", { length: 255 }),
    courseId: (0, mysql_core_1.varchar)("courseId", { length: 255 }),
    indexno: (0, mysql_core_1.varchar)("indexno", { length: 255 }),
    credit: (0, mysql_core_1.int)("credit"),
    semesterNum: (0, mysql_core_1.int)("semesterNum"),
    classScore: (0, mysql_core_1.float)("classScore"),
    examScore: (0, mysql_core_1.float)("examScore"),
    totalScore: (0, mysql_core_1.float)("totalScore"),
    type: (0, mysql_core_1.varchar)("type", { length: 255 }),
    courseTitle: (0, mysql_core_1.varchar)("courseTitle", { length: 255 }),
    fname: (0, mysql_core_1.varchar)("fname", { length: 255 }),
    mname: (0, mysql_core_1.varchar)("mname", { length: 255 }),
    lname: (0, mysql_core_1.varchar)("lname", { length: 255 }),
    program: (0, mysql_core_1.varchar)("program", { length: 255 }),
    programId: (0, mysql_core_1.varchar)("programId", { length: 255 }),
    curSemesterNum: (0, mysql_core_1.int)("curSemesterNum"),
    status: (0, mysql_core_1.boolean)("status"),
    completeStatus: (0, mysql_core_1.boolean)("completeStatus"),
    deferStatus: (0, mysql_core_1.boolean)("deferStatus"),
    createdAt: (0, mysql_core_1.timestamp)("createdAt"),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt"),
}).as((0, drizzle_orm_1.sql) `SELECT * FROM broadsheet`);
// ==========================================
// 3. TABLES
// ==========================================
exports.scheme = (0, mysql_core_1.mysqlTable)("ais_scheme", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    gradeMeta: (0, mysql_core_1.json)("gradeMeta").notNull(),
    classMeta: (0, mysql_core_1.json)("classMeta").notNull(),
    scoreRange: (0, mysql_core_1.json)("scoreRange").notNull(),
    passMark: (0, mysql_core_1.float)("passMark").notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.mode = (0, mysql_core_1.mysqlTable)("ais_mode", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    code: (0, mysql_core_1.varchar)("code", { length: 50 }).notNull(),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.course = (0, mysql_core_1.mysqlTable)("ais_course", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey(),
    title: (0, mysql_core_1.varchar)("title", { length: 450 }).notNull(),
    creditHour: (0, mysql_core_1.int)("creditHour").notNull(),
    theoryHour: (0, mysql_core_1.int)("theoryHour"),
    practicalHour: (0, mysql_core_1.int)("practicalHour"),
    remark: exports.courseRemarkEnum,
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.major = (0, mysql_core_1.mysqlTable)("ais_major", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    programId: (0, mysql_core_1.varchar)("programId", { length: 36 }),
    shortName: (0, mysql_core_1.varchar)("shortName", { length: 255 }),
    longName: (0, mysql_core_1.varchar)("longName", { length: 355 }),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.program = (0, mysql_core_1.mysqlTable)("ais_program", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    schemeId: (0, mysql_core_1.varchar)("schemeId", { length: 36 }),
    unitId: (0, mysql_core_1.varchar)("unitId", { length: 36 }),
    modeId: (0, mysql_core_1.varchar)("modeId", { length: 36 }),
    code: (0, mysql_core_1.varchar)("code", { length: 50 }).notNull(),
    prefix: (0, mysql_core_1.varchar)("prefix", { length: 50 }),
    stype: (0, mysql_core_1.int)("stype"),
    shortName: (0, mysql_core_1.varchar)("shortName", { length: 255 }).notNull(),
    longName: (0, mysql_core_1.varchar)("longName", { length: 450 }).notNull(),
    category: exports.programCategoryEnum.notNull(),
    semesterTotal: (0, mysql_core_1.int)("semesterTotal"),
    creditTotal: (0, mysql_core_1.int)("creditTotal"),
    shallAdmit: (0, mysql_core_1.boolean)("shallAdmit").default(false).notNull(),
    hasMajor: (0, mysql_core_1.boolean)("hasMajor").default(false).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.student = (0, mysql_core_1.mysqlTable)("ais_student", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey(),
    indexno: (0, mysql_core_1.varchar)("indexno", { length: 50 }),
    titleId: (0, mysql_core_1.varchar)("titleId", { length: 36 }),
    fname: (0, mysql_core_1.varchar)("fname", { length: 255 }),
    mname: (0, mysql_core_1.varchar)("mname", { length: 350 }),
    lname: (0, mysql_core_1.varchar)("lname", { length: 255 }),
    gender: (0, mysql_core_1.varchar)("gender", { length: 20 }),
    dob: (0, mysql_core_1.datetime)("dob", { mode: 'date', fsp: 3 }),
    maritalId: (0, mysql_core_1.varchar)("maritalId", { length: 36 }),
    email: (0, mysql_core_1.varchar)("email", { length: 255 }),
    phone: (0, mysql_core_1.varchar)("phone", { length: 25 }),
    hometown: (0, mysql_core_1.varchar)("hometown", { length: 255 }),
    address: (0, mysql_core_1.varchar)("address", { length: 350 }),
    guardianName: (0, mysql_core_1.varchar)("guardianName", { length: 350 }),
    guardianPhone: (0, mysql_core_1.varchar)("guardianPhone", { length: 15 }),
    ghcardNo: (0, mysql_core_1.varchar)("ghcardNo", { length: 255 }),
    nationalityId: (0, mysql_core_1.varchar)("nationalityId", { length: 36 }),
    countryId: (0, mysql_core_1.varchar)("countryId", { length: 36 }),
    regionId: (0, mysql_core_1.varchar)("regionId", { length: 36 }),
    religionId: (0, mysql_core_1.varchar)("religionId", { length: 36 }),
    disabilityId: (0, mysql_core_1.varchar)("disabilityId", { length: 36 }),
    programId: (0, mysql_core_1.varchar)("programId", { length: 36 }),
    majorId: (0, mysql_core_1.varchar)("majorId", { length: 36 }),
    progCount: (0, mysql_core_1.int)("progCount"),
    semesterNum: (0, mysql_core_1.int)("semesterNum"),
    semesterDone: (0, mysql_core_1.int)("semesterDone"),
    creditDone: (0, mysql_core_1.int)("creditDone"),
    entrySemesterNum: (0, mysql_core_1.int)("entrySemesterNum"),
    entryGroup: exports.entryGroupEnum.default('GH'),
    entryDate: (0, mysql_core_1.datetime)("entryDate"),
    exitDate: (0, mysql_core_1.datetime)("exitDate"),
    residentialStatus: exports.residentialStatusEnum,
    studyMode: exports.studyModeEnum,
    deferStatus: (0, mysql_core_1.boolean)("deferStatus").default(false).notNull(),
    completeStatus: (0, mysql_core_1.boolean)("completeStatus").default(false).notNull(),
    completeType: exports.completeTypeEnum,
    graduateStatus: (0, mysql_core_1.boolean)("graduateStatus").default(false).notNull(),
    instituteEmail: (0, mysql_core_1.varchar)("instituteEmail", { length: 350 }),
    instituteAffliate: (0, mysql_core_1.varchar)("instituteAffliate", { length: 350 }),
    flagPardon: (0, mysql_core_1.boolean)("flagPardon").default(false).notNull(),
    accountNet: (0, mysql_core_1.float)("accountNet").default(0),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
}, (table) => ({
    indexIdx: (0, mysql_core_1.uniqueIndex)("student_index_unique").on(table.indexno),
}));
exports.session = (0, mysql_core_1.mysqlTable)("ais_session", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    tag: (0, mysql_core_1.varchar)("tag", { length: 50 }).default("main"),
    title: (0, mysql_core_1.varchar)("title", { length: 255 }).notNull(),
    year: (0, mysql_core_1.varchar)("year", { length: 50 }),
    semester: exports.semesterNumbersEnum.notNull(),
    registerStart: (0, mysql_core_1.datetime)("registerStart"),
    registerEnd: (0, mysql_core_1.datetime)("registerEnd"),
    registerEndLate: (0, mysql_core_1.datetime)("registerEndLate"),
    registerPause: (0, mysql_core_1.boolean)("registerPause").default(false).notNull(),
    orientStart: (0, mysql_core_1.datetime)("orientStart"),
    orientEnd: (0, mysql_core_1.datetime)("orientEnd"),
    lectureStart: (0, mysql_core_1.datetime)("lectureStart"),
    lectureEnd: (0, mysql_core_1.datetime)("lectureEnd"),
    paymentEnd: (0, mysql_core_1.datetime)("paymentEnd"),
    matriculateStart: (0, mysql_core_1.datetime)("matriculateStart"),
    medicalStart: (0, mysql_core_1.datetime)("medicalStart"),
    medicalEnd: (0, mysql_core_1.datetime)("medicalEnd"),
    examStart: (0, mysql_core_1.datetime)("examStart"),
    examEnd: (0, mysql_core_1.datetime)("examEnd"),
    entryStart: (0, mysql_core_1.datetime)("entryStart"),
    entryEnd: (0, mysql_core_1.datetime)("entryEnd"),
    admissionPrefix: (0, mysql_core_1.varchar)("admissionPrefix", { length: 255 }),
    assignLateSheet: (0, mysql_core_1.boolean)("assignLateSheet").default(false).notNull(),
    progressStudent: (0, mysql_core_1.boolean)("progressStudent").default(false).notNull(),
    stageSheet: (0, mysql_core_1.boolean)("stageSheet").default(false).notNull(),
    isDefault: (0, mysql_core_1.boolean)("default").default(false).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    evaluationStart: (0, mysql_core_1.datetime)("evaluationStart"),
    evaluationEnd: (0, mysql_core_1.datetime)("evaluationEnd"),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.structure = (0, mysql_core_1.mysqlTable)("ais_structure", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    unitId: (0, mysql_core_1.varchar)("unitId", { length: 36 }),
    programId: (0, mysql_core_1.varchar)("programId", { length: 36 }).notNull(),
    majorId: (0, mysql_core_1.varchar)("majorId", { length: 36 }),
    courseId: (0, mysql_core_1.varchar)("courseId", { length: 36 }).notNull(),
    semesterNum: (0, mysql_core_1.int)("semesterNum").notNull(),
    type: exports.courseTypeEnum.notNull(),
    lock: (0, mysql_core_1.boolean)("lock").default(false).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.structmeta = (0, mysql_core_1.mysqlTable)("ais_structmeta", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    programId: (0, mysql_core_1.varchar)("programId", { length: 36 }).notNull(),
    majorId: (0, mysql_core_1.varchar)("majorId", { length: 36 }),
    semesterNum: (0, mysql_core_1.int)("semesterNum").notNull(),
    minCredit: (0, mysql_core_1.int)("minCredit").notNull(),
    maxCredit: (0, mysql_core_1.int)("maxCredit").notNull(),
    maxElectiveNum: (0, mysql_core_1.int)("maxElectiveNum"),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.activityRegister = (0, mysql_core_1.mysqlTable)("ais_activity_register", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    sessionId: (0, mysql_core_1.varchar)("sessionId", { length: 36 }),
    indexno: (0, mysql_core_1.varchar)("indexno", { length: 50 }),
    courses: (0, mysql_core_1.int)("courses").notNull(),
    credits: (0, mysql_core_1.int)("credits").notNull(),
    semesterNum: (0, mysql_core_1.int)("semesterNum").notNull(),
    dump: (0, mysql_core_1.json)("dump"),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.assessment = (0, mysql_core_1.mysqlTable)("ais_assessment", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    sessionId: (0, mysql_core_1.varchar)("sessionId", { length: 36 }).notNull(),
    schemeId: (0, mysql_core_1.varchar)("schemeId", { length: 36 }).notNull(),
    courseId: (0, mysql_core_1.varchar)("courseId", { length: 36 }).notNull(),
    indexno: (0, mysql_core_1.varchar)("indexno", { length: 50 }).notNull(),
    credit: (0, mysql_core_1.int)("credit").notNull(),
    semesterNum: (0, mysql_core_1.int)("semesterNum").notNull(),
    classScore: (0, mysql_core_1.float)("classScore"),
    examScore: (0, mysql_core_1.float)("examScore"),
    totalScore: (0, mysql_core_1.float)("totalScore"),
    type: exports.scoreTypeEnum.notNull(),
    scoreA: (0, mysql_core_1.float)("scoreA"),
    scoreB: (0, mysql_core_1.float)("scoreB"),
    scoreC: (0, mysql_core_1.float)("scoreC"),
    status: (0, mysql_core_1.boolean)("status").default(false).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
}, (table) => ({
    evalIdx: (0, mysql_core_1.index)("ais_assessment_lookup_idx").on(table.sessionId, table.courseId, table.indexno),
    semesterIdx: (0, mysql_core_1.index)("ais_assessment_sem_idx").on(table.sessionId, table.courseId, table.semesterNum),
}));
exports.sheet = (0, mysql_core_1.mysqlTable)("ais_sheet", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    sessionId: (0, mysql_core_1.varchar)("sessionId", { length: 36 }).notNull(),
    courseId: (0, mysql_core_1.varchar)("courseId", { length: 36 }).notNull(),
    unitId: (0, mysql_core_1.varchar)("unitId", { length: 36 }),
    programId: (0, mysql_core_1.varchar)("programId", { length: 36 }).notNull(),
    majorId: (0, mysql_core_1.varchar)("majorId", { length: 36 }),
    assignStaffId: (0, mysql_core_1.varchar)("assignStaffId", { length: 36 }),
    assessorId: (0, mysql_core_1.varchar)("assessorId", { length: 36 }),
    certifierId: (0, mysql_core_1.varchar)("certifierId", { length: 36 }),
    semesterNum: (0, mysql_core_1.int)("semesterNum").notNull(),
    studyMode: (0, mysql_core_1.varchar)("studyMode", { length: 50 }),
    studentCount: (0, mysql_core_1.int)("studentCount").default(0),
    completeRatio: (0, mysql_core_1.float)("completeRatio"),
    classTimetable: (0, mysql_core_1.json)("classTimetable"),
    examTimetable: (0, mysql_core_1.json)("examTimetable"),
    assessed: (0, mysql_core_1.boolean)("assessed").default(false).notNull(),
    certified: (0, mysql_core_1.boolean)("certified").default(false).notNull(),
    finalized: (0, mysql_core_1.boolean)("finalized").default(false).notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
}, (table) => ({
    sheetIdx: (0, mysql_core_1.index)("ais_sheet_comp_idx").on(table.sessionId, table.programId, table.courseId, table.semesterNum, table.majorId),
}));
exports.resit = (0, mysql_core_1.mysqlTable)("ais_resit", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    sessionId: (0, mysql_core_1.varchar)("sessionId", { length: 36 }),
    registerSessionId: (0, mysql_core_1.varchar)("registerSessionId", { length: 36 }),
    trailSessionId: (0, mysql_core_1.varchar)("trailSessionId", { length: 36 }).notNull(),
    schemeId: (0, mysql_core_1.varchar)("schemeId", { length: 36 }).notNull(),
    courseId: (0, mysql_core_1.varchar)("courseId", { length: 36 }).notNull(),
    indexno: (0, mysql_core_1.varchar)("indexno", { length: 50 }).notNull(),
    semesterNum: (0, mysql_core_1.int)("semesterNum").notNull(),
    totalScore: (0, mysql_core_1.int)("totalScore"),
    approveScore: (0, mysql_core_1.boolean)("approveScore").default(false).notNull(),
    taken: (0, mysql_core_1.boolean)("taken").default(false).notNull(),
    paid: (0, mysql_core_1.boolean)("paid").default(false).notNull(),
    actionType: exports.actionTypeEnum,
    actionMeta: (0, mysql_core_1.json)("actionMeta"),
    registeredAt: (0, mysql_core_1.datetime)("registeredAt"),
    entryAt: (0, mysql_core_1.datetime)("entryAt"),
    approvedAt: (0, mysql_core_1.datetime)("approvedAt"),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
}, (table) => ({
    resitUnique: (0, mysql_core_1.uniqueIndex)("resit_id_unique").on(table.trailSessionId, table.indexno, table.courseId),
}));
exports.courseEvaluation = (0, mysql_core_1.mysqlTable)("evaluation", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    courseId: (0, mysql_core_1.varchar)("courseId", { length: 36 }).notNull(),
    staffNo: (0, mysql_core_1.varchar)("staffNo", { length: 50 }),
    indexno: (0, mysql_core_1.varchar)("indexno", { length: 50 }),
    sessionId: (0, mysql_core_1.varchar)("sessionId", { length: 36 }),
    status: (0, mysql_core_1.varchar)("status", { length: 50 }).notNull(),
    startedAt: (0, mysql_core_1.datetime)("startedAt"),
    completedAt: (0, mysql_core_1.datetime)("completedAt"),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
}, (table) => ({
    evalUnique: (0, mysql_core_1.uniqueIndex)("evaluation_unique_idx").on(table.indexno, table.sessionId, table.courseId),
}));
exports.evaluationResponse = (0, mysql_core_1.mysqlTable)("evaluation_response", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    evaluationId: (0, mysql_core_1.varchar)("evaluationId", { length: 36 }).notNull(),
    questionId: (0, mysql_core_1.varchar)("questionId", { length: 36 }).notNull(),
    optionId: (0, mysql_core_1.varchar)("optionId", { length: 36 }),
    response: (0, mysql_core_1.text)("response"),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
}, (table) => ({
    respUnique: (0, mysql_core_1.uniqueIndex)("eval_resp_unique").on(table.evaluationId, table.questionId),
}));
exports.informer = (0, mysql_core_1.mysqlTable)("informer", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    reference: (0, mysql_core_1.varchar)("reference", { length: 255 }),
    title: (0, mysql_core_1.varchar)("title", { length: 350 }).notNull(),
    content: (0, mysql_core_1.text)("content"),
    smsContent: (0, mysql_core_1.text)("smsContent"),
    receiver: exports.receiverEnum.notNull(),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
exports.letter = (0, mysql_core_1.mysqlTable)("ais_letter", {
    id: (0, mysql_core_1.varchar)("id", { length: 36 }).primaryKey().default((0, drizzle_orm_1.sql) `(UUID())`),
    tag: (0, mysql_core_1.varchar)("tag", { length: 255 }),
    title: (0, mysql_core_1.varchar)("title", { length: 350 }).notNull(),
    signatory: (0, mysql_core_1.text)("signatory").notNull(),
    signature: (0, mysql_core_1.longtext)("signature").notNull(),
    template: (0, mysql_core_1.longtext)("template").notNull(),
    cc: (0, mysql_core_1.text)("cc"),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.timestamp)("createdAt").defaultNow().notNull(),
    updatedAt: (0, mysql_core_1.timestamp)("updatedAt").onUpdateNow(),
});
// ==========================================
// 4. RELATIONS
// ==========================================
exports.sessionRelations = (0, drizzle_orm_1.relations)(exports.session, ({ many }) => ({
    registrations: many(exports.activityRegister),
    assessments: many(exports.assessment),
    sheets: many(exports.sheet),
    trailResits: many(exports.resit, { relationName: "trailSession" }),
    registerResits: many(exports.resit, { relationName: "registerSession" }),
    evaluations: many(exports.courseEvaluation),
}));
exports.studentRelations = (0, drizzle_orm_1.relations)(exports.student, ({ one, many }) => ({
    program: one(exports.program, { fields: [exports.student.programId], references: [exports.program.id] }),
    major: one(exports.major, { fields: [exports.student.majorId], references: [exports.major.id] }),
    assessments: many(exports.assessment),
    resits: many(exports.resit),
    evaluations: many(exports.courseEvaluation),
    registrations: many(exports.activityRegister),
}));
exports.programRelations = (0, drizzle_orm_1.relations)(exports.program, ({ one, many }) => ({
    scheme: one(exports.scheme, { fields: [exports.program.schemeId], references: [exports.scheme.id] }),
    mode: one(exports.mode, { fields: [exports.program.modeId], references: [exports.mode.id] }),
    students: many(exports.student),
    majors: many(exports.major),
    sheets: many(exports.sheet),
    structures: many(exports.structure),
}));
exports.courseRelations = (0, drizzle_orm_1.relations)(exports.course, ({ many }) => ({
    assessments: many(exports.assessment),
    sheets: many(exports.sheet),
    resits: many(exports.resit),
    evaluations: many(exports.courseEvaluation),
}));
exports.resitRelations = (0, drizzle_orm_1.relations)(exports.resit, ({ one }) => ({
    trailSession: one(exports.session, { fields: [exports.resit.trailSessionId], references: [exports.session.id], relationName: "trailSession" }),
    registerSession: one(exports.session, { fields: [exports.resit.registerSessionId], references: [exports.session.id], relationName: "registerSession" }),
    course: one(exports.course, { fields: [exports.resit.courseId], references: [exports.course.id] }),
    student: one(exports.student, { fields: [exports.resit.indexno], references: [exports.student.indexno] }),
    scheme: one(exports.scheme, { fields: [exports.resit.schemeId], references: [exports.scheme.id] }),
}));
exports.evaluationRelations = (0, drizzle_orm_1.relations)(exports.courseEvaluation, ({ one, many }) => ({
    course: one(exports.course, { fields: [exports.courseEvaluation.courseId], references: [exports.course.id] }),
    student: one(exports.student, { fields: [exports.courseEvaluation.indexno], references: [exports.student.indexno] }),
    session: one(exports.session, { fields: [exports.courseEvaluation.sessionId], references: [exports.session.id] }),
    responses: many(exports.evaluationResponse),
}));
exports.responseRelations = (0, drizzle_orm_1.relations)(exports.evaluationResponse, ({ one }) => ({
    evaluation: one(exports.courseEvaluation, { fields: [exports.evaluationResponse.evaluationId], references: [exports.courseEvaluation.id] }),
}));
