"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subject = exports.stepResult = exports.stepReferee = exports.stepProfile = exports.stepGuardian = exports.stepGrade = exports.stepEmployment = exports.stepEducation = exports.stepDocument = exports.stepChoice = exports.stage = exports.sorted = exports.amsPrice = exports.admissionLetter = exports.instituteCategory = exports.gradeWeight = exports.fresher = exports.amsForm = exports.examCategory = exports.documentCategory = exports.certCategory = exports.category = exports.awardClass = exports.applyType = exports.applicant = exports.admission = exports.activityApplicant = exports.transwift = exports.student = exports.structure = exports.structmeta = exports.sheet = exports.session = exports.scheme = exports.resitSession = exports.resit = exports.program = exports.major = exports.letter = exports.graduateSession = exports.graduate = exports.course = exports.assessment = exports.activityRegister = exports.activityProgress = exports.activityProgchange = exports.activityDefer = exports.activityBacklog = exports.prismaMigrations = exports.appToprovider = void 0;
exports.staff = exports.specialization = exports.section = exports.scale = exports.response = exports.respondent = exports.relative = exports.question = exports.qualification = exports.promotion = exports.positionInfo = exports.position = exports.paper = exports.option = exports.nss = exports.leaveWeight = exports.leaveExempt = exports.leaveDefer = exports.leaveConstant = exports.leaveCategory = exports.leaveBalance = exports.leaveApprover = exports.leave = exports.job = exports.formType = exports.form = exports.circular = exports.transtype = exports.transaction = exports.studentAccount = exports.collector = exports.charge = exports.bill = exports.bankacc = exports.activityFinanceVoucher = exports.activityBill = exports.activityFinanceApi = exports.portfolio = exports.elector = exports.election = exports.candidate = exports.attack = exports.evaluationResponse = exports.evaluationQuestion = exports.evaluationOption = exports.evaluation = exports.disability = exports.country = exports.voucher = exports.vendor = void 0;
exports.broadsheet = exports.unit = exports.title = exports.user = exports.userRole = exports.support = exports.provider = exports.group = exports.appRole = exports.app = exports.religion = exports.relation = exports.region = exports.mode = exports.marital = exports.log = exports.informer = exports.upload = exports.transfer = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const mysql_core_1 = require("drizzle-orm/mysql-core");
exports.appToprovider = (0, mysql_core_1.mysqlTable)("_appToprovider", {
    a: (0, mysql_core_1.int)("A").notNull().references(() => exports.app.id, { onDelete: "cascade", onUpdate: "cascade" }),
    b: (0, mysql_core_1.int)("B").notNull().references(() => exports.provider.providerId, { onDelete: "cascade", onUpdate: "cascade" }),
}, (table) => [
    (0, mysql_core_1.index)("_appToprovider_B_index").on(table.b),
    (0, mysql_core_1.unique)("_appToprovider_AB_unique").on(table.a, table.b),
]);
exports.prismaMigrations = (0, mysql_core_1.mysqlTable)("_prisma_migrations", {
    id: (0, mysql_core_1.varchar)({ length: 36 }).notNull(),
    checksum: (0, mysql_core_1.varchar)({ length: 64 }).notNull(),
    finishedAt: (0, mysql_core_1.datetime)("finished_at", { mode: 'string', fsp: 3 }),
    migrationName: (0, mysql_core_1.varchar)("migration_name", { length: 255 }).notNull(),
    logs: (0, mysql_core_1.text)(),
    rolledBackAt: (0, mysql_core_1.datetime)("rolled_back_at", { mode: 'string', fsp: 3 }),
    startedAt: (0, mysql_core_1.datetime)("started_at", { mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    appliedStepsCount: (0, mysql_core_1.int)("applied_steps_count", { unsigned: true }).default(0).notNull(),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "_prisma_migrations_id" }),
]);
exports.activityBacklog = (0, mysql_core_1.mysqlTable)("ais_activity_backlog", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    sessionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.session.id, { onDelete: "set null", onUpdate: "cascade" }),
    schemeId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.scheme.id, { onDelete: "set null", onUpdate: "cascade" }),
    title: (0, mysql_core_1.varchar)({ length: 191 }),
    type: (0, mysql_core_1.mysqlEnum)(['REGISTRATION', 'ASSESSMENT', 'DELETION']),
    meta: (0, mysql_core_1.json)(),
    status: (0, mysql_core_1.tinyint)().default(0).notNull(),
    approvedBy: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    createdBy: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_activity_backlog_id" }),
]);
exports.activityDefer = (0, mysql_core_1.mysqlTable)("ais_activity_defer", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    sessionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.session.id, { onDelete: "set null", onUpdate: "cascade" }),
    indexno: (0, mysql_core_1.varchar)({ length: 50 }).references(() => exports.student.indexno, { onDelete: "set null", onUpdate: "cascade" }),
    semesterNum: (0, mysql_core_1.int)().notNull(),
    letterDate: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    reason: (0, mysql_core_1.varchar)({ length: 255 }),
    durationInYears: (0, mysql_core_1.int)().default(1).notNull(),
    status: (0, mysql_core_1.mysqlEnum)(['PENDED', 'APPROVED', 'DECLINED', 'RESUMED']).default('PENDED').notNull(),
    statusBy: (0, mysql_core_1.varchar)({ length: 191 }),
    start: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    end: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    createdBy: (0, mysql_core_1.varchar)({ length: 191 }),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_activity_defer_id" }),
]);
exports.activityProgchange = (0, mysql_core_1.mysqlTable)("ais_activity_progchange", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    sessionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.session.id, { onDelete: "set null", onUpdate: "cascade" }),
    studentId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.student.id, { onDelete: "restrict", onUpdate: "cascade" }),
    oldIndexno: (0, mysql_core_1.varchar)({ length: 50 }).notNull(),
    newIndexno: (0, mysql_core_1.varchar)({ length: 50 }),
    oldProgramId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.program.id, { onDelete: "restrict", onUpdate: "cascade" }),
    newProgramId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.program.id, { onDelete: "set null", onUpdate: "cascade" }),
    newSemesterNum: (0, mysql_core_1.int)().notNull(),
    reason: (0, mysql_core_1.varchar)({ length: 255 }),
    approved: (0, mysql_core_1.tinyint)().default(1).notNull(),
    approvedBy: (0, mysql_core_1.varchar)({ length: 191 }),
    approvedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_activity_progchange_id" }),
]);
exports.activityProgress = (0, mysql_core_1.mysqlTable)("ais_activity_progress", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    sessionId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.session.id, { onDelete: "restrict", onUpdate: "cascade" }),
    indexno: (0, mysql_core_1.varchar)({ length: 50 }).notNull().references(() => exports.student.indexno, { onDelete: "restrict", onUpdate: "cascade" }),
    semesterNum: (0, mysql_core_1.int)().notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_activity_progress_id" }),
]);
exports.activityRegister = (0, mysql_core_1.mysqlTable)("ais_activity_register", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    sessionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.session.id, { onDelete: "restrict", onUpdate: "cascade" }),
    indexno: (0, mysql_core_1.varchar)({ length: 50 }).references(() => exports.student.indexno, { onDelete: "restrict", onUpdate: "cascade" }),
    courses: (0, mysql_core_1.int)().notNull(),
    credits: (0, mysql_core_1.int)().notNull(),
    semesterNum: (0, mysql_core_1.int)().notNull(),
    dump: (0, mysql_core_1.json)(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_activity_register_id" }),
]);
exports.assessment = (0, mysql_core_1.mysqlTable)("ais_assessment", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    sessionId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.session.id, { onDelete: "restrict", onUpdate: "cascade" }),
    schemeId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.scheme.id, { onDelete: "restrict", onUpdate: "cascade" }),
    courseId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.course.id, { onDelete: "restrict", onUpdate: "cascade" }),
    indexno: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.student.indexno, { onDelete: "restrict", onUpdate: "cascade" }),
    credit: (0, mysql_core_1.int)().notNull(),
    semesterNum: (0, mysql_core_1.int)().notNull(),
    classScore: (0, mysql_core_1.double)(),
    examScore: (0, mysql_core_1.double)(),
    totalScore: (0, mysql_core_1.double)(),
    type: (0, mysql_core_1.mysqlEnum)(['N', 'R']).notNull(),
    scoreA: (0, mysql_core_1.double)(),
    scoreB: (0, mysql_core_1.double)(),
    scoreC: (0, mysql_core_1.double)(),
    status: (0, mysql_core_1.tinyint)().default(0).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.index)("ais_assessment_sessionId_courseId_indexno_idx").on(table.sessionId, table.courseId, table.indexno),
    (0, mysql_core_1.index)("ais_assessment_sessionId_courseId_semesterNum_idx").on(table.sessionId, table.courseId, table.semesterNum),
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_assessment_id" }),
]);
exports.course = (0, mysql_core_1.mysqlTable)("ais_course", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 450 }).notNull(),
    creditHour: (0, mysql_core_1.int)().notNull(),
    theoryHour: (0, mysql_core_1.int)(),
    practicalHour: (0, mysql_core_1.int)(),
    remark: (0, mysql_core_1.mysqlEnum)(['FADED', 'ACTIVE']),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_course_id" }),
]);
exports.graduate = (0, mysql_core_1.mysqlTable)("ais_graduate", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    sessionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.graduateSession.id, { onDelete: "set null", onUpdate: "cascade" }),
    indexno: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.student.indexno, { onUpdate: "cascade" }),
    cgpa: (0, mysql_core_1.varchar)({ length: 191 }),
    certNo: (0, mysql_core_1.varchar)({ length: 191 }),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_graduate_id" }),
    (0, mysql_core_1.unique)("ais_graduate_indexno_key").on(table.indexno),
]);
exports.graduateSession = (0, mysql_core_1.mysqlTable)("ais_graduate_session", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 350 }).notNull(),
    description: (0, mysql_core_1.varchar)({ length: 650 }),
    start: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    end: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    default: (0, mysql_core_1.tinyint)().default(0).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_graduate_session_id" }),
]);
exports.letter = (0, mysql_core_1.mysqlTable)("ais_letter", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    tag: (0, mysql_core_1.varchar)({ length: 191 }),
    title: (0, mysql_core_1.varchar)({ length: 350 }).notNull(),
    signatory: (0, mysql_core_1.text)().notNull(),
    signature: (0, mysql_core_1.longtext)().notNull(),
    template: (0, mysql_core_1.longtext)().notNull(),
    cc: (0, mysql_core_1.text)(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_letter_id" }),
]);
exports.major = (0, mysql_core_1.mysqlTable)("ais_major", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    programId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.program.id, { onDelete: "set null", onUpdate: "cascade" }),
    shortName: (0, mysql_core_1.varchar)({ length: 255 }),
    longName: (0, mysql_core_1.varchar)({ length: 355 }),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_major_id" }),
]);
exports.program = (0, mysql_core_1.mysqlTable)("ais_program", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    schemeId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.scheme.id, { onDelete: "set null", onUpdate: "cascade" }),
    unitId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.unit.id, { onDelete: "set null", onUpdate: "cascade" }),
    modeId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.mode.id, { onDelete: "set null", onUpdate: "cascade" }),
    code: (0, mysql_core_1.varchar)({ length: 50 }).notNull(),
    prefix: (0, mysql_core_1.varchar)({ length: 50 }),
    stype: (0, mysql_core_1.int)(),
    shortName: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    longName: (0, mysql_core_1.varchar)({ length: 450 }).notNull(),
    category: (0, mysql_core_1.mysqlEnum)(['CP', 'DP', 'UG', 'PG']).notNull(),
    semesterTotal: (0, mysql_core_1.int)(),
    creditTotal: (0, mysql_core_1.int)(),
    shallAdmit: (0, mysql_core_1.tinyint)().default(0).notNull(),
    hasMajor: (0, mysql_core_1.tinyint)().default(0).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_program_id" }),
]);
exports.resit = (0, mysql_core_1.mysqlTable)("ais_resit", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    sessionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.resitSession.id, { onDelete: "set null", onUpdate: "cascade" }),
    registerSessionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.session.id, { onDelete: "set null", onUpdate: "cascade" }),
    trailSessionId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.session.id, { onDelete: "restrict", onUpdate: "cascade" }),
    schemeId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.scheme.id, { onDelete: "restrict", onUpdate: "cascade" }),
    courseId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.course.id, { onDelete: "restrict", onUpdate: "cascade" }),
    indexno: (0, mysql_core_1.varchar)({ length: 50 }).notNull().references(() => exports.student.indexno, { onDelete: "restrict", onUpdate: "cascade" }),
    semesterNum: (0, mysql_core_1.int)().notNull(),
    totalScore: (0, mysql_core_1.int)(),
    approveScore: (0, mysql_core_1.tinyint)().default(0).notNull(),
    taken: (0, mysql_core_1.tinyint)().default(0).notNull(),
    paid: (0, mysql_core_1.tinyint)().default(0).notNull(),
    actionType: (0, mysql_core_1.mysqlEnum)(['APPEND', 'REPLACE']),
    actionMeta: (0, mysql_core_1.json)(),
    registeredAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    entryAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    approvedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_resit_id" }),
    (0, mysql_core_1.unique)("ais_resit_trailSessionId_indexno_courseId_key").on(table.trailSessionId, table.indexno, table.courseId),
]);
exports.resitSession = (0, mysql_core_1.mysqlTable)("ais_resit_session", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 350 }).notNull(),
    start: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    end: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    period: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    default: (0, mysql_core_1.tinyint)().default(0).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_resit_session_id" }),
]);
exports.scheme = (0, mysql_core_1.mysqlTable)("ais_scheme", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    gradeMeta: (0, mysql_core_1.json)().notNull(),
    classMeta: (0, mysql_core_1.json)().notNull(),
    scoreRange: (0, mysql_core_1.json)().notNull(),
    passMark: (0, mysql_core_1.double)().notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_scheme_id" }),
]);
exports.session = (0, mysql_core_1.mysqlTable)("ais_session", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    tag: (0, mysql_core_1.varchar)({ length: 50 }).default('main'),
    title: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    year: (0, mysql_core_1.varchar)({ length: 50 }),
    semester: (0, mysql_core_1.mysqlEnum)(['1', '2']).notNull(),
    registerStart: (0, mysql_core_1.datetime)({ mode: 'string' }),
    registerEnd: (0, mysql_core_1.datetime)({ mode: 'string' }),
    registerEndLate: (0, mysql_core_1.datetime)({ mode: 'string' }),
    registerPause: (0, mysql_core_1.tinyint)().default(0).notNull(),
    orientStart: (0, mysql_core_1.datetime)({ mode: 'string' }),
    orientEnd: (0, mysql_core_1.datetime)({ mode: 'string' }),
    lectureStart: (0, mysql_core_1.datetime)({ mode: 'string' }),
    lectureEnd: (0, mysql_core_1.datetime)({ mode: 'string' }),
    paymentEnd: (0, mysql_core_1.datetime)({ mode: 'string' }),
    matriculateStart: (0, mysql_core_1.datetime)({ mode: 'string' }),
    medicalStart: (0, mysql_core_1.datetime)({ mode: 'string' }),
    medicalEnd: (0, mysql_core_1.datetime)({ mode: 'string' }),
    examStart: (0, mysql_core_1.datetime)({ mode: 'string' }),
    examEnd: (0, mysql_core_1.datetime)({ mode: 'string' }),
    entryStart: (0, mysql_core_1.datetime)({ mode: 'string' }),
    entryEnd: (0, mysql_core_1.datetime)({ mode: 'string' }),
    admissionPrefix: (0, mysql_core_1.varchar)({ length: 191 }),
    assignLateSheet: (0, mysql_core_1.tinyint)().default(0).notNull(),
    progressStudent: (0, mysql_core_1.tinyint)().default(0).notNull(),
    stageSheet: (0, mysql_core_1.tinyint)().default(0).notNull(),
    default: (0, mysql_core_1.tinyint)().default(0).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    evaluationEnd: (0, mysql_core_1.datetime)({ mode: 'string' }),
    evaluationStart: (0, mysql_core_1.datetime)({ mode: 'string' }),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_session_id" }),
]);
exports.sheet = (0, mysql_core_1.mysqlTable)("ais_sheet", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    sessionId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.session.id, { onDelete: "restrict", onUpdate: "cascade" }),
    courseId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.course.id, { onDelete: "restrict", onUpdate: "cascade" }),
    unitId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.unit.id, { onDelete: "set null", onUpdate: "cascade" }),
    programId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.program.id, { onDelete: "restrict", onUpdate: "cascade" }),
    majorId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.major.id, { onDelete: "set null", onUpdate: "cascade" }),
    assignStaffId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    assessorId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    certifierId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    semesterNum: (0, mysql_core_1.int)().notNull(),
    studyMode: (0, mysql_core_1.varchar)({ length: 50 }),
    studentCount: (0, mysql_core_1.int)().default(0),
    completeRatio: (0, mysql_core_1.double)(),
    assessed: (0, mysql_core_1.tinyint)().default(0).notNull(),
    certified: (0, mysql_core_1.tinyint)().default(0).notNull(),
    finalized: (0, mysql_core_1.tinyint)().default(0).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    classTimetable: (0, mysql_core_1.json)(),
    examTimetable: (0, mysql_core_1.json)(),
}, (table) => [
    (0, mysql_core_1.index)("ais_sheet_sessionId_programId_courseId_semesterNum_majorId_idx").on(table.sessionId, table.programId, table.courseId, table.semesterNum, table.majorId),
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_sheet_id" }),
]);
exports.structmeta = (0, mysql_core_1.mysqlTable)("ais_structmeta", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    programId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.program.id, { onDelete: "restrict", onUpdate: "cascade" }),
    majorId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.major.id, { onDelete: "set null", onUpdate: "cascade" }),
    semesterNum: (0, mysql_core_1.int)().notNull(),
    minCredit: (0, mysql_core_1.int)().notNull(),
    maxCredit: (0, mysql_core_1.int)().notNull(),
    maxElectiveNum: (0, mysql_core_1.int)(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_structmeta_id" }),
]);
exports.structure = (0, mysql_core_1.mysqlTable)("ais_structure", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    unitId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.unit.id, { onDelete: "set null", onUpdate: "cascade" }),
    programId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.program.id, { onDelete: "restrict", onUpdate: "cascade" }),
    majorId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.major.id, { onDelete: "set null", onUpdate: "cascade" }),
    courseId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.course.id, { onDelete: "restrict", onUpdate: "cascade" }),
    semesterNum: (0, mysql_core_1.int)().notNull(),
    type: (0, mysql_core_1.mysqlEnum)(['C', 'E', 'O']).notNull(),
    lock: (0, mysql_core_1.tinyint)().default(0).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_structure_id" }),
]);
exports.student = (0, mysql_core_1.mysqlTable)("ais_student", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    indexno: (0, mysql_core_1.varchar)({ length: 50 }),
    titleId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.title.id, { onDelete: "set null", onUpdate: "cascade" }),
    fname: (0, mysql_core_1.varchar)({ length: 255 }),
    mname: (0, mysql_core_1.varchar)({ length: 350 }),
    lname: (0, mysql_core_1.varchar)({ length: 255 }),
    gender: (0, mysql_core_1.varchar)({ length: 20 }),
    dob: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    maritalId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.marital.id, { onDelete: "set null", onUpdate: "cascade" }),
    email: (0, mysql_core_1.varchar)({ length: 255 }),
    phone: (0, mysql_core_1.varchar)({ length: 25 }),
    hometown: (0, mysql_core_1.varchar)({ length: 255 }),
    address: (0, mysql_core_1.varchar)({ length: 350 }),
    guardianName: (0, mysql_core_1.varchar)({ length: 350 }),
    guardianPhone: (0, mysql_core_1.varchar)({ length: 15 }),
    ghcardNo: (0, mysql_core_1.varchar)({ length: 255 }),
    nationalityId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.country.id, { onDelete: "set null", onUpdate: "cascade" }),
    countryId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.country.id, { onDelete: "set null", onUpdate: "cascade" }),
    regionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.region.id, { onDelete: "set null", onUpdate: "cascade" }),
    religionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.religion.id, { onDelete: "set null", onUpdate: "cascade" }),
    disabilityId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.disability.id, { onDelete: "set null", onUpdate: "cascade" }),
    programId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.program.id, { onDelete: "set null", onUpdate: "cascade" }),
    majorId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.major.id, { onDelete: "set null", onUpdate: "cascade" }),
    progCount: (0, mysql_core_1.int)(),
    semesterNum: (0, mysql_core_1.int)(),
    semesterDone: (0, mysql_core_1.int)(),
    creditDone: (0, mysql_core_1.int)(),
    entrySemesterNum: (0, mysql_core_1.int)(),
    entryGroup: (0, mysql_core_1.mysqlEnum)(['GH', 'INT']).default('GH'),
    entryDate: (0, mysql_core_1.datetime)({ mode: 'string' }),
    exitDate: (0, mysql_core_1.datetime)({ mode: 'string' }),
    residentialStatus: (0, mysql_core_1.mysqlEnum)(['RESIDENTIAL', 'NON_RESIDENTIAL']),
    studyMode: (0, mysql_core_1.mysqlEnum)(['M', 'W', 'E', 'A', 'f']),
    deferStatus: (0, mysql_core_1.tinyint)().default(0).notNull(),
    completeStatus: (0, mysql_core_1.tinyint)().default(0).notNull(),
    completeType: (0, mysql_core_1.mysqlEnum)(['GRADUATION', 'RASTICATED', 'FORFEITED', 'DEAD', 'DISMISSED']),
    graduateStatus: (0, mysql_core_1.tinyint)().default(0).notNull(),
    instituteEmail: (0, mysql_core_1.varchar)({ length: 350 }),
    instituteAffliate: (0, mysql_core_1.varchar)({ length: 350 }),
    flagPardon: (0, mysql_core_1.tinyint)().default(0).notNull(),
    accountNet: (0, mysql_core_1.float)(),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_student_id" }),
    (0, mysql_core_1.unique)("ais_student_id_key").on(table.id),
    (0, mysql_core_1.unique)("ais_student_indexno_key").on(table.indexno),
]);
exports.transwift = (0, mysql_core_1.mysqlTable)("ais_transwift", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    studentId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.student.id, { onDelete: "set null", onUpdate: "cascade" }),
    transactId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.transaction.id, { onUpdate: "cascade" }),
    applicant: (0, mysql_core_1.varchar)({ length: 350 }),
    receipient: (0, mysql_core_1.text)(),
    quantity: (0, mysql_core_1.int)().default(0).notNull(),
    mode: (0, mysql_core_1.mysqlEnum)(['PICKUP', 'INLAND', 'FOREIGN']).default('PICKUP'),
    version: (0, mysql_core_1.mysqlEnum)(['SOFTCOPY', 'HARDCOPY']).default('SOFTCOPY'),
    status: (0, mysql_core_1.mysqlEnum)(['PENDED', 'PRINTED', 'COMPLETED']).default('PENDED').notNull(),
    issuerId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    printedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    completedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ais_transwift_id" }),
    (0, mysql_core_1.unique)("ais_transwift_transactId_key").on(table.transactId),
]);
exports.activityApplicant = (0, mysql_core_1.mysqlTable)("ams_activity_applicant", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    serial: (0, mysql_core_1.int)(),
    meta: (0, mysql_core_1.json)(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_activity_applicant_id" }),
]);
exports.admission = (0, mysql_core_1.mysqlTable)("ams_admission", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    pgletterId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.admissionLetter.id, { onDelete: "set null", onUpdate: "cascade" }),
    ugletterId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.admissionLetter.id, { onDelete: "set null", onUpdate: "cascade" }),
    dpletterId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.admissionLetter.id, { onDelete: "set null", onUpdate: "cascade" }),
    cpletterId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.admissionLetter.id, { onDelete: "set null", onUpdate: "cascade" }),
    sessionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.session.id, { onDelete: "set null", onUpdate: "cascade" }),
    title: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    examStart: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    examEnd: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    applyStart: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    applyEnd: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    applyPause: (0, mysql_core_1.tinyint)().default(1).notNull(),
    showAdmitted: (0, mysql_core_1.tinyint)().default(1).notNull(),
    voucherIndex: (0, mysql_core_1.int)(),
    default: (0, mysql_core_1.tinyint)().default(0).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    admittedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_admission_id" }),
]);
exports.applicant = (0, mysql_core_1.mysqlTable)("ams_applicant", {
    serial: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    admissionId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.admission.id, { onDelete: "restrict", onUpdate: "cascade" }),
    stageId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.stage.id, { onDelete: "restrict", onUpdate: "cascade" }),
    applyTypeId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.applyType.id, { onDelete: "restrict", onUpdate: "cascade" }),
    choiceId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.stepChoice.id, { onDelete: "set null", onUpdate: "cascade" }),
    profileId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.stepProfile.serial, { onDelete: "set null", onUpdate: "cascade" }),
    photo: (0, mysql_core_1.longtext)(),
    meta: (0, mysql_core_1.json)(),
    gradeValue: (0, mysql_core_1.int)(),
    classValue: (0, mysql_core_1.int)(),
    sorted: (0, mysql_core_1.tinyint)().default(0).notNull(),
    submitted: (0, mysql_core_1.tinyint)().default(0).notNull(),
    submittedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.serial], name: "ams_applicant_serial" }),
]);
exports.applyType = (0, mysql_core_1.mysqlTable)("ams_applytype", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 350 }).notNull(),
    stages: (0, mysql_core_1.json)().notNull(),
    letterCondition: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_applytype_id" }),
]);
exports.awardClass = (0, mysql_core_1.mysqlTable)("ams_award_class", {
    id: (0, mysql_core_1.int)().autoincrement().notNull(),
    title: (0, mysql_core_1.varchar)({ length: 100 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_award_class_id" }),
]);
exports.category = (0, mysql_core_1.mysqlTable)("ams_category", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 100 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_category_id" }),
]);
exports.certCategory = (0, mysql_core_1.mysqlTable)("ams_cert_category", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    instituteCategoryId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.instituteCategory.id, { onDelete: "set null", onUpdate: "cascade" }),
    title: (0, mysql_core_1.varchar)({ length: 100 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_cert_category_id" }),
]);
exports.documentCategory = (0, mysql_core_1.mysqlTable)("ams_document_category", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 100 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_document_category_id" }),
]);
exports.examCategory = (0, mysql_core_1.mysqlTable)("ams_exam_category", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 100 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_exam_category_id" }),
]);
exports.amsForm = (0, mysql_core_1.mysqlTable)("ams_form", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    categoryId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.category.id, { onDelete: "set null", onUpdate: "cascade" }),
    title: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    meta: (0, mysql_core_1.json)(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_form_id" }),
]);
exports.fresher = (0, mysql_core_1.mysqlTable)("ams_fresher", {
    serial: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.student.id, { onDelete: "restrict", onUpdate: "cascade" }),
    admissionId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.admission.id, { onDelete: "restrict", onUpdate: "cascade" }),
    letterId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.admissionLetter.id, { onDelete: "set null", onUpdate: "cascade" }),
    sessionId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.session.id, { onDelete: "restrict", onUpdate: "cascade" }),
    billId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.bill.id, { onDelete: "set null", onUpdate: "cascade" }),
    programId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.program.id, { onDelete: "restrict", onUpdate: "cascade" }),
    majorId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.major.id, { onDelete: "set null", onUpdate: "cascade" }),
    sessionMode: (0, mysql_core_1.mysqlEnum)(['M', 'W', 'E']),
    categoryId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.category.id, { onDelete: "set null", onUpdate: "cascade" }),
    sellType: (0, mysql_core_1.int)(),
    semesterNum: (0, mysql_core_1.int)().notNull(),
    username: (0, mysql_core_1.varchar)({ length: 255 }),
    password: (0, mysql_core_1.varchar)({ length: 255 }),
    accept: (0, mysql_core_1.tinyint)().default(0).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.serial], name: "ams_fresher_serial" }),
]);
exports.gradeWeight = (0, mysql_core_1.mysqlTable)("ams_grade_weight", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    certCategoryId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.certCategory.id, { onDelete: "set null", onUpdate: "cascade" }),
    title: (0, mysql_core_1.varchar)({ length: 100 }).notNull(),
    weight: (0, mysql_core_1.tinyint)(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_grade_weight_id" }),
]);
exports.instituteCategory = (0, mysql_core_1.mysqlTable)("ams_institute_category", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 100 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_institute_category_id" }),
]);
exports.admissionLetter = (0, mysql_core_1.mysqlTable)("ams_letter", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    categoryId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.category.id, { onDelete: "set null", onUpdate: "cascade" }),
    title: (0, mysql_core_1.varchar)({ length: 350 }).notNull(),
    signatory: (0, mysql_core_1.text)().notNull(),
    signature: (0, mysql_core_1.longtext)().notNull(),
    template: (0, mysql_core_1.longtext)().notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_letter_id" }),
]);
exports.amsPrice = (0, mysql_core_1.mysqlTable)("ams_price", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    categoryId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.category.id, { onDelete: "set null", onUpdate: "cascade" }),
    title: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    sellType: (0, mysql_core_1.int)(),
    currency: (0, mysql_core_1.mysqlEnum)(['GHC', 'USD']).default('GHC').notNull(),
    amount: (0, mysql_core_1.double)().notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_price_id" }),
]);
exports.sorted = (0, mysql_core_1.mysqlTable)("ams_sorted", {
    serial: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    admissionId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.admission.id, { onDelete: "restrict", onUpdate: "cascade" }),
    stageId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.stage.id, { onDelete: "restrict", onUpdate: "cascade" }),
    applyTypeId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.applyType.id, { onDelete: "restrict", onUpdate: "cascade" }),
    categoryId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.category.id, { onDelete: "set null", onUpdate: "cascade" }),
    sellType: (0, mysql_core_1.int)(),
    choice1Id: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.stepChoice.id, { onDelete: "set null", onUpdate: "cascade" }),
    choice2Id: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.stepChoice.id, { onDelete: "set null", onUpdate: "cascade" }),
    profileId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.stepProfile.serial, { onDelete: "set null", onUpdate: "cascade" }),
    gradeValue: (0, mysql_core_1.int)(),
    classValue: (0, mysql_core_1.int)(),
    admitted: (0, mysql_core_1.tinyint)().default(0).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.serial], name: "ams_sorted_serial" }),
]);
exports.stage = (0, mysql_core_1.mysqlTable)("ams_stage", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    categoryId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.category.id, { onDelete: "set null", onUpdate: "cascade" }),
    formId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.amsForm.id, { onDelete: "restrict", onUpdate: "cascade" }),
    title: (0, mysql_core_1.varchar)({ length: 350 }).notNull(),
    sellType: (0, mysql_core_1.int)(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_stage_id" }),
]);
exports.stepChoice = (0, mysql_core_1.mysqlTable)("ams_step_choice", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    programId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.program.id, { onDelete: "set null", onUpdate: "cascade" }),
    majorId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.major.id, { onDelete: "set null", onUpdate: "cascade" }),
    serial: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_step_choice_id" }),
]);
exports.stepDocument = (0, mysql_core_1.mysqlTable)("ams_step_document", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    documentCategoryId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.documentCategory.id, { onDelete: "set null", onUpdate: "cascade" }),
    serial: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    base64: (0, mysql_core_1.longtext)(),
    mime: (0, mysql_core_1.varchar)({ length: 255 }),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_step_document_id" }),
]);
exports.stepEducation = (0, mysql_core_1.mysqlTable)("ams_step_education", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    serial: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    instituteCategoryId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.instituteCategory.id, { onDelete: "set null", onUpdate: "cascade" }),
    certCategoryId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.certCategory.id, { onDelete: "set null", onUpdate: "cascade" }),
    instituteName: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    certName: (0, mysql_core_1.varchar)({ length: 350 }),
    gradeValue: (0, mysql_core_1.int)(),
    classValue: (0, mysql_core_1.int)(),
    startMonth: (0, mysql_core_1.int)().notNull(),
    startYear: (0, mysql_core_1.int)().notNull(),
    endMonth: (0, mysql_core_1.int)(),
    endYear: (0, mysql_core_1.int)(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_step_education_id" }),
]);
exports.stepEmployment = (0, mysql_core_1.mysqlTable)("ams_step_employment", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    serial: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    employerName: (0, mysql_core_1.varchar)({ length: 350 }).notNull(),
    employerAddress: (0, mysql_core_1.varchar)({ length: 350 }).notNull(),
    jobTitle: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    phone: (0, mysql_core_1.varchar)({ length: 20 }).notNull(),
    email: (0, mysql_core_1.varchar)({ length: 255 }),
    address: (0, mysql_core_1.varchar)({ length: 350 }),
    startMonth: (0, mysql_core_1.int)(),
    startYear: (0, mysql_core_1.int)(),
    endMonth: (0, mysql_core_1.int)(),
    endYear: (0, mysql_core_1.int)(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_step_employment_id" }),
]);
exports.stepGrade = (0, mysql_core_1.mysqlTable)("ams_step_grade", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    resultId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.stepResult.id, { onDelete: "set null", onUpdate: "cascade" }),
    subjectId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.subject.id, { onDelete: "set null", onUpdate: "cascade" }),
    gradeWeightId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.gradeWeight.id, { onDelete: "set null", onUpdate: "cascade" }),
    serial: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    gradeValue: (0, mysql_core_1.int)().notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_step_grade_id" }),
]);
exports.stepGuardian = (0, mysql_core_1.mysqlTable)("ams_step_guardian", {
    serial: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    relationId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.relation.id, { onDelete: "restrict", onUpdate: "cascade" }),
    titleId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.title.id, { onDelete: "restrict", onUpdate: "cascade" }),
    fname: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    mname: (0, mysql_core_1.varchar)({ length: 350 }),
    lname: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    phone: (0, mysql_core_1.varchar)({ length: 20 }).notNull(),
    email: (0, mysql_core_1.varchar)({ length: 255 }),
    address: (0, mysql_core_1.varchar)({ length: 350 }),
    occupation: (0, mysql_core_1.varchar)({ length: 350 }),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.serial], name: "ams_step_guardian_serial" }),
]);
exports.stepProfile = (0, mysql_core_1.mysqlTable)("ams_step_profile", {
    serial: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    titleId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.title.id, { onDelete: "restrict", onUpdate: "cascade" }),
    fname: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    mname: (0, mysql_core_1.varchar)({ length: 350 }),
    lname: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    gender: (0, mysql_core_1.varchar)({ length: 20 }).notNull(),
    dob: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    maritalId: (0, mysql_core_1.varchar)({ length: 50 }).references(() => exports.marital.id, { onDelete: "set null", onUpdate: "cascade" }),
    disabilities: (0, mysql_core_1.varchar)({ length: 350 }),
    phone: (0, mysql_core_1.varchar)({ length: 20 }).notNull(),
    email: (0, mysql_core_1.varchar)({ length: 255 }),
    hometown: (0, mysql_core_1.varchar)({ length: 255 }),
    residentAddress: (0, mysql_core_1.varchar)({ length: 350 }),
    postalAddress: (0, mysql_core_1.varchar)({ length: 350 }),
    occupation: (0, mysql_core_1.varchar)({ length: 350 }),
    workPlace: (0, mysql_core_1.varchar)({ length: 255 }),
    bondInstitute: (0, mysql_core_1.varchar)({ length: 255 }),
    residentialStatus: (0, mysql_core_1.mysqlEnum)(['RESIDENTIAL', 'NON_RESIDENTIAL']),
    studyMode: (0, mysql_core_1.mysqlEnum)(['M', 'W', 'E', 'A', 'f']),
    nationalityId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.country.id, { onDelete: "set null", onUpdate: "cascade" }),
    countryId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.country.id, { onDelete: "set null", onUpdate: "cascade" }),
    regionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.region.id, { onDelete: "set null", onUpdate: "cascade" }),
    religionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.religion.id, { onDelete: "set null", onUpdate: "cascade" }),
    disabilityId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.disability.id, { onDelete: "set null", onUpdate: "cascade" }),
    bonded: (0, mysql_core_1.tinyint)().default(0).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.serial], name: "ams_step_profile_serial" }),
]);
exports.stepReferee = (0, mysql_core_1.mysqlTable)("ams_step_referee", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    serial: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    titleId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.title.id, { onDelete: "restrict", onUpdate: "cascade" }),
    fname: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    mname: (0, mysql_core_1.varchar)({ length: 350 }),
    lname: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    phone: (0, mysql_core_1.varchar)({ length: 20 }).notNull(),
    email: (0, mysql_core_1.varchar)({ length: 255 }),
    address: (0, mysql_core_1.varchar)({ length: 350 }),
    occupation: (0, mysql_core_1.varchar)({ length: 350 }),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_step_referee_id" }),
]);
exports.stepResult = (0, mysql_core_1.mysqlTable)("ams_step_result", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    serial: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    certCategoryId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.certCategory.id, { onDelete: "set null", onUpdate: "cascade" }),
    indexNumber: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    sitting: (0, mysql_core_1.int)(),
    startYear: (0, mysql_core_1.int)().notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_step_result_id" }),
]);
exports.subject = (0, mysql_core_1.mysqlTable)("ams_subject", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_subject_id" }),
]);
exports.vendor = (0, mysql_core_1.mysqlTable)("ams_vendor", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    name: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    phone: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    email: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    address: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    technicianName: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    technicianPhone: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    technicianEmail: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    verified: (0, mysql_core_1.tinyint)().default(1).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "ams_vendor_id" }),
]);
exports.voucher = (0, mysql_core_1.mysqlTable)("ams_voucher", {
    serial: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    pin: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    admissionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.admission.id, { onDelete: "set null", onUpdate: "cascade" }),
    vendorId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.vendor.id, { onDelete: "set null", onUpdate: "cascade" }),
    categoryId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.category.id, { onDelete: "set null", onUpdate: "cascade" }),
    sellType: (0, mysql_core_1.int)(),
    applicantName: (0, mysql_core_1.varchar)({ length: 255 }),
    applicantPhone: (0, mysql_core_1.varchar)({ length: 50 }),
    sold: (0, mysql_core_1.tinyint)().default(0).notNull(),
    soldAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    soldBy: (0, mysql_core_1.varchar)({ length: 255 }),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.serial], name: "ams_voucher_serial" }),
]);
exports.country = (0, mysql_core_1.mysqlTable)("country", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    code: (0, mysql_core_1.int)(),
    shortName: (0, mysql_core_1.varchar)({ length: 10 }),
    longName: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    nationality: (0, mysql_core_1.varchar)({ length: 300 }),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "country_id" }),
]);
exports.disability = (0, mysql_core_1.mysqlTable)("disability", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "disability_id" }),
]);
exports.evaluation = (0, mysql_core_1.mysqlTable)("evaluation", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    courseId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.course.id, { onDelete: "restrict", onUpdate: "cascade" }),
    staffNo: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    indexno: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.student.indexno, { onDelete: "set null", onUpdate: "cascade" }),
    sessionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.session.id, { onDelete: "set null", onUpdate: "cascade" }),
    status: (0, mysql_core_1.varchar)({ length: 50 }).notNull(),
    startedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    completedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "evaluation_id" }),
    (0, mysql_core_1.unique)("evaluation_indexno_sessionId_courseId_key").on(table.indexno, table.sessionId, table.courseId),
]);
exports.evaluationOption = (0, mysql_core_1.mysqlTable)("evaluation_option", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    option: (0, mysql_core_1.varchar)({ length: 100 }).notNull(),
    value: (0, mysql_core_1.int)().notNull(),
    orderNum: (0, mysql_core_1.int)().notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "evaluation_option_id" }),
]);
exports.evaluationQuestion = (0, mysql_core_1.mysqlTable)("evaluation_question", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    question: (0, mysql_core_1.varchar)({ length: 500 }).notNull(),
    category: (0, mysql_core_1.varchar)({ length: 100 }).notNull(),
    type: (0, mysql_core_1.varchar)({ length: 50 }).notNull(),
    orderNum: (0, mysql_core_1.int)().notNull(),
    required: (0, mysql_core_1.tinyint)().default(1).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "evaluation_question_id" }),
]);
exports.evaluationResponse = (0, mysql_core_1.mysqlTable)("evaluation_response", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    evaluationId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.evaluation.id, { onDelete: "cascade", onUpdate: "cascade" }),
    questionId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.evaluationQuestion.id, { onDelete: "restrict", onUpdate: "cascade" }),
    optionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.evaluationOption.id, { onDelete: "set null", onUpdate: "cascade" }),
    response: (0, mysql_core_1.text)(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "evaluation_response_id" }),
    (0, mysql_core_1.unique)("evaluation_response_evaluationId_questionId_key").on(table.evaluationId, table.questionId),
]);
exports.attack = (0, mysql_core_1.mysqlTable)("evs_attack", {
    id: (0, mysql_core_1.int)().autoincrement().notNull(),
    electionId: (0, mysql_core_1.int)().references(() => exports.election.id, { onDelete: "set null", onUpdate: "cascade" }),
    tag: (0, mysql_core_1.varchar)({ length: 100 }),
    location: (0, mysql_core_1.varchar)({ length: 450 }),
    ip: (0, mysql_core_1.varchar)({ length: 50 }),
    meta: (0, mysql_core_1.text)(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "evs_attack_id" }),
]);
exports.candidate = (0, mysql_core_1.mysqlTable)("evs_candidate", {
    id: (0, mysql_core_1.int)().autoincrement().notNull(),
    portfolioId: (0, mysql_core_1.int)().references(() => exports.portfolio.id, { onDelete: "set null", onUpdate: "cascade" }),
    tag: (0, mysql_core_1.varchar)({ length: 100 }),
    name: (0, mysql_core_1.varchar)({ length: 450 }),
    teaser: (0, mysql_core_1.varchar)({ length: 100 }),
    orderNo: (0, mysql_core_1.int)().default(1).notNull(),
    photo: (0, mysql_core_1.varchar)({ length: 450 }),
    votes: (0, mysql_core_1.int)().default(0).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "evs_candidate_id" }),
]);
exports.election = (0, mysql_core_1.mysqlTable)("evs_election", {
    id: (0, mysql_core_1.serial)("id").primaryKey(),
    groupId: (0, mysql_core_1.int)("groupId").references(() => exports.group.id, { onDelete: "set null", onUpdate: "cascade" }),
    type: (0, mysql_core_1.varchar)("type", { length: 300 }).notNull(),
    title: (0, mysql_core_1.varchar)("title", { length: 450 }),
    tag: (0, mysql_core_1.varchar)("tag", { length: 100 }),
    logo: (0, mysql_core_1.varchar)("logo", { length: 450 }),
    admins: (0, mysql_core_1.json)("admins"),
    voterCount: (0, mysql_core_1.int)("voterCount").default(0).notNull(),
    voterList: (0, mysql_core_1.json)("voterList"),
    voterData: (0, mysql_core_1.json)("voterData"),
    allowMonitor: (0, mysql_core_1.boolean)("allowMonitor").default(false).notNull(),
    allowEcMonitor: (0, mysql_core_1.boolean)("allowEcMonitor").default(false).notNull(),
    allowVip: (0, mysql_core_1.boolean)("allowVip").default(false).notNull(),
    allowEcVip: (0, mysql_core_1.boolean)("allowEcVip").default(false).notNull(),
    allowResult: (0, mysql_core_1.boolean)("allowResult").default(false).notNull(),
    allowEcResult: (0, mysql_core_1.boolean)("allowEcResult").default(false).notNull(),
    allowMask: (0, mysql_core_1.boolean)("allowMask").default(false).notNull(),
    autoStop: (0, mysql_core_1.boolean)("autoStop").default(false).notNull(),
    startAt: (0, mysql_core_1.datetime)({ mode: 'string' }),
    endAt: (0, mysql_core_1.datetime)({ mode: 'string' }),
    action: (0, mysql_core_1.mysqlEnum)(['STAGED', 'STARTED', 'ENDED']).default('STAGED').notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
});
exports.elector = (0, mysql_core_1.mysqlTable)("evs_elector", {
    id: (0, mysql_core_1.int)().autoincrement().notNull(),
    electionId: (0, mysql_core_1.int)().notNull().references(() => exports.election.id, { onDelete: "restrict", onUpdate: "cascade" }),
    tag: (0, mysql_core_1.varchar)("tag", { length: 100 }),
    name: (0, mysql_core_1.varchar)("name", { length: 450 }),
    descriptor: (0, mysql_core_1.varchar)("descriptor", { length: 450 }),
    gender: (0, mysql_core_1.varchar)("gender", { length: 1 }),
    voteTime: (0, mysql_core_1.timestamp)("voteTime").defaultNow().notNull(),
    voteSum: (0, mysql_core_1.varchar)("voteSum", { length: 750 }),
    voteHash: (0, mysql_core_1.varchar)("voteHash", { length: 100 }),
    voteIp: (0, mysql_core_1.varchar)("voteIp", { length: 50 }),
    voteStatus: (0, mysql_core_1.boolean)("voteStatus").default(true).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "evs_elector_id" }),
]);
exports.portfolio = (0, mysql_core_1.mysqlTable)("evs_portfolio", {
    id: (0, mysql_core_1.int)().autoincrement().notNull(),
    electionId: (0, mysql_core_1.int)().notNull().references(() => exports.election.id, { onDelete: "restrict", onUpdate: "cascade" }),
    title: (0, mysql_core_1.text)("title"),
    status: (0, mysql_core_1.boolean)("status").default(true).notNull(),
    createdAt: (0, mysql_core_1.datetime)("createdAt").default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)("updatedAt").notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "evs_portfolio_id" }),
]);
exports.activityFinanceApi = (0, mysql_core_1.mysqlTable)("fms_activity_api", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    ip: (0, mysql_core_1.varchar)({ length: 50 }),
    title: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    meta: (0, mysql_core_1.json)(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "fms_activity_api_id" }),
]);
exports.activityBill = (0, mysql_core_1.mysqlTable)("fms_activity_bill", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    billId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.bill.id, { onDelete: "set null", onUpdate: "cascade" }),
    userId: (0, mysql_core_1.int)().references(() => exports.user.id, { onDelete: "set null", onUpdate: "cascade" }),
    amount: (0, mysql_core_1.double)(),
    discount: (0, mysql_core_1.double)(),
    receivers: (0, mysql_core_1.json)(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "fms_activity_bill_id" }),
]);
exports.activityFinanceVoucher = (0, mysql_core_1.mysqlTable)("fms_activity_voucher", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    transactId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.transaction.id, { onDelete: "set null", onUpdate: "cascade" }),
    admissionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.admission.id, { onDelete: "set null", onUpdate: "cascade" }),
    serial: (0, mysql_core_1.varchar)({ length: 191 }),
    pin: (0, mysql_core_1.varchar)({ length: 8 }),
    buyerName: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    buyerPhone: (0, mysql_core_1.varchar)({ length: 15 }).notNull(),
    smsCode: (0, mysql_core_1.int)(),
    generated: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "fms_activity_voucher_id" }),
]);
exports.bankacc = (0, mysql_core_1.mysqlTable)("fms_bankacc", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    unitId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.unit.id, { onDelete: "restrict", onUpdate: "cascade" }),
    tag: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    accountName: (0, mysql_core_1.varchar)({ length: 450 }).notNull(),
    accountDescription: (0, mysql_core_1.varchar)({ length: 450 }).notNull(),
    bankName: (0, mysql_core_1.varchar)({ length: 350 }).notNull(),
    bankAccount: (0, mysql_core_1.varchar)({ length: 30 }).notNull(),
    bankBranch: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    bankContact: (0, mysql_core_1.varchar)({ length: 20 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "fms_bankacc_id" }),
]);
exports.bill = (0, mysql_core_1.mysqlTable)("fms_bill", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    sessionId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.session.id, { onDelete: "restrict", onUpdate: "cascade" }),
    bankaccId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.bankacc.id, { onDelete: "set null", onUpdate: "cascade" }),
    programId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.program.id, { onDelete: "set null", onUpdate: "cascade" }),
    includeStudentIds: (0, mysql_core_1.json)(),
    excludeStudentIds: (0, mysql_core_1.json)(),
    mainGroupCode: (0, mysql_core_1.varchar)({ length: 4 }).notNull(),
    discountGroupCode: (0, mysql_core_1.varchar)({ length: 4 }),
    narrative: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    type: (0, mysql_core_1.mysqlEnum)(['GH', 'INT']).default('GH').notNull(),
    residentialStatus: (0, mysql_core_1.mysqlEnum)(['RESIDENTIAL', 'NON_RESIDENTIAL']).default('RESIDENTIAL'),
    currency: (0, mysql_core_1.mysqlEnum)(['GHC', 'USD']).default('GHC').notNull(),
    amount: (0, mysql_core_1.double)().notNull(),
    discount: (0, mysql_core_1.double)(),
    quota: (0, mysql_core_1.double)(),
    posted: (0, mysql_core_1.tinyint)().default(0).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "fms_bill_id" }),
]);
exports.charge = (0, mysql_core_1.mysqlTable)("fms_charge", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    studentId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.student.id, { onDelete: "set null", onUpdate: "cascade" }),
    title: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    type: (0, mysql_core_1.mysqlEnum)(['FINE', 'FEES', 'GRADUATION', 'RESIT']),
    currency: (0, mysql_core_1.mysqlEnum)(['GHC', 'USD']).default('GHC').notNull(),
    amount: (0, mysql_core_1.double)().notNull(),
    posted: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "fms_charge_id" }),
]);
exports.collector = (0, mysql_core_1.mysqlTable)("fms_collector", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    name: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    address: (0, mysql_core_1.text)(),
    phone: (0, mysql_core_1.int)(),
    technicianName: (0, mysql_core_1.varchar)({ length: 450 }),
    technicianPhone: (0, mysql_core_1.int)(),
    apiToken: (0, mysql_core_1.varchar)({ length: 350 }),
    apiEnabled: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "fms_collector_id" }),
]);
exports.studentAccount = (0, mysql_core_1.mysqlTable)("fms_studaccount", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    studentId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.student.id, { onDelete: "set null", onUpdate: "cascade" }),
    transactId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.transaction.id, { onDelete: "set null", onUpdate: "cascade" }),
    sessionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.session.id, { onDelete: "set null", onUpdate: "cascade" }),
    chargeId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.charge.id, { onDelete: "set null", onUpdate: "cascade" }),
    billId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.bill.id, { onDelete: "set null", onUpdate: "cascade" }),
    type: (0, mysql_core_1.mysqlEnum)(['CHARGE', 'BILL', 'PAYMENT']),
    narrative: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    currency: (0, mysql_core_1.mysqlEnum)(['GHC', 'USD']).default('GHC').notNull(),
    amount: (0, mysql_core_1.double)().notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.index)("fms_studaccount_billId_idx").on(table.billId),
    (0, mysql_core_1.index)("fms_studaccount_chargeId_idx").on(table.chargeId),
    (0, mysql_core_1.index)("fms_studaccount_narrative_idx").on(table.narrative),
    (0, mysql_core_1.index)("fms_studaccount_sessionId_idx").on(table.sessionId),
    (0, mysql_core_1.index)("fms_studaccount_studentId_idx").on(table.studentId),
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "fms_studaccount_id" }),
]);
exports.transaction = (0, mysql_core_1.mysqlTable)("fms_transaction", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    collectorId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.collector.id, { onDelete: "set null", onUpdate: "cascade" }),
    transtypeId: (0, mysql_core_1.int)().references(() => exports.transtype.id, { onDelete: "set null", onUpdate: "cascade" }),
    bankaccId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.bankacc.id, { onDelete: "set null", onUpdate: "cascade" }),
    studentId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.student.id, { onDelete: "set null", onUpdate: "cascade" }),
    reference: (0, mysql_core_1.varchar)({ length: 191 }),
    transtag: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    payType: (0, mysql_core_1.mysqlEnum)(['BANK', 'MOMO']).default('BANK'),
    feeType: (0, mysql_core_1.mysqlEnum)(['NORMAL', 'SCHOLARSHIP']).default('NORMAL'),
    currency: (0, mysql_core_1.mysqlEnum)(['GHC', 'USD']).default('GHC').notNull(),
    amount: (0, mysql_core_1.double)().notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.index)("fms_transaction_reference_idx").on(table.reference),
    (0, mysql_core_1.index)("fms_transaction_studentId_idx").on(table.studentId),
    (0, mysql_core_1.index)("fms_transaction_transtag_idx").on(table.transtag),
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "fms_transaction_id" }),
]);
exports.transtype = (0, mysql_core_1.mysqlTable)("fms_transtype", {
    id: (0, mysql_core_1.int)().autoincrement().notNull(),
    bankaccId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.bankacc.id, { onDelete: "set null", onUpdate: "cascade" }),
    bankaccMeta: (0, mysql_core_1.json)(),
    title: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    visibility: (0, mysql_core_1.mysqlEnum)(['PUBLIC', 'LOCAL']).default('PUBLIC').notNull(),
    amountInGhc: (0, mysql_core_1.double)(),
    amountInUsd: (0, mysql_core_1.double)(),
    remark: (0, mysql_core_1.varchar)({ length: 350 }),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "fms_transtype_id" }),
]);
exports.circular = (0, mysql_core_1.mysqlTable)("hrs_circular", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    uploadId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.upload.id, { onDelete: "set null", onUpdate: "cascade" }),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_circular_id" }),
]);
exports.form = (0, mysql_core_1.mysqlTable)("hrs_form", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    typeId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.formType.id, { onDelete: "set null", onUpdate: "cascade" }),
    title: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_form_id" }),
]);
exports.formType = (0, mysql_core_1.mysqlTable)("hrs_form_type", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_form_type_id" }),
]);
exports.job = (0, mysql_core_1.mysqlTable)("hrs_job", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    type: (0, mysql_core_1.mysqlEnum)(['ACADEMIC', 'NON_ACADEMIC']).notNull(),
    yearsToNextRank: (0, mysql_core_1.int)(),
    allowNextRank: (0, mysql_core_1.tinyint)().default(1).notNull(),
    staffCategory: (0, mysql_core_1.mysqlEnum)(['JS', 'SS', 'SM']),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_job_id" }),
]);
exports.leave = (0, mysql_core_1.mysqlTable)("hrs_leave", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    leaveCategoryId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.leaveCategory.id, { onDelete: "set null", onUpdate: "cascade" }),
    staffId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    relieverId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    supervisorId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    approverId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    leaveWeight: (0, mysql_core_1.int)().default(0).notNull(),
    entitledWeight: (0, mysql_core_1.int)().default(0).notNull(),
    sosPhone: (0, mysql_core_1.varchar)({ length: 191 }),
    sosAddress: (0, mysql_core_1.varchar)({ length: 191 }),
    supervisorRemark: (0, mysql_core_1.text)(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    startDate: (0, mysql_core_1.date)({ mode: 'string' }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    endDate: (0, mysql_core_1.date)({ mode: 'string' }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    resumeDate: (0, mysql_core_1.date)({ mode: 'string' }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    approvedDate: (0, mysql_core_1.date)({ mode: 'string' }),
    flagResumed: (0, mysql_core_1.tinyint)().default(0).notNull(),
    status: (0, mysql_core_1.mysqlEnum)(['HEAD_PENDING', 'HR_PENDING', 'GRANTED', 'ENDED', 'APPROVED', 'DECLINED', 'CANCELLED']).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_leave_id" }),
]);
exports.leaveApprover = (0, mysql_core_1.mysqlTable)("hrs_leave_approver", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    approverId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    identifier: (0, mysql_core_1.mysqlEnum)(['STAFF', 'UNIT', 'JOB']),
    value: (0, mysql_core_1.varchar)({ length: 191 }),
    values: (0, mysql_core_1.json)(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_leave_approver_id" }),
]);
exports.leaveBalance = (0, mysql_core_1.mysqlTable)("hrs_leave_balance", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    flagUsed: (0, mysql_core_1.tinyint)().default(0).notNull(),
    leaveWeight: (0, mysql_core_1.int)().default(0).notNull(),
    staffId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    usedWeight: (0, mysql_core_1.int)().default(0).notNull(),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_leave_balance_id" }),
]);
exports.leaveCategory = (0, mysql_core_1.mysqlTable)("hrs_leave_category", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 191 }),
    description: (0, mysql_core_1.text)(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_leave_category_id" }),
]);
exports.leaveConstant = (0, mysql_core_1.mysqlTable)("hrs_leave_constant", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 191 }),
    leaveWeight: (0, mysql_core_1.int)().default(0).notNull(),
    action: (0, mysql_core_1.mysqlEnum)(['ADD', 'DEDUCT']).notNull(),
    staffCategory: (0, mysql_core_1.mysqlEnum)(['JS', 'SS', 'SM']).notNull(),
    exclusionRemark: (0, mysql_core_1.text)(),
    exclusionIdentifier: (0, mysql_core_1.mysqlEnum)(['STAFF', 'UNIT', 'JOB']),
    exclusionValues: (0, mysql_core_1.json)(),
    effectiveYear: (0, mysql_core_1.int)().notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_leave_constant_id" }),
]);
exports.leaveDefer = (0, mysql_core_1.mysqlTable)("hrs_leave_defer", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    staffId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    supervisorId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    approverId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    reason: (0, mysql_core_1.text)(),
    leaveWeight: (0, mysql_core_1.int)().default(0).notNull(),
    usedWeight: (0, mysql_core_1.int)().default(0).notNull(),
    currentYear: (0, mysql_core_1.int)().notNull(),
    effectiveYear: (0, mysql_core_1.int)().notNull(),
    status: (0, mysql_core_1.mysqlEnum)(['HEAD_PENDING', 'HR_PENDING', 'GRANTED', 'ENDED', 'APPROVED', 'DECLINED', 'CANCELLED']).default('HEAD_PENDING').notNull(),
    approvedOn: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_leave_defer_id" }),
]);
exports.leaveExempt = (0, mysql_core_1.mysqlTable)("hrs_leave_exempt", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 191 }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    period: (0, mysql_core_1.date)({ mode: 'string' }),
    effectiveYear: (0, mysql_core_1.int)().notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_leave_exempt_id" }),
]);
exports.leaveWeight = (0, mysql_core_1.mysqlTable)("hrs_leave_weight", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    jobIdentifiers: (0, mysql_core_1.json)(),
    leaveCategoryId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.leaveCategory.id, { onDelete: "set null", onUpdate: "cascade" }),
    leaveWeight: (0, mysql_core_1.int)().default(0).notNull(),
    staffCategory: (0, mysql_core_1.mysqlEnum)(['JS', 'SS', 'SM']).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_leave_weight_id" }),
]);
exports.nss = (0, mysql_core_1.mysqlTable)("hrs_nss", {
    nssNo: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    titleId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.title.id, { onDelete: "set null", onUpdate: "cascade" }),
    fname: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    mname: (0, mysql_core_1.varchar)({ length: 350 }),
    lname: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    gender: (0, mysql_core_1.varchar)({ length: 20 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    dob: (0, mysql_core_1.date)({ mode: 'string' }),
    maritalId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.marital.id, { onDelete: "set null", onUpdate: "cascade" }),
    disabilities: (0, mysql_core_1.varchar)({ length: 350 }),
    phone: (0, mysql_core_1.varchar)({ length: 20 }),
    email: (0, mysql_core_1.varchar)({ length: 255 }),
    hometown: (0, mysql_core_1.varchar)({ length: 255 }),
    birthplace: (0, mysql_core_1.varchar)({ length: 255 }),
    district: (0, mysql_core_1.varchar)({ length: 255 }),
    ssnitNo: (0, mysql_core_1.varchar)({ length: 255 }),
    ghcardNo: (0, mysql_core_1.varchar)({ length: 255 }),
    residentAddress: (0, mysql_core_1.varchar)({ length: 350 }),
    ssoPhone: (0, mysql_core_1.varchar)({ length: 15 }),
    ssoAddress: (0, mysql_core_1.varchar)({ length: 350 }),
    qualification: (0, mysql_core_1.varchar)({ length: 650 }),
    countryId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.country.id, { onDelete: "set null", onUpdate: "cascade" }),
    regionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.region.id, { onDelete: "set null", onUpdate: "cascade" }),
    religionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.religion.id, { onDelete: "set null", onUpdate: "cascade" }),
    unitId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.unit.id, { onDelete: "set null", onUpdate: "cascade" }),
    nssStatus: (0, mysql_core_1.mysqlEnum)(['ACTIVE', 'RELEASED', 'COMPLETED']).default('ACTIVE').notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.nssNo], name: "hrs_nss_nssNo" }),
    (0, mysql_core_1.unique)("hrs_nss_email_key").on(table.email),
    (0, mysql_core_1.unique)("hrs_nss_ghcardNo_key").on(table.ghcardNo),
    (0, mysql_core_1.unique)("hrs_nss_nssNo_key").on(table.nssNo),
    (0, mysql_core_1.unique)("hrs_nss_phone_key").on(table.phone),
    (0, mysql_core_1.unique)("hrs_nss_ssnitNo_key").on(table.ssnitNo),
]);
exports.option = (0, mysql_core_1.mysqlTable)("hrs_option", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    questionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.question.id, { onDelete: "set null", onUpdate: "cascade" }),
    atttachId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.upload.id, { onDelete: "set null", onUpdate: "cascade" }),
    title: (0, mysql_core_1.text)(),
    tag: (0, mysql_core_1.varchar)({ length: 350 }),
    orderNum: (0, mysql_core_1.int)(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_option_id" }),
]);
exports.paper = (0, mysql_core_1.mysqlTable)("hrs_paper", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_paper_id" }),
]);
exports.position = (0, mysql_core_1.mysqlTable)("hrs_position", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    staffNo: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    scaleId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.scale.id, { onDelete: "set null", onUpdate: "cascade" }),
    staffCategory: (0, mysql_core_1.mysqlEnum)(['JS', 'SS', 'SM']).notNull(),
    letterAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    startAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    endAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    duration: (0, mysql_core_1.int)(),
    type: (0, mysql_core_1.mysqlEnum)(['APPOINTMENT', 'RENEWAL']).default('APPOINTMENT').notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    positionInfoId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.positionInfo.id, { onDelete: "set null", onUpdate: "cascade" }),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_position_id" }),
]);
exports.positionInfo = (0, mysql_core_1.mysqlTable)("hrs_position_info", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    unitId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.unit.id, { onDelete: "set null", onUpdate: "cascade" }),
    title: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    description: (0, mysql_core_1.text)(),
    duties: (0, mysql_core_1.text)(),
    allowances: (0, mysql_core_1.json)(),
    durationInYears: (0, mysql_core_1.int)(),
    renewalInYears: (0, mysql_core_1.int)(),
    staffCategory: (0, mysql_core_1.mysqlEnum)(['JS', 'SS', 'SM']).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_position_info_id" }),
]);
exports.promotion = (0, mysql_core_1.mysqlTable)("hrs_promotion", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    staffNo: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    jobId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.job.id, { onDelete: "set null", onUpdate: "cascade" }),
    scaleId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.scale.id, { onDelete: "set null", onUpdate: "cascade" }),
    staffCategory: (0, mysql_core_1.mysqlEnum)(['JS', 'SS', 'SM']).notNull(),
    probation: (0, mysql_core_1.int)(),
    type: (0, mysql_core_1.mysqlEnum)(['APPOINTMENT', 'PROMOTION', 'UPGRADE']).default('APPOINTMENT').notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    assumeDate: (0, mysql_core_1.date)({ mode: 'string' }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    confirmDate: (0, mysql_core_1.date)({ mode: 'string' }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    letterDate: (0, mysql_core_1.date)({ mode: 'string' }),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    effectiveDate: (0, mysql_core_1.date)({ mode: 'string' }),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_promotion_id" }),
]);
exports.qualification = (0, mysql_core_1.mysqlTable)("hrs_qualification", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_qualification_id" }),
]);
exports.question = (0, mysql_core_1.mysqlTable)("hrs_question", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    formId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.form.id, { onDelete: "set null", onUpdate: "cascade" }),
    sectionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.section.id, { onDelete: "set null", onUpdate: "cascade" }),
    code: (0, mysql_core_1.varchar)({ length: 191 }),
    title: (0, mysql_core_1.text)(),
    orderNum: (0, mysql_core_1.int)(),
    preview: (0, mysql_core_1.varchar)({ length: 191 }),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_question_id" }),
]);
exports.relative = (0, mysql_core_1.mysqlTable)("hrs_relative", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    relationId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.relation.id, { onDelete: "set null", onUpdate: "cascade" }),
    titleId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.title.id, { onDelete: "set null", onUpdate: "cascade" }),
    code: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    fname: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    mname: (0, mysql_core_1.varchar)({ length: 350 }),
    lname: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    gender: (0, mysql_core_1.varchar)({ length: 20 }).notNull(),
    dob: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    phone: (0, mysql_core_1.varchar)({ length: 20 }).notNull(),
    address: (0, mysql_core_1.varchar)({ length: 350 }),
    hometown: (0, mysql_core_1.varchar)({ length: 255 }),
    isKin: (0, mysql_core_1.tinyint)().default(1).notNull(),
    isAlive: (0, mysql_core_1.tinyint)().default(1).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    staffId: (0, mysql_core_1.varchar)({ length: 191 }).notNull().references(() => exports.staff.staffNo, { onDelete: "restrict", onUpdate: "cascade" }),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_relative_id" }),
]);
exports.respondent = (0, mysql_core_1.mysqlTable)("hrs_respondent", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    formId: (0, mysql_core_1.varchar)({ length: 191 }),
    staffId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    supervisorId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    tag: (0, mysql_core_1.varchar)({ length: 191 }),
    responseMeta: (0, mysql_core_1.json)(),
    status: (0, mysql_core_1.mysqlEnum)(['HEAD_PENDING', 'HEAD_REQUIRES_UPDATE', 'DEAN_PENDING', 'DEAN_REQUIRES_UPDATE', 'PROVOST_PENDING', 'PROVOST_REQUIRES_UPDATE', 'AMP_FORWARDED', 'AMP_APPROVED', 'GRANTED', 'DECLINED', 'CANCELLED']).default('HEAD_PENDING'),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    nssId: (0, mysql_core_1.varchar)({ length: 191 }),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_respondent_id" }),
]);
exports.response = (0, mysql_core_1.mysqlTable)("hrs_response", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    questionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.question.id, { onDelete: "set null", onUpdate: "cascade" }),
    content: (0, mysql_core_1.text)(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    attachId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.upload.id, { onDelete: "set null", onUpdate: "cascade" }),
    respondentId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.respondent.id, { onDelete: "set null", onUpdate: "cascade" }),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_response_id" }),
]);
exports.scale = (0, mysql_core_1.mysqlTable)("hrs_scale", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    grade: (0, mysql_core_1.varchar)({ length: 350 }),
    gradeNum: (0, mysql_core_1.int)(),
    notch: (0, mysql_core_1.int)(),
    notchAmount: (0, mysql_core_1.double)(),
    level: (0, mysql_core_1.mysqlEnum)(['L', 'H', 'AH']).notNull(),
    staffCategory: (0, mysql_core_1.mysqlEnum)(['JS', 'SS', 'SM']).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_scale_id" }),
]);
exports.section = (0, mysql_core_1.mysqlTable)("hrs_section", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    type: (0, mysql_core_1.varchar)({ length: 191 }),
    formType: (0, mysql_core_1.varchar)({ length: 191 }),
    path: (0, mysql_core_1.varchar)({ length: 191 }),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_section_id" }),
]);
exports.specialization = (0, mysql_core_1.mysqlTable)("hrs_specialization", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_specialization_id" }),
]);
exports.staff = (0, mysql_core_1.mysqlTable)("hrs_staff", {
    staffNo: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    titleId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.title.id, { onDelete: "set null", onUpdate: "cascade" }),
    fname: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    mname: (0, mysql_core_1.varchar)({ length: 350 }),
    lname: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    gender: (0, mysql_core_1.varchar)({ length: 20 }).notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    dob: (0, mysql_core_1.date)({ mode: 'string' }),
    maritalId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.marital.id, { onDelete: "set null", onUpdate: "cascade" }),
    disabilities: (0, mysql_core_1.varchar)({ length: 350 }),
    phone: (0, mysql_core_1.varchar)({ length: 20 }),
    email: (0, mysql_core_1.varchar)({ length: 255 }),
    hometown: (0, mysql_core_1.varchar)({ length: 255 }),
    birthplace: (0, mysql_core_1.varchar)({ length: 255 }),
    district: (0, mysql_core_1.varchar)({ length: 255 }),
    ssnitNo: (0, mysql_core_1.varchar)({ length: 255 }),
    ghcardNo: (0, mysql_core_1.varchar)({ length: 255 }),
    residentAddress: (0, mysql_core_1.varchar)({ length: 350 }),
    occupation: (0, mysql_core_1.varchar)({ length: 350 }),
    qualification: (0, mysql_core_1.varchar)({ length: 650 }),
    instituteEmail: (0, mysql_core_1.varchar)({ length: 350 }),
    countryId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.country.id, { onDelete: "set null", onUpdate: "cascade" }),
    regionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.region.id, { onDelete: "set null", onUpdate: "cascade" }),
    religionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.religion.id, { onDelete: "set null", onUpdate: "cascade" }),
    unitId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.unit.id, { onDelete: "set null", onUpdate: "cascade" }),
    jobId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.job.id, { onDelete: "set null", onUpdate: "cascade" }),
    jobMode: (0, mysql_core_1.varchar)({ length: 350 }),
    promotionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.promotion.id, { onDelete: "set null", onUpdate: "cascade" }),
    positionId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.position.id, { onDelete: "set null", onUpdate: "cascade" }),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    staffStatus: (0, mysql_core_1.mysqlEnum)(['TEMPORAL', 'PERMANENT', 'DEAD', 'RETIRED', 'ABSENCE', 'EXITED']).default('PERMANENT').notNull(),
    // you can use { mode: 'date' }, if you want to have Date as type for this column
    exitDate: (0, mysql_core_1.date)({ mode: 'string' }),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    exitRemark: (0, mysql_core_1.text)(),
    firstOfferId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.promotion.id, { onDelete: "set null", onUpdate: "cascade" }),
    ssoAddress: (0, mysql_core_1.varchar)({ length: 350 }),
    ssoPhone: (0, mysql_core_1.varchar)({ length: 15 }),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.staffNo], name: "hrs_staff_staffNo" }),
    (0, mysql_core_1.unique)("hrs_staff_email_key").on(table.email),
    (0, mysql_core_1.unique)("hrs_staff_ghcardNo_key").on(table.ghcardNo),
    (0, mysql_core_1.unique)("hrs_staff_phone_key").on(table.phone),
    (0, mysql_core_1.unique)("hrs_staff_ssnitNo_key").on(table.ssnitNo),
    (0, mysql_core_1.unique)("hrs_staff_staffNo_key").on(table.staffNo),
]);
exports.transfer = (0, mysql_core_1.mysqlTable)("hrs_transfer", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    fromUnitId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.unit.id, { onDelete: "set null", onUpdate: "cascade" }),
    toUnitId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.unit.id, { onDelete: "set null", onUpdate: "cascade" }),
    reason: (0, mysql_core_1.varchar)({ length: 350 }),
    status: (0, mysql_core_1.mysqlEnum)(['HEAD_PENDING', 'HR_PENDING', 'GRANTED', 'ENDED', 'APPROVED', 'DECLINED', 'CANCELLED']).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    letterDate: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    applyType: (0, mysql_core_1.mysqlEnum)(['DHR', 'SELF']).notNull(),
    approvedOn: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }),
    approverId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    creatorId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
    effectiveDate: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    staffId: (0, mysql_core_1.varchar)({ length: 191 }).references(() => exports.staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_transfer_id" }),
]);
exports.upload = (0, mysql_core_1.mysqlTable)("hrs_upload", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    uploadType: (0, mysql_core_1.varchar)({ length: 191 }),
    path: (0, mysql_core_1.varchar)({ length: 191 }),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    mime: (0, mysql_core_1.varchar)({ length: 191 }),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "hrs_upload_id" }),
]);
exports.informer = (0, mysql_core_1.mysqlTable)("informer", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    reference: (0, mysql_core_1.varchar)({ length: 191 }),
    title: (0, mysql_core_1.varchar)({ length: 350 }).notNull(),
    content: (0, mysql_core_1.text)(),
    smsContent: (0, mysql_core_1.text)(),
    receiver: (0, mysql_core_1.mysqlEnum)(['APPLICANT', 'FRESHER', 'FINAL', 'STUDENT', 'UNDERGRAD', 'POSTGRAD', 'ALUMNI', 'STAFF', 'HOD', 'DEAN', 'ASSESSOR', 'DEBTOR']).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "informer_id" }),
]);
exports.log = (0, mysql_core_1.mysqlTable)("log", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    action: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    user: (0, mysql_core_1.varchar)({ length: 255 }),
    student: (0, mysql_core_1.varchar)({ length: 255 }),
    meta: (0, mysql_core_1.json)().notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "log_id" }),
]);
exports.marital = (0, mysql_core_1.mysqlTable)("marital", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "marital_id" }),
]);
exports.mode = (0, mysql_core_1.mysqlTable)("mode", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    code: (0, mysql_core_1.varchar)({ length: 50 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "mode_id" }),
]);
exports.region = (0, mysql_core_1.mysqlTable)("region", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    tag: (0, mysql_core_1.varchar)({ length: 50 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "region_id" }),
]);
exports.relation = (0, mysql_core_1.mysqlTable)("relation", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "relation_id" }),
]);
exports.religion = (0, mysql_core_1.mysqlTable)("religion", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "religion_id" }),
]);
exports.app = (0, mysql_core_1.mysqlTable)("sso_app", {
    id: (0, mysql_core_1.int)().autoincrement().notNull(),
    title: (0, mysql_core_1.varchar)({ length: 300 }).notNull(),
    tag: (0, mysql_core_1.varchar)({ length: 50 }).notNull(),
    description: (0, mysql_core_1.varchar)({ length: 300 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "sso_app_id" }),
]);
exports.appRole = (0, mysql_core_1.mysqlTable)("sso_arole", {
    id: (0, mysql_core_1.int)().autoincrement().notNull(),
    appId: (0, mysql_core_1.int)().notNull().references(() => exports.app.id, { onDelete: "restrict", onUpdate: "cascade" }),
    title: (0, mysql_core_1.varchar)({ length: 300 }).notNull(),
    description: (0, mysql_core_1.varchar)({ length: 300 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "sso_arole_id" }),
]);
exports.group = (0, mysql_core_1.mysqlTable)("sso_group", {
    id: (0, mysql_core_1.int)().autoincrement().notNull(),
    title: (0, mysql_core_1.varchar)({ length: 300 }).notNull(),
    description: (0, mysql_core_1.varchar)({ length: 300 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "sso_group_id" }),
]);
exports.provider = (0, mysql_core_1.mysqlTable)("sso_provider", {
    providerId: (0, mysql_core_1.int)().autoincrement().notNull(),
    userId: (0, mysql_core_1.int)().references(() => exports.user.id, { onUpdate: "cascade" }),
    accountType: (0, mysql_core_1.mysqlEnum)(['LINKEDIN', 'GOOGLE', 'CREDENTIAL', 'PIN']).notNull(),
    accountId: (0, mysql_core_1.varchar)({ length: 191 }),
    accountSecret: (0, mysql_core_1.varchar)({ length: 191 }),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.providerId], name: "sso_provider_providerId" }),
]);
exports.support = (0, mysql_core_1.mysqlTable)("sso_support", {
    supportNo: (0, mysql_core_1.int)().autoincrement().notNull(),
    fname: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    mname: (0, mysql_core_1.varchar)({ length: 350 }),
    lname: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    gender: (0, mysql_core_1.varchar)({ length: 20 }).notNull(),
    phone: (0, mysql_core_1.varchar)({ length: 20 }).notNull(),
    email: (0, mysql_core_1.varchar)({ length: 255 }),
    address: (0, mysql_core_1.varchar)({ length: 350 }),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.supportNo], name: "sso_support_supportNo" }),
]);
exports.userRole = (0, mysql_core_1.mysqlTable)("sso_urole", {
    id: (0, mysql_core_1.int)().autoincrement().notNull(),
    userId: (0, mysql_core_1.int)().notNull().references(() => exports.user.id, { onUpdate: "cascade" }),
    appRoleId: (0, mysql_core_1.int)().notNull().references(() => exports.appRole.id, { onUpdate: "cascade" }),
    roleMeta: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "sso_urole_id" }),
]);
exports.user = (0, mysql_core_1.mysqlTable)("sso_user", {
    id: (0, mysql_core_1.int)().autoincrement().notNull(),
    groupId: (0, mysql_core_1.int)().notNull().references(() => exports.group.id, { onUpdate: "cascade" }),
    tag: (0, mysql_core_1.varchar)({ length: 50 }).notNull(),
    username: (0, mysql_core_1.varchar)({ length: 50 }).notNull(),
    password: (0, mysql_core_1.varchar)({ length: 50 }).notNull(),
    unlockPin: (0, mysql_core_1.varchar)({ length: 4 }),
    locked: (0, mysql_core_1.tinyint)().default(0).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "sso_user_id" }),
    (0, mysql_core_1.unique)("sso_user_tag_key").on(table.tag),
]);
exports.title = (0, mysql_core_1.mysqlTable)("title", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    tag: (0, mysql_core_1.varchar)({ length: 50 }).notNull(),
    label: (0, mysql_core_1.varchar)({ length: 50 }).notNull(),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
}, (table) => [
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "title_id" }),
]);
exports.unit = (0, mysql_core_1.mysqlTable)("unit", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    code: (0, mysql_core_1.varchar)({ length: 50 }).notNull(),
    title: (0, mysql_core_1.varchar)({ length: 255 }).notNull(),
    type: (0, mysql_core_1.mysqlEnum)(['ACADEMIC', 'NON_ACADEMIC']).notNull(),
    levelNum: (0, mysql_core_1.int)().notNull(),
    level1Id: (0, mysql_core_1.varchar)({ length: 191 }),
    level2Id: (0, mysql_core_1.varchar)({ length: 191 }),
    location: (0, mysql_core_1.varchar)({ length: 191 }),
    headStaffNo: (0, mysql_core_1.varchar)({ length: 191 }),
    subheadStaffNo: (0, mysql_core_1.varchar)({ length: 191 }),
    status: (0, mysql_core_1.tinyint)().default(1).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    level3Id: (0, mysql_core_1.varchar)({ length: 191 }),
}, (table) => [
    (0, mysql_core_1.foreignKey)({
        columns: [table.level1Id],
        foreignColumns: [table.id],
        name: "unit_level1Id_fkey"
    }).onUpdate("cascade").onDelete("set null"),
    (0, mysql_core_1.foreignKey)({
        columns: [table.level2Id],
        foreignColumns: [table.id],
        name: "unit_level2Id_fkey"
    }).onUpdate("cascade").onDelete("set null"),
    (0, mysql_core_1.foreignKey)({
        columns: [table.level3Id],
        foreignColumns: [table.id],
        name: "unit_level3Id_fkey"
    }).onUpdate("cascade").onDelete("set null"),
    (0, mysql_core_1.primaryKey)({ columns: [table.id], name: "unit_id" }),
]);
exports.broadsheet = (0, mysql_core_1.mysqlView)("broadsheet", {
    id: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    sessionId: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    schemeId: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    courseId: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    indexno: (0, mysql_core_1.varchar)({ length: 191 }).notNull(),
    credit: (0, mysql_core_1.int)().notNull(),
    semesterNum: (0, mysql_core_1.int)().notNull(),
    classScore: (0, mysql_core_1.double)(),
    examScore: (0, mysql_core_1.double)(),
    totalScore: (0, mysql_core_1.double)(),
    type: (0, mysql_core_1.mysqlEnum)(['N', 'R']).notNull(),
    scoreA: (0, mysql_core_1.double)(),
    scoreB: (0, mysql_core_1.double)(),
    scoreC: (0, mysql_core_1.double)(),
    status: (0, mysql_core_1.tinyint)().default(0).notNull(),
    createdAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`).notNull(),
    updatedAt: (0, mysql_core_1.datetime)({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => (0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP(3))`),
    courseTitle: (0, mysql_core_1.varchar)({ length: 450 }),
    fname: (0, mysql_core_1.varchar)({ length: 255 }),
    mname: (0, mysql_core_1.varchar)({ length: 350 }),
    lname: (0, mysql_core_1.varchar)({ length: 255 }),
    program: (0, mysql_core_1.varchar)({ length: 450 }),
    curSemesterNum: (0, mysql_core_1.int)(),
    completeStatus: (0, mysql_core_1.tinyint)().default(0),
    deferStatus: (0, mysql_core_1.tinyint)().default(0),
    programId: (0, mysql_core_1.varchar)({ length: 191 }),
}).algorithm("undefined").sqlSecurity("definer").as((0, drizzle_orm_1.sql) `select \`x\`.\`id\` AS \`id\`,\`x\`.\`sessionId\` AS \`sessionId\`,\`x\`.\`schemeId\` AS \`schemeId\`,\`x\`.\`courseId\` AS \`courseId\`,\`x\`.\`indexno\` AS \`indexno\`,\`x\`.\`credit\` AS \`credit\`,\`x\`.\`semesterNum\` AS \`semesterNum\`,\`x\`.\`classScore\` AS \`classScore\`,\`x\`.\`examScore\` AS \`examScore\`,\`x\`.\`totalScore\` AS \`totalScore\`,\`x\`.\`type\` AS \`type\`,\`x\`.\`scoreA\` AS \`scoreA\`,\`x\`.\`scoreB\` AS \`scoreB\`,\`x\`.\`scoreC\` AS \`scoreC\`,\`x\`.\`status\` AS \`status\`,\`x\`.\`createdAt\` AS \`createdAt\`,\`x\`.\`updatedAt\` AS \`updatedAt\`,\`c\`.\`title\` AS \`courseTitle\`,upper(\`s\`.\`fname\`) AS \`fname\`,upper(\`s\`.\`mname\`) AS \`mname\`,upper(\`s\`.\`lname\`) AS \`lname\`,\`p\`.\`longName\` AS \`program\`,\`s\`.\`semesterNum\` AS \`curSemesterNum\`,\`s\`.\`completeStatus\` AS \`completeStatus\`,\`s\`.\`deferStatus\` AS \`deferStatus\`,\`s\`.\`programId\` AS \`programId\` from (((\`aucc\`.\`ais_assessment\` \`x\` left join \`aucc\`.\`ais_course\` \`c\` on((\`x\`.\`courseId\` = \`c\`.\`id\`))) left join \`aucc\`.\`ais_student\` \`s\` on((\`s\`.\`indexno\` = \`x\`.\`indexno\`))) left join \`aucc\`.\`ais_program\` \`p\` on((\`s\`.\`programId\` = \`p\`.\`id\`))) where \`x\`.\`indexno\` in (select \`s\`.\`indexno\` from (\`aucc\`.\`ais_student\` \`s\` left join \`aucc\`.\`ais_program\` \`p\` on((\`s\`.\`programId\` = \`p\`.\`id\`))) where (\`s\`.\`semesterNum\` = \`p\`.\`semesterTotal\`) order by \`s\`.\`programId\`,\`s\`.\`indexno\`,\`x\`.\`semesterNum\`)`);
