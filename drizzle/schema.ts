import { sql } from "drizzle-orm";
import { AnyMySqlColumn, boolean, date, datetime, double, float, foreignKey, index, int, json, longtext, mysqlEnum, mysqlTable, mysqlView, primaryKey, serial, text, timestamp, tinyint, unique, varchar } from "drizzle-orm/mysql-core";

export const appToprovider = mysqlTable("_appToprovider", {
	a: int("A").notNull().references(() => app.id, { onDelete: "cascade", onUpdate: "cascade" }),
	b: int("B").notNull().references(() => provider.providerId, { onDelete: "cascade", onUpdate: "cascade" }),
},
	(table) => [
		index("_appToprovider_B_index").on(table.b),
		unique("_appToprovider_AB_unique").on(table.a, table.b),
	]);

export const prismaMigrations = mysqlTable("_prisma_migrations", {
	id: varchar({ length: 36 }).notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: datetime("finished_at", { mode: 'string', fsp: 3 }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text(),
	rolledBackAt: datetime("rolled_back_at", { mode: 'string', fsp: 3 }),
	startedAt: datetime("started_at", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	appliedStepsCount: int("applied_steps_count", { unsigned: true }).default(0).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "_prisma_migrations_id" }),
	]);

export const activityBacklog = mysqlTable("ais_activity_backlog", {
	id: varchar({ length: 191 }).notNull(),
	sessionId: varchar({ length: 191 }).references(() => session.id, { onDelete: "set null", onUpdate: "cascade" }),
	schemeId: varchar({ length: 191 }).references(() => scheme.id, { onDelete: "set null", onUpdate: "cascade" }),
	title: varchar({ length: 191 }),
	type: mysqlEnum(['REGISTRATION', 'ASSESSMENT', 'DELETION']),
	meta: json(),
	status: tinyint().default(0).notNull(),
	approvedBy: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	createdBy: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ais_activity_backlog_id" }),
	]);

export const activityDefer = mysqlTable("ais_activity_defer", {
	id: varchar({ length: 191 }).notNull(),
	sessionId: varchar({ length: 191 }).references(() => session.id, { onDelete: "set null", onUpdate: "cascade" }),
	indexno: varchar({ length: 50 }).references(() => student.indexno, { onDelete: "set null", onUpdate: "cascade" }),
	semesterNum: int().notNull(),
	letterDate: datetime({ mode: 'string', fsp: 3 }),
	reason: varchar({ length: 255 }),
	durationInYears: int().default(1).notNull(),
	status: mysqlEnum(['PENDED', 'APPROVED', 'DECLINED', 'RESUMED']).default('PENDED').notNull(),
	statusBy: varchar({ length: 191 }),
	start: datetime({ mode: 'string', fsp: 3 }),
	end: datetime({ mode: 'string', fsp: 3 }),
	createdBy: varchar({ length: 191 }),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ais_activity_defer_id" }),
	]);

export const activityProgchange = mysqlTable("ais_activity_progchange", {
	id: varchar({ length: 191 }).notNull(),
	sessionId: varchar({ length: 191 }).references(() => session.id, { onDelete: "set null", onUpdate: "cascade" }),
	studentId: varchar({ length: 191 }).notNull().references(() => student.id, { onDelete: "restrict", onUpdate: "cascade" }),
	oldIndexno: varchar({ length: 50 }).notNull(),
	newIndexno: varchar({ length: 50 }),
	oldProgramId: varchar({ length: 191 }).notNull().references(() => program.id, { onDelete: "restrict", onUpdate: "cascade" }),
	newProgramId: varchar({ length: 191 }).references(() => program.id, { onDelete: "set null", onUpdate: "cascade" }),
	newSemesterNum: int().notNull(),
	reason: varchar({ length: 255 }),
	approved: tinyint().default(1).notNull(),
	approvedBy: varchar({ length: 191 }),
	approvedAt: datetime({ mode: 'string', fsp: 3 }),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ais_activity_progchange_id" }),
	]);

export const activityProgress = mysqlTable("ais_activity_progress", {
	id: varchar({ length: 191 }).notNull(),
	sessionId: varchar({ length: 191 }).notNull().references(() => session.id, { onDelete: "restrict", onUpdate: "cascade" }),
	indexno: varchar({ length: 50 }).notNull().references(() => student.indexno, { onDelete: "restrict", onUpdate: "cascade" }),
	semesterNum: int().notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ais_activity_progress_id" }),
	]);

export const activityRegister = mysqlTable("ais_activity_register", {
	id: varchar({ length: 191 }).notNull(),
	sessionId: varchar({ length: 191 }).references(() => session.id, { onDelete: "restrict", onUpdate: "cascade" }),
	indexno: varchar({ length: 50 }).references(() => student.indexno, { onDelete: "restrict", onUpdate: "cascade" }),
	courses: int().notNull(),
	credits: int().notNull(),
	semesterNum: int().notNull(),
	dump: json(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ais_activity_register_id" }),
	]);

export const assessment = mysqlTable("ais_assessment", {
	id: varchar({ length: 191 }).notNull(),
	sessionId: varchar({ length: 191 }).notNull().references(() => session.id, { onDelete: "restrict", onUpdate: "cascade" }),
	schemeId: varchar({ length: 191 }).notNull().references(() => scheme.id, { onDelete: "restrict", onUpdate: "cascade" }),
	courseId: varchar({ length: 191 }).notNull().references(() => course.id, { onDelete: "restrict", onUpdate: "cascade" }),
	indexno: varchar({ length: 191 }).notNull().references(() => student.indexno, { onDelete: "restrict", onUpdate: "cascade" }),
	credit: int().notNull(),
	semesterNum: int().notNull(),
	classScore: double(),
	examScore: double(),
	totalScore: double(),
	type: mysqlEnum(['N', 'R']).notNull(),
	scoreA: double(),
	scoreB: double(),
	scoreC: double(),
	status: tinyint().default(0).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		index("ais_assessment_sessionId_courseId_indexno_idx").on(table.sessionId, table.courseId, table.indexno),
		index("ais_assessment_sessionId_courseId_semesterNum_idx").on(table.sessionId, table.courseId, table.semesterNum),
		primaryKey({ columns: [table.id], name: "ais_assessment_id" }),
	]);

export const course = mysqlTable("ais_course", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 450 }).notNull(),
	creditHour: int().notNull(),
	theoryHour: int(),
	practicalHour: int(),
	remark: mysqlEnum(['FADED', 'ACTIVE']),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ais_course_id" }),
	]);

export const graduate = mysqlTable("ais_graduate", {
	id: varchar({ length: 191 }).notNull(),
	sessionId: varchar({ length: 191 }).references(() => graduateSession.id, { onDelete: "set null", onUpdate: "cascade" }),
	indexno: varchar({ length: 191 }).notNull().references(() => student.indexno, { onUpdate: "cascade" }),
	cgpa: varchar({ length: 191 }),
	certNo: varchar({ length: 191 }),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ais_graduate_id" }),
		unique("ais_graduate_indexno_key").on(table.indexno),
	]);

export const graduateSession = mysqlTable("ais_graduate_session", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 350 }).notNull(),
	description: varchar({ length: 650 }),
	start: datetime({ mode: 'string', fsp: 3 }),
	end: datetime({ mode: 'string', fsp: 3 }),
	default: tinyint().default(0).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ais_graduate_session_id" }),
	]);

export const letter = mysqlTable("ais_letter", {
	id: varchar({ length: 191 }).notNull(),
	tag: varchar({ length: 191 }),
	title: varchar({ length: 350 }).notNull(),
	signatory: text().notNull(),
	signature: longtext().notNull(),
	template: longtext().notNull(),
	cc: text(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ais_letter_id" }),
	]);

export const major = mysqlTable("ais_major", {
	id: varchar({ length: 191 }).notNull(),
	programId: varchar({ length: 191 }).references(() => program.id, { onDelete: "set null", onUpdate: "cascade" }),
	shortName: varchar({ length: 255 }),
	longName: varchar({ length: 355 }),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ais_major_id" }),
	]);

export const program = mysqlTable("ais_program", {
	id: varchar({ length: 191 }).notNull(),
	schemeId: varchar({ length: 191 }).references(() => scheme.id, { onDelete: "set null", onUpdate: "cascade" }),
	unitId: varchar({ length: 191 }).references(() => unit.id, { onDelete: "set null", onUpdate: "cascade" }),
	modeId: varchar({ length: 191 }).references(() => mode.id, { onDelete: "set null", onUpdate: "cascade" }),
	code: varchar({ length: 50 }).notNull(),
	prefix: varchar({ length: 50 }),
	stype: int(),
	shortName: varchar({ length: 255 }).notNull(),
	longName: varchar({ length: 450 }).notNull(),
	category: mysqlEnum(['CP', 'DP', 'UG', 'PG']).notNull(),
	semesterTotal: int(),
	creditTotal: int(),
	shallAdmit: tinyint().default(0).notNull(),
	hasMajor: tinyint().default(0).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ais_program_id" }),
	]);

export const resit = mysqlTable("ais_resit", {
	id: varchar({ length: 191 }).notNull(),
	sessionId: varchar({ length: 191 }).references(() => resitSession.id, { onDelete: "set null", onUpdate: "cascade" }),
	registerSessionId: varchar({ length: 191 }).references(() => session.id, { onDelete: "set null", onUpdate: "cascade" }),
	trailSessionId: varchar({ length: 191 }).notNull().references(() => session.id, { onDelete: "restrict", onUpdate: "cascade" }),
	schemeId: varchar({ length: 191 }).notNull().references(() => scheme.id, { onDelete: "restrict", onUpdate: "cascade" }),
	courseId: varchar({ length: 191 }).notNull().references(() => course.id, { onDelete: "restrict", onUpdate: "cascade" }),
	indexno: varchar({ length: 50 }).notNull().references(() => student.indexno, { onDelete: "restrict", onUpdate: "cascade" }),
	semesterNum: int().notNull(),
	totalScore: int(),
	approveScore: tinyint().default(0).notNull(),
	taken: tinyint().default(0).notNull(),
	paid: tinyint().default(0).notNull(),
	actionType: mysqlEnum(['APPEND', 'REPLACE']),
	actionMeta: json(),
	registeredAt: datetime({ mode: 'string', fsp: 3 }),
	entryAt: datetime({ mode: 'string', fsp: 3 }),
	approvedAt: datetime({ mode: 'string', fsp: 3 }),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ais_resit_id" }),
		unique("ais_resit_trailSessionId_indexno_courseId_key").on(table.trailSessionId, table.indexno, table.courseId),
	]);

export const resitSession = mysqlTable("ais_resit_session", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 350 }).notNull(),
	start: datetime({ mode: 'string', fsp: 3 }),
	end: datetime({ mode: 'string', fsp: 3 }),
	period: datetime({ mode: 'string', fsp: 3 }),
	default: tinyint().default(0).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ais_resit_session_id" }),
	]);

export const scheme = mysqlTable("ais_scheme", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	gradeMeta: json().notNull(),
	classMeta: json().notNull(),
	scoreRange: json().notNull(),
	passMark: double().notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ais_scheme_id" }),
	]);

export const session = mysqlTable("ais_session", {
	id: varchar({ length: 191 }).notNull(),
	tag: varchar({ length: 50 }).default('main'),
	title: varchar({ length: 255 }).notNull(),
	year: varchar({ length: 50 }),
	semester: mysqlEnum(['1', '2']).notNull(),
	registerStart: datetime({ mode: 'string' }),
	registerEnd: datetime({ mode: 'string' }),
	registerEndLate: datetime({ mode: 'string' }),
	registerPause: tinyint().default(0).notNull(),
	orientStart: datetime({ mode: 'string' }),
	orientEnd: datetime({ mode: 'string' }),
	lectureStart: datetime({ mode: 'string' }),
	lectureEnd: datetime({ mode: 'string' }),
	paymentEnd: datetime({ mode: 'string' }),
	matriculateStart: datetime({ mode: 'string' }),
	medicalStart: datetime({ mode: 'string' }),
	medicalEnd: datetime({ mode: 'string' }),
	examStart: datetime({ mode: 'string' }),
	examEnd: datetime({ mode: 'string' }),
	entryStart: datetime({ mode: 'string' }),
	entryEnd: datetime({ mode: 'string' }),
	admissionPrefix: varchar({ length: 191 }),
	assignLateSheet: tinyint().default(0).notNull(),
	progressStudent: tinyint().default(0).notNull(),
	stageSheet: tinyint().default(0).notNull(),
	default: tinyint().default(0).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	evaluationEnd: datetime({ mode: 'string' }),
	evaluationStart: datetime({ mode: 'string' }),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ais_session_id" }),
	]);

export const sheet = mysqlTable("ais_sheet", {
	id: varchar({ length: 191 }).notNull(),
	sessionId: varchar({ length: 191 }).notNull().references(() => session.id, { onDelete: "restrict", onUpdate: "cascade" }),
	courseId: varchar({ length: 191 }).notNull().references(() => course.id, { onDelete: "restrict", onUpdate: "cascade" }),
	unitId: varchar({ length: 191 }).references(() => unit.id, { onDelete: "set null", onUpdate: "cascade" }),
	programId: varchar({ length: 191 }).notNull().references(() => program.id, { onDelete: "restrict", onUpdate: "cascade" }),
	majorId: varchar({ length: 191 }).references(() => major.id, { onDelete: "set null", onUpdate: "cascade" }),
	assignStaffId: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	assessorId: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	certifierId: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	semesterNum: int().notNull(),
	studyMode: varchar({ length: 50 }),
	studentCount: int().default(0),
	completeRatio: double(),
	assessed: tinyint().default(0).notNull(),
	certified: tinyint().default(0).notNull(),
	finalized: tinyint().default(0).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	classTimetable: json(),
	examTimetable: json(),
},
	(table) => [
		index("ais_sheet_sessionId_programId_courseId_semesterNum_majorId_idx").on(table.sessionId, table.programId, table.courseId, table.semesterNum, table.majorId),
		primaryKey({ columns: [table.id], name: "ais_sheet_id" }),
	]);

export const structmeta = mysqlTable("ais_structmeta", {
	id: varchar({ length: 191 }).notNull(),
	programId: varchar({ length: 191 }).notNull().references(() => program.id, { onDelete: "restrict", onUpdate: "cascade" }),
	majorId: varchar({ length: 191 }).references(() => major.id, { onDelete: "set null", onUpdate: "cascade" }),
	semesterNum: int().notNull(),
	minCredit: int().notNull(),
	maxCredit: int().notNull(),
	maxElectiveNum: int(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ais_structmeta_id" }),
	]);

export const structure = mysqlTable("ais_structure", {
	id: varchar({ length: 191 }).notNull(),
	unitId: varchar({ length: 191 }).references(() => unit.id, { onDelete: "set null", onUpdate: "cascade" }),
	programId: varchar({ length: 191 }).notNull().references(() => program.id, { onDelete: "restrict", onUpdate: "cascade" }),
	majorId: varchar({ length: 191 }).references(() => major.id, { onDelete: "set null", onUpdate: "cascade" }),
	courseId: varchar({ length: 191 }).notNull().references(() => course.id, { onDelete: "restrict", onUpdate: "cascade" }),
	semesterNum: int().notNull(),
	type: mysqlEnum(['C', 'E', 'O']).notNull(),
	lock: tinyint().default(0).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ais_structure_id" }),
	]);

export const student = mysqlTable("ais_student", {
	id: varchar({ length: 191 }).notNull(),
	indexno: varchar({ length: 50 }),
	titleId: varchar({ length: 191 }).references(() => title.id, { onDelete: "set null", onUpdate: "cascade" }),
	fname: varchar({ length: 255 }),
	mname: varchar({ length: 350 }),
	lname: varchar({ length: 255 }),
	gender: varchar({ length: 20 }),
	dob: datetime({ mode: 'string', fsp: 3 }),
	maritalId: varchar({ length: 191 }).references(() => marital.id, { onDelete: "set null", onUpdate: "cascade" }),
	email: varchar({ length: 255 }),
	phone: varchar({ length: 25 }),
	hometown: varchar({ length: 255 }),
	address: varchar({ length: 350 }),
	guardianName: varchar({ length: 350 }),
	guardianPhone: varchar({ length: 15 }),
	ghcardNo: varchar({ length: 255 }),
	nationalityId: varchar({ length: 191 }).references(() => country.id, { onDelete: "set null", onUpdate: "cascade" }),
	countryId: varchar({ length: 191 }).references(() => country.id, { onDelete: "set null", onUpdate: "cascade" }),
	regionId: varchar({ length: 191 }).references(() => region.id, { onDelete: "set null", onUpdate: "cascade" }),
	religionId: varchar({ length: 191 }).references(() => religion.id, { onDelete: "set null", onUpdate: "cascade" }),
	disabilityId: varchar({ length: 191 }).references(() => disability.id, { onDelete: "set null", onUpdate: "cascade" }),
	programId: varchar({ length: 191 }).references(() => program.id, { onDelete: "set null", onUpdate: "cascade" }),
	majorId: varchar({ length: 191 }).references(() => major.id, { onDelete: "set null", onUpdate: "cascade" }),
	progCount: int(),
	semesterNum: int(),
	semesterDone: int(),
	creditDone: int(),
	entrySemesterNum: int(),
	entryGroup: mysqlEnum(['GH', 'INT']).default('GH'),
	entryDate: datetime({ mode: 'string' }),
	exitDate: datetime({ mode: 'string' }),
	residentialStatus: mysqlEnum(['RESIDENTIAL', 'NON_RESIDENTIAL']),
	studyMode: mysqlEnum(['M', 'W', 'E', 'A', 'f']),
	deferStatus: tinyint().default(0).notNull(),
	completeStatus: tinyint().default(0).notNull(),
	completeType: mysqlEnum(['GRADUATION', 'RASTICATED', 'FORFEITED', 'DEAD', 'DISMISSED']),
	graduateStatus: tinyint().default(0).notNull(),
	instituteEmail: varchar({ length: 350 }),
	instituteAffliate: varchar({ length: 350 }),
	flagPardon: tinyint().default(0).notNull(),
	accountNet: float(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ais_student_id" }),
		unique("ais_student_id_key").on(table.id),
		unique("ais_student_indexno_key").on(table.indexno),
	]);

export const transwift = mysqlTable("ais_transwift", {
	id: varchar({ length: 191 }).notNull(),
	studentId: varchar({ length: 191 }).notNull().references(() => student.id, { onDelete: "set null", onUpdate: "cascade" }),
	transactId: varchar({ length: 191 }).notNull().references(() => transaction.id, { onUpdate: "cascade" }),
	applicant: varchar({ length: 350 }),
	receipient: text(),
	quantity: int().default(0).notNull(),
	mode: mysqlEnum(['PICKUP', 'INLAND', 'FOREIGN']).default('PICKUP'),
	version: mysqlEnum(['SOFTCOPY', 'HARDCOPY']).default('SOFTCOPY'),
	status: mysqlEnum(['PENDED', 'PRINTED', 'COMPLETED']).default('PENDED').notNull(),
	issuerId: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	printedAt: datetime({ mode: 'string', fsp: 3 }),
	completedAt: datetime({ mode: 'string', fsp: 3 }),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ais_transwift_id" }),
		unique("ais_transwift_transactId_key").on(table.transactId),
	]);

export const activityApplicant = mysqlTable("ams_activity_applicant", {
	id: varchar({ length: 191 }).notNull(),
	serial: int(),
	meta: json(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_activity_applicant_id" }),
	]);

export const admission = mysqlTable("ams_admission", {
	id: varchar({ length: 191 }).notNull(),
	pgletterId: varchar({ length: 191 }).references(() => admissionLetter.id, { onDelete: "set null", onUpdate: "cascade" }),
	ugletterId: varchar({ length: 191 }).references(() => admissionLetter.id, { onDelete: "set null", onUpdate: "cascade" }),
	dpletterId: varchar({ length: 191 }).references(() => admissionLetter.id, { onDelete: "set null", onUpdate: "cascade" }),
	cpletterId: varchar({ length: 191 }).references(() => admissionLetter.id, { onDelete: "set null", onUpdate: "cascade" }),
	sessionId: varchar({ length: 191 }).references(() => session.id, { onDelete: "set null", onUpdate: "cascade" }),
	title: varchar({ length: 255 }).notNull(),
	examStart: datetime({ mode: 'string', fsp: 3 }),
	examEnd: datetime({ mode: 'string', fsp: 3 }),
	applyStart: datetime({ mode: 'string', fsp: 3 }),
	applyEnd: datetime({ mode: 'string', fsp: 3 }),
	applyPause: tinyint().default(1).notNull(),
	showAdmitted: tinyint().default(1).notNull(),
	voucherIndex: int(),
	default: tinyint().default(0).notNull(),
	status: tinyint().default(1).notNull(),
	admittedAt: datetime({ mode: 'string', fsp: 3 }),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_admission_id" }),
	]);

export const applicant = mysqlTable("ams_applicant", {
	serial: varchar({ length: 191 }).notNull(),
	admissionId: varchar({ length: 191 }).notNull().references(() => admission.id, { onDelete: "restrict", onUpdate: "cascade" }),
	stageId: varchar({ length: 191 }).notNull().references(() => stage.id, { onDelete: "restrict", onUpdate: "cascade" }),
	applyTypeId: varchar({ length: 191 }).notNull().references(() => applyType.id, { onDelete: "restrict", onUpdate: "cascade" }),
	choiceId: varchar({ length: 191 }).references(() => stepChoice.id, { onDelete: "set null", onUpdate: "cascade" }),
	profileId: varchar({ length: 191 }).references(() => stepProfile.serial, { onDelete: "set null", onUpdate: "cascade" }),
	photo: longtext(),
	meta: json(),
	gradeValue: int(),
	classValue: int(),
	sorted: tinyint().default(0).notNull(),
	submitted: tinyint().default(0).notNull(),
	submittedAt: datetime({ mode: 'string', fsp: 3 }),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.serial], name: "ams_applicant_serial" }),
	]);

export const applyType = mysqlTable("ams_applytype", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 350 }).notNull(),
	stages: json().notNull(),
	letterCondition: varchar({ length: 255 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_applytype_id" }),
	]);

export const awardClass = mysqlTable("ams_award_class", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 100 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_award_class_id" }),
	]);

export const category = mysqlTable("ams_category", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 100 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_category_id" }),
	]);

export const certCategory = mysqlTable("ams_cert_category", {
	id: varchar({ length: 191 }).notNull(),
	instituteCategoryId: varchar({ length: 191 }).references(() => instituteCategory.id, { onDelete: "set null", onUpdate: "cascade" }),
	title: varchar({ length: 100 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_cert_category_id" }),
	]);

export const documentCategory = mysqlTable("ams_document_category", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 100 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_document_category_id" }),
	]);

export const examCategory = mysqlTable("ams_exam_category", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 100 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_exam_category_id" }),
	]);

export const amsForm = mysqlTable("ams_form", {
	id: varchar({ length: 191 }).notNull(),
	categoryId: varchar({ length: 191 }).references(() => category.id, { onDelete: "set null", onUpdate: "cascade" }),
	title: varchar({ length: 255 }).notNull(),
	meta: json(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_form_id" }),
	]);

export const fresher = mysqlTable("ams_fresher", {
	serial: varchar({ length: 191 }).notNull().references(() => student.id, { onDelete: "restrict", onUpdate: "cascade" }),
	admissionId: varchar({ length: 191 }).notNull().references(() => admission.id, { onDelete: "restrict", onUpdate: "cascade" }),
	letterId: varchar({ length: 191 }).references(() => admissionLetter.id, { onDelete: "set null", onUpdate: "cascade" }),
	sessionId: varchar({ length: 191 }).notNull().references(() => session.id, { onDelete: "restrict", onUpdate: "cascade" }),
	billId: varchar({ length: 191 }).references(() => bill.id, { onDelete: "set null", onUpdate: "cascade" }),
	programId: varchar({ length: 191 }).notNull().references(() => program.id, { onDelete: "restrict", onUpdate: "cascade" }),
	majorId: varchar({ length: 191 }).references(() => major.id, { onDelete: "set null", onUpdate: "cascade" }),
	sessionMode: mysqlEnum(['M', 'W', 'E']),
	categoryId: varchar({ length: 191 }).references(() => category.id, { onDelete: "set null", onUpdate: "cascade" }),
	sellType: int(),
	semesterNum: int().notNull(),
	username: varchar({ length: 255 }),
	password: varchar({ length: 255 }),
	accept: tinyint().default(0).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.serial], name: "ams_fresher_serial" }),
	]);

export const gradeWeight = mysqlTable("ams_grade_weight", {
	id: varchar({ length: 191 }).notNull(),
	certCategoryId: varchar({ length: 191 }).references(() => certCategory.id, { onDelete: "set null", onUpdate: "cascade" }),
	title: varchar({ length: 100 }).notNull(),
	weight: tinyint(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_grade_weight_id" }),
	]);

export const instituteCategory = mysqlTable("ams_institute_category", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 100 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_institute_category_id" }),
	]);

export const admissionLetter = mysqlTable("ams_letter", {
	id: varchar({ length: 191 }).notNull(),
	categoryId: varchar({ length: 191 }).references(() => category.id, { onDelete: "set null", onUpdate: "cascade" }),
	title: varchar({ length: 350 }).notNull(),
	signatory: text().notNull(),
	signature: longtext().notNull(),
	template: longtext().notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_letter_id" }),
	]);

export const amsPrice = mysqlTable("ams_price", {
	id: varchar({ length: 191 }).notNull(),
	categoryId: varchar({ length: 191 }).references(() => category.id, { onDelete: "set null", onUpdate: "cascade" }),
	title: varchar({ length: 255 }).notNull(),
	sellType: int(),
	currency: mysqlEnum(['GHC', 'USD']).default('GHC').notNull(),
	amount: double().notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_price_id" }),
	]);

export const sorted = mysqlTable("ams_sorted", {
	serial: varchar({ length: 191 }).notNull(),
	admissionId: varchar({ length: 191 }).notNull().references(() => admission.id, { onDelete: "restrict", onUpdate: "cascade" }),
	stageId: varchar({ length: 191 }).notNull().references(() => stage.id, { onDelete: "restrict", onUpdate: "cascade" }),
	applyTypeId: varchar({ length: 191 }).notNull().references(() => applyType.id, { onDelete: "restrict", onUpdate: "cascade" }),
	categoryId: varchar({ length: 191 }).references(() => category.id, { onDelete: "set null", onUpdate: "cascade" }),
	sellType: int(),
	choice1Id: varchar({ length: 191 }).references(() => stepChoice.id, { onDelete: "set null", onUpdate: "cascade" }),
	choice2Id: varchar({ length: 191 }).references(() => stepChoice.id, { onDelete: "set null", onUpdate: "cascade" }),
	profileId: varchar({ length: 191 }).references(() => stepProfile.serial, { onDelete: "set null", onUpdate: "cascade" }),
	gradeValue: int(),
	classValue: int(),
	admitted: tinyint().default(0).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.serial], name: "ams_sorted_serial" }),
	]);

export const stage = mysqlTable("ams_stage", {
	id: varchar({ length: 191 }).notNull(),
	categoryId: varchar({ length: 191 }).references(() => category.id, { onDelete: "set null", onUpdate: "cascade" }),
	formId: varchar({ length: 191 }).notNull().references(() => amsForm.id, { onDelete: "restrict", onUpdate: "cascade" }),
	title: varchar({ length: 350 }).notNull(),
	sellType: int(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_stage_id" }),
	]);

export const stepChoice = mysqlTable("ams_step_choice", {
	id: varchar({ length: 191 }).notNull(),
	programId: varchar({ length: 191 }).references(() => program.id, { onDelete: "set null", onUpdate: "cascade" }),
	majorId: varchar({ length: 191 }).references(() => major.id, { onDelete: "set null", onUpdate: "cascade" }),
	serial: varchar({ length: 191 }).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_step_choice_id" }),
	]);

export const stepDocument = mysqlTable("ams_step_document", {
	id: varchar({ length: 191 }).notNull(),
	documentCategoryId: varchar({ length: 191 }).references(() => documentCategory.id, { onDelete: "set null", onUpdate: "cascade" }),
	serial: varchar({ length: 191 }).notNull(),
	base64: longtext(),
	mime: varchar({ length: 255 }),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_step_document_id" }),
	]);

export const stepEducation = mysqlTable("ams_step_education", {
	id: varchar({ length: 191 }).notNull(),
	serial: varchar({ length: 191 }).notNull(),
	instituteCategoryId: varchar({ length: 191 }).references(() => instituteCategory.id, { onDelete: "set null", onUpdate: "cascade" }),
	certCategoryId: varchar({ length: 191 }).references(() => certCategory.id, { onDelete: "set null", onUpdate: "cascade" }),
	instituteName: varchar({ length: 255 }).notNull(),
	certName: varchar({ length: 350 }),
	gradeValue: int(),
	classValue: int(),
	startMonth: int().notNull(),
	startYear: int().notNull(),
	endMonth: int(),
	endYear: int(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_step_education_id" }),
	]);

export const stepEmployment = mysqlTable("ams_step_employment", {
	id: varchar({ length: 191 }).notNull(),
	serial: varchar({ length: 191 }).notNull(),
	employerName: varchar({ length: 350 }).notNull(),
	employerAddress: varchar({ length: 350 }).notNull(),
	jobTitle: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 20 }).notNull(),
	email: varchar({ length: 255 }),
	address: varchar({ length: 350 }),
	startMonth: int(),
	startYear: int(),
	endMonth: int(),
	endYear: int(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_step_employment_id" }),
	]);

export const stepGrade = mysqlTable("ams_step_grade", {
	id: varchar({ length: 191 }).notNull(),
	resultId: varchar({ length: 191 }).references(() => stepResult.id, { onDelete: "set null", onUpdate: "cascade" }),
	subjectId: varchar({ length: 191 }).references(() => subject.id, { onDelete: "set null", onUpdate: "cascade" }),
	gradeWeightId: varchar({ length: 191 }).references(() => gradeWeight.id, { onDelete: "set null", onUpdate: "cascade" }),
	serial: varchar({ length: 191 }).notNull(),
	gradeValue: int().notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_step_grade_id" }),
	]);

export const stepGuardian = mysqlTable("ams_step_guardian", {
	serial: varchar({ length: 191 }).notNull(),
	relationId: varchar({ length: 191 }).notNull().references(() => relation.id, { onDelete: "restrict", onUpdate: "cascade" }),
	titleId: varchar({ length: 191 }).notNull().references(() => title.id, { onDelete: "restrict", onUpdate: "cascade" }),
	fname: varchar({ length: 255 }).notNull(),
	mname: varchar({ length: 350 }),
	lname: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 20 }).notNull(),
	email: varchar({ length: 255 }),
	address: varchar({ length: 350 }),
	occupation: varchar({ length: 350 }),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.serial], name: "ams_step_guardian_serial" }),
	]);

export const stepProfile = mysqlTable("ams_step_profile", {
	serial: varchar({ length: 191 }).notNull(),
	titleId: varchar({ length: 191 }).notNull().references(() => title.id, { onDelete: "restrict", onUpdate: "cascade" }),
	fname: varchar({ length: 255 }).notNull(),
	mname: varchar({ length: 350 }),
	lname: varchar({ length: 255 }).notNull(),
	gender: varchar({ length: 20 }).notNull(),
	dob: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	maritalId: varchar({ length: 50 }).references(() => marital.id, { onDelete: "set null", onUpdate: "cascade" }),
	disabilities: varchar({ length: 350 }),
	phone: varchar({ length: 20 }).notNull(),
	email: varchar({ length: 255 }),
	hometown: varchar({ length: 255 }),
	residentAddress: varchar({ length: 350 }),
	postalAddress: varchar({ length: 350 }),
	occupation: varchar({ length: 350 }),
	workPlace: varchar({ length: 255 }),
	bondInstitute: varchar({ length: 255 }),
	residentialStatus: mysqlEnum(['RESIDENTIAL', 'NON_RESIDENTIAL']),
	studyMode: mysqlEnum(['M', 'W', 'E', 'A', 'f']),
	nationalityId: varchar({ length: 191 }).references(() => country.id, { onDelete: "set null", onUpdate: "cascade" }),
	countryId: varchar({ length: 191 }).references(() => country.id, { onDelete: "set null", onUpdate: "cascade" }),
	regionId: varchar({ length: 191 }).references(() => region.id, { onDelete: "set null", onUpdate: "cascade" }),
	religionId: varchar({ length: 191 }).references(() => religion.id, { onDelete: "set null", onUpdate: "cascade" }),
	disabilityId: varchar({ length: 191 }).references(() => disability.id, { onDelete: "set null", onUpdate: "cascade" }),
	bonded: tinyint().default(0).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.serial], name: "ams_step_profile_serial" }),
	]);

export const stepReferee = mysqlTable("ams_step_referee", {
	id: varchar({ length: 191 }).notNull(),
	serial: varchar({ length: 191 }).notNull(),
	titleId: varchar({ length: 191 }).notNull().references(() => title.id, { onDelete: "restrict", onUpdate: "cascade" }),
	fname: varchar({ length: 255 }).notNull(),
	mname: varchar({ length: 350 }),
	lname: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 20 }).notNull(),
	email: varchar({ length: 255 }),
	address: varchar({ length: 350 }),
	occupation: varchar({ length: 350 }),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_step_referee_id" }),
	]);

export const stepResult = mysqlTable("ams_step_result", {
	id: varchar({ length: 191 }).notNull(),
	serial: varchar({ length: 191 }).notNull(),
	certCategoryId: varchar({ length: 191 }).references(() => certCategory.id, { onDelete: "set null", onUpdate: "cascade" }),
	indexNumber: varchar({ length: 255 }).notNull(),
	sitting: int(),
	startYear: int().notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_step_result_id" }),
	]);

export const subject = mysqlTable("ams_subject", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_subject_id" }),
	]);

export const vendor = mysqlTable("ams_vendor", {
	id: varchar({ length: 191 }).notNull(),
	name: varchar({ length: 191 }).notNull(),
	phone: varchar({ length: 191 }).notNull(),
	email: varchar({ length: 191 }).notNull(),
	address: varchar({ length: 191 }).notNull(),
	technicianName: varchar({ length: 191 }).notNull(),
	technicianPhone: varchar({ length: 191 }).notNull(),
	technicianEmail: varchar({ length: 191 }).notNull(),
	verified: tinyint().default(1).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "ams_vendor_id" }),
	]);

export const voucher = mysqlTable("ams_voucher", {
	serial: varchar({ length: 191 }).notNull(),
	pin: varchar({ length: 191 }).notNull(),
	admissionId: varchar({ length: 191 }).references(() => admission.id, { onDelete: "set null", onUpdate: "cascade" }),
	vendorId: varchar({ length: 191 }).references(() => vendor.id, { onDelete: "set null", onUpdate: "cascade" }),
	categoryId: varchar({ length: 191 }).references(() => category.id, { onDelete: "set null", onUpdate: "cascade" }),
	sellType: int(),
	applicantName: varchar({ length: 255 }),
	applicantPhone: varchar({ length: 50 }),
	sold: tinyint().default(0).notNull(),
	soldAt: datetime({ mode: 'string', fsp: 3 }),
	soldBy: varchar({ length: 255 }),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.serial], name: "ams_voucher_serial" }),
	]);

export const country = mysqlTable("country", {
	id: varchar({ length: 191 }).notNull(),
	code: int(),
	shortName: varchar({ length: 10 }),
	longName: varchar({ length: 255 }).notNull(),
	nationality: varchar({ length: 300 }),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "country_id" }),
	]);

export const disability = mysqlTable("disability", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "disability_id" }),
	]);

export const evaluation = mysqlTable("evaluation", {
	id: varchar({ length: 191 }).notNull(),
	courseId: varchar({ length: 191 }).notNull().references(() => course.id, { onDelete: "restrict", onUpdate: "cascade" }),
	staffNo: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	indexno: varchar({ length: 191 }).references(() => student.indexno, { onDelete: "set null", onUpdate: "cascade" }),
	sessionId: varchar({ length: 191 }).references(() => session.id, { onDelete: "set null", onUpdate: "cascade" }),
	status: varchar({ length: 50 }).notNull(),
	startedAt: datetime({ mode: 'string', fsp: 3 }),
	completedAt: datetime({ mode: 'string', fsp: 3 }),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "evaluation_id" }),
		unique("evaluation_indexno_sessionId_courseId_key").on(table.indexno, table.sessionId, table.courseId),
	]);

export const evaluationOption = mysqlTable("evaluation_option", {
	id: varchar({ length: 191 }).notNull(),
	option: varchar({ length: 100 }).notNull(),
	value: int().notNull(),
	orderNum: int().notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "evaluation_option_id" }),
	]);

export const evaluationQuestion = mysqlTable("evaluation_question", {
	id: varchar({ length: 191 }).notNull(),
	question: varchar({ length: 500 }).notNull(),
	category: varchar({ length: 100 }).notNull(),
	type: varchar({ length: 50 }).notNull(),
	orderNum: int().notNull(),
	required: tinyint().default(1).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "evaluation_question_id" }),
	]);

export const evaluationResponse = mysqlTable("evaluation_response", {
	id: varchar({ length: 191 }).notNull(),
	evaluationId: varchar({ length: 191 }).notNull().references(() => evaluation.id, { onDelete: "cascade", onUpdate: "cascade" }),
	questionId: varchar({ length: 191 }).notNull().references(() => evaluationQuestion.id, { onDelete: "restrict", onUpdate: "cascade" }),
	optionId: varchar({ length: 191 }).references(() => evaluationOption.id, { onDelete: "set null", onUpdate: "cascade" }),
	response: text(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "evaluation_response_id" }),
		unique("evaluation_response_evaluationId_questionId_key").on(table.evaluationId, table.questionId),
	]);

export const attack = mysqlTable("evs_attack", {
	id: int().autoincrement().notNull(),
	electionId: int().references(() => election.id, { onDelete: "set null", onUpdate: "cascade" }),
	tag: varchar({ length: 100 }),
	location: varchar({ length: 450 }),
	ip: varchar({ length: 50 }),
	meta: text(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "evs_attack_id" }),
	]);

export const candidate = mysqlTable("evs_candidate", {
	id: int().autoincrement().notNull(),
	portfolioId: int().references(() => portfolio.id, { onDelete: "set null", onUpdate: "cascade" }),
	tag: varchar({ length: 100 }),
	name: varchar({ length: 450 }),
	teaser: varchar({ length: 100 }),
	orderNo: int().default(1).notNull(),
	photo: varchar({ length: 450 }),
	votes: int().default(0).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "evs_candidate_id" }),
	]);

export const election = mysqlTable("evs_election", {
	id: serial("id").primaryKey(),
    groupId: int("groupId").references(() => group.id, { onDelete: "set null", onUpdate: "cascade" }),
	type: varchar("type", { length: 300 }).notNull(),
	title: varchar("title", { length: 450 }),
	tag: varchar("tag", { length: 100 }),
	logo: varchar("logo", { length: 450 }),
	admins: json("admins"),
	voterCount: int("voterCount").default(0).notNull(),
	voterList: json("voterList"),
	voterData: json("voterData"),
	allowMonitor: boolean("allowMonitor").default(false).notNull(),
	allowEcMonitor: boolean("allowEcMonitor").default(false).notNull(),
	allowVip: boolean("allowVip").default(false).notNull(),
	allowEcVip: boolean("allowEcVip").default(false).notNull(),
	allowResult: boolean("allowResult").default(false).notNull(),
	allowEcResult: boolean("allowEcResult").default(false).notNull(),
	allowMask: boolean("allowMask").default(false).notNull(),
	autoStop: boolean("autoStop").default(false).notNull(),
	startAt: datetime({ mode: 'string' }),
	endAt: datetime({ mode: 'string' }),
	action: mysqlEnum(['STAGED', 'STARTED', 'ENDED']).default('STAGED').notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
});

export const elector = mysqlTable("evs_elector", {
	id: int().autoincrement().notNull(),
	electionId: int().notNull().references(() => election.id, { onDelete: "restrict", onUpdate: "cascade" }),
	tag: varchar("tag", { length: 100 }),
	name: varchar("name", { length: 450 }),
	descriptor: varchar("descriptor", { length: 450 }),
	gender: varchar("gender", { length: 1 }),
	voteTime: timestamp("voteTime").defaultNow().notNull(),
	voteSum: varchar("voteSum", { length: 750 }),
	voteHash: varchar("voteHash", { length: 100 }),
	voteIp: varchar("voteIp", { length: 50 }),
	voteStatus: boolean("voteStatus").default(true).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "evs_elector_id" }),
	]);

export const portfolio = mysqlTable("evs_portfolio", {
	id: int().autoincrement().notNull(),
	electionId: int().notNull().references(() => election.id, { onDelete: "restrict", onUpdate: "cascade" }),
	title: text("title"),
	status: boolean("status").default(true).notNull(),
	createdAt: datetime("createdAt").default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime("updatedAt").notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "evs_portfolio_id" }),
	]);

export const activityFinanceApi = mysqlTable("fms_activity_api", {
	id: varchar({ length: 191 }).notNull(),
	ip: varchar({ length: 50 }),
	title: varchar({ length: 255 }).notNull(),
	meta: json(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "fms_activity_api_id" }),
	]);

export const activityBill = mysqlTable("fms_activity_bill", {
	id: varchar({ length: 191 }).notNull(),
	billId: varchar({ length: 191 }).references(() => bill.id, { onDelete: "set null", onUpdate: "cascade" }),
	userId: int().references(() => user.id, { onDelete: "set null", onUpdate: "cascade" }),
	amount: double(),
	discount: double(),
	receivers: json(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "fms_activity_bill_id" }),
	]);

export const activityFinanceVoucher = mysqlTable("fms_activity_voucher", {
	id: varchar({ length: 191 }).notNull(),
	transactId: varchar({ length: 191 }).references(() => transaction.id, { onDelete: "set null", onUpdate: "cascade" }),
	admissionId: varchar({ length: 191 }).references(() => admission.id, { onDelete: "set null", onUpdate: "cascade" }),
	serial: varchar({ length: 191 }),
	pin: varchar({ length: 8 }),
	buyerName: varchar({ length: 255 }).notNull(),
	buyerPhone: varchar({ length: 15 }).notNull(),
	smsCode: int(),
	generated: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "fms_activity_voucher_id" }),
	]);

export const bankacc = mysqlTable("fms_bankacc", {
	id: varchar({ length: 191 }).notNull(),
	unitId: varchar({ length: 191 }).notNull().references(() => unit.id, { onDelete: "restrict", onUpdate: "cascade" }),
	tag: varchar({ length: 255 }).notNull(),
	accountName: varchar({ length: 450 }).notNull(),
	accountDescription: varchar({ length: 450 }).notNull(),
	bankName: varchar({ length: 350 }).notNull(),
	bankAccount: varchar({ length: 30 }).notNull(),
	bankBranch: varchar({ length: 255 }).notNull(),
	bankContact: varchar({ length: 20 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "fms_bankacc_id" }),
	]);

export const bill = mysqlTable("fms_bill", {
	id: varchar({ length: 191 }).notNull(),
	sessionId: varchar({ length: 191 }).notNull().references(() => session.id, { onDelete: "restrict", onUpdate: "cascade" }),
	bankaccId: varchar({ length: 191 }).references(() => bankacc.id, { onDelete: "set null", onUpdate: "cascade" }),
	programId: varchar({ length: 191 }).references(() => program.id, { onDelete: "set null", onUpdate: "cascade" }),
	includeStudentIds: json(),
	excludeStudentIds: json(),
	mainGroupCode: varchar({ length: 4 }).notNull(),
	discountGroupCode: varchar({ length: 4 }),
	narrative: varchar({ length: 255 }).notNull(),
	type: mysqlEnum(['GH', 'INT']).default('GH').notNull(),
	residentialStatus: mysqlEnum(['RESIDENTIAL', 'NON_RESIDENTIAL']).default('RESIDENTIAL'),
	currency: mysqlEnum(['GHC', 'USD']).default('GHC').notNull(),
	amount: double().notNull(),
	discount: double(),
	quota: double(),
	posted: tinyint().default(0).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "fms_bill_id" }),
	]);

export const charge = mysqlTable("fms_charge", {
	id: varchar({ length: 191 }).notNull(),
	studentId: varchar({ length: 191 }).references(() => student.id, { onDelete: "set null", onUpdate: "cascade" }),
	title: varchar({ length: 191 }).notNull(),
	type: mysqlEnum(['FINE', 'FEES', 'GRADUATION', 'RESIT']),
	currency: mysqlEnum(['GHC', 'USD']).default('GHC').notNull(),
	amount: double().notNull(),
	posted: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "fms_charge_id" }),
	]);

export const collector = mysqlTable("fms_collector", {
	id: varchar({ length: 191 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	address: text(),
	phone: int(),
	technicianName: varchar({ length: 450 }),
	technicianPhone: int(),
	apiToken: varchar({ length: 350 }),
	apiEnabled: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "fms_collector_id" }),
	]);

export const studentAccount = mysqlTable("fms_studaccount", {
	id: varchar({ length: 191 }).notNull(),
	studentId: varchar({ length: 191 }).references(() => student.id, { onDelete: "set null", onUpdate: "cascade" }),
	transactId: varchar({ length: 191 }).references(() => transaction.id, { onDelete: "set null", onUpdate: "cascade" }),
	sessionId: varchar({ length: 191 }).references(() => session.id, { onDelete: "set null", onUpdate: "cascade" }),
	chargeId: varchar({ length: 191 }).references(() => charge.id, { onDelete: "set null", onUpdate: "cascade" }),
	billId: varchar({ length: 191 }).references(() => bill.id, { onDelete: "set null", onUpdate: "cascade" }),
	type: mysqlEnum(['CHARGE', 'BILL', 'PAYMENT']),
	narrative: varchar({ length: 255 }).notNull(),
	currency: mysqlEnum(['GHC', 'USD']).default('GHC').notNull(),
	amount: double().notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		index("fms_studaccount_billId_idx").on(table.billId),
		index("fms_studaccount_chargeId_idx").on(table.chargeId),
		index("fms_studaccount_narrative_idx").on(table.narrative),
		index("fms_studaccount_sessionId_idx").on(table.sessionId),
		index("fms_studaccount_studentId_idx").on(table.studentId),
		primaryKey({ columns: [table.id], name: "fms_studaccount_id" }),
	]);

export const transaction = mysqlTable("fms_transaction", {
	id: varchar({ length: 191 }).notNull(),
	collectorId: varchar({ length: 191 }).references(() => collector.id, { onDelete: "set null", onUpdate: "cascade" }),
	transtypeId: int().references(() => transtype.id, { onDelete: "set null", onUpdate: "cascade" }),
	bankaccId: varchar({ length: 191 }).references(() => bankacc.id, { onDelete: "set null", onUpdate: "cascade" }),
	studentId: varchar({ length: 191 }).references(() => student.id, { onDelete: "set null", onUpdate: "cascade" }),
	reference: varchar({ length: 191 }),
	transtag: varchar({ length: 191 }).notNull(),
	payType: mysqlEnum(['BANK', 'MOMO']).default('BANK'),
	feeType: mysqlEnum(['NORMAL', 'SCHOLARSHIP']).default('NORMAL'),
	currency: mysqlEnum(['GHC', 'USD']).default('GHC').notNull(),
	amount: double().notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		index("fms_transaction_reference_idx").on(table.reference),
		index("fms_transaction_studentId_idx").on(table.studentId),
		index("fms_transaction_transtag_idx").on(table.transtag),
		primaryKey({ columns: [table.id], name: "fms_transaction_id" }),
	]);

export const transtype = mysqlTable("fms_transtype", {
	id: int().autoincrement().notNull(),
	bankaccId: varchar({ length: 191 }).references(() => bankacc.id, { onDelete: "set null", onUpdate: "cascade" }),
	bankaccMeta: json(),
	title: varchar({ length: 255 }).notNull(),
	visibility: mysqlEnum(['PUBLIC', 'LOCAL']).default('PUBLIC').notNull(),
	amountInGhc: double(),
	amountInUsd: double(),
	remark: varchar({ length: 350 }),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "fms_transtype_id" }),
	]);

export const circular = mysqlTable("hrs_circular", {
	id: varchar({ length: 191 }).notNull(),
	uploadId: varchar({ length: 191 }).references(() => upload.id, { onDelete: "set null", onUpdate: "cascade" }),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_circular_id" }),
	]);

export const form = mysqlTable("hrs_form", {
	id: varchar({ length: 191 }).notNull(),
	typeId: varchar({ length: 191 }).references(() => formType.id, { onDelete: "set null", onUpdate: "cascade" }),
	title: varchar({ length: 191 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_form_id" }),
	]);

export const formType = mysqlTable("hrs_form_type", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 191 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_form_type_id" }),
	]);

export const job = mysqlTable("hrs_job", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	type: mysqlEnum(['ACADEMIC', 'NON_ACADEMIC']).notNull(),
	yearsToNextRank: int(),
	allowNextRank: tinyint().default(1).notNull(),
	staffCategory: mysqlEnum(['JS', 'SS', 'SM']),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_job_id" }),
	]);

export const leave = mysqlTable("hrs_leave", {
	id: varchar({ length: 191 }).notNull(),
	leaveCategoryId: varchar({ length: 191 }).references(() => leaveCategory.id, { onDelete: "set null", onUpdate: "cascade" }),
	staffId: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	relieverId: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	supervisorId: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	approverId: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	leaveWeight: int().default(0).notNull(),
	entitledWeight: int().default(0).notNull(),
	sosPhone: varchar({ length: 191 }),
	sosAddress: varchar({ length: 191 }),
	supervisorRemark: text(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	startDate: date({ mode: 'string' }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	endDate: date({ mode: 'string' }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	resumeDate: date({ mode: 'string' }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	approvedDate: date({ mode: 'string' }),
	flagResumed: tinyint().default(0).notNull(),
	status: mysqlEnum(['HEAD_PENDING', 'HR_PENDING', 'GRANTED', 'ENDED', 'APPROVED', 'DECLINED', 'CANCELLED']).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_leave_id" }),
	]);

export const leaveApprover = mysqlTable("hrs_leave_approver", {
	id: varchar({ length: 191 }).notNull(),
	approverId: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	identifier: mysqlEnum(['STAFF', 'UNIT', 'JOB']),
	value: varchar({ length: 191 }),
	values: json(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_leave_approver_id" }),
	]);

export const leaveBalance = mysqlTable("hrs_leave_balance", {
	id: varchar({ length: 191 }).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	flagUsed: tinyint().default(0).notNull(),
	leaveWeight: int().default(0).notNull(),
	staffId: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	status: tinyint().default(1).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	usedWeight: int().default(0).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_leave_balance_id" }),
	]);

export const leaveCategory = mysqlTable("hrs_leave_category", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 191 }),
	description: text(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_leave_category_id" }),
	]);

export const leaveConstant = mysqlTable("hrs_leave_constant", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 191 }),
	leaveWeight: int().default(0).notNull(),
	action: mysqlEnum(['ADD', 'DEDUCT']).notNull(),
	staffCategory: mysqlEnum(['JS', 'SS', 'SM']).notNull(),
	exclusionRemark: text(),
	exclusionIdentifier: mysqlEnum(['STAFF', 'UNIT', 'JOB']),
	exclusionValues: json(),
	effectiveYear: int().notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_leave_constant_id" }),
	]);

export const leaveDefer = mysqlTable("hrs_leave_defer", {
	id: varchar({ length: 191 }).notNull(),
	staffId: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	supervisorId: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	approverId: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	reason: text(),
	leaveWeight: int().default(0).notNull(),
	usedWeight: int().default(0).notNull(),
	currentYear: int().notNull(),
	effectiveYear: int().notNull(),
	status: mysqlEnum(['HEAD_PENDING', 'HR_PENDING', 'GRANTED', 'ENDED', 'APPROVED', 'DECLINED', 'CANCELLED']).default('HEAD_PENDING').notNull(),
	approvedOn: datetime({ mode: 'string', fsp: 3 }),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_leave_defer_id" }),
	]);

export const leaveExempt = mysqlTable("hrs_leave_exempt", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 191 }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	period: date({ mode: 'string' }),
	effectiveYear: int().notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_leave_exempt_id" }),
	]);

export const leaveWeight = mysqlTable("hrs_leave_weight", {
	id: varchar({ length: 191 }).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	jobIdentifiers: json(),
	leaveCategoryId: varchar({ length: 191 }).references(() => leaveCategory.id, { onDelete: "set null", onUpdate: "cascade" }),
	leaveWeight: int().default(0).notNull(),
	staffCategory: mysqlEnum(['JS', 'SS', 'SM']).notNull(),
	status: tinyint().default(1).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_leave_weight_id" }),
	]);

export const nss = mysqlTable("hrs_nss", {
	nssNo: varchar({ length: 191 }).notNull(),
	titleId: varchar({ length: 191 }).references(() => title.id, { onDelete: "set null", onUpdate: "cascade" }),
	fname: varchar({ length: 255 }).notNull(),
	mname: varchar({ length: 350 }),
	lname: varchar({ length: 255 }).notNull(),
	gender: varchar({ length: 20 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dob: date({ mode: 'string' }),
	maritalId: varchar({ length: 191 }).references(() => marital.id, { onDelete: "set null", onUpdate: "cascade" }),
	disabilities: varchar({ length: 350 }),
	phone: varchar({ length: 20 }),
	email: varchar({ length: 255 }),
	hometown: varchar({ length: 255 }),
	birthplace: varchar({ length: 255 }),
	district: varchar({ length: 255 }),
	ssnitNo: varchar({ length: 255 }),
	ghcardNo: varchar({ length: 255 }),
	residentAddress: varchar({ length: 350 }),
	ssoPhone: varchar({ length: 15 }),
	ssoAddress: varchar({ length: 350 }),
	qualification: varchar({ length: 650 }),
	countryId: varchar({ length: 191 }).references(() => country.id, { onDelete: "set null", onUpdate: "cascade" }),
	regionId: varchar({ length: 191 }).references(() => region.id, { onDelete: "set null", onUpdate: "cascade" }),
	religionId: varchar({ length: 191 }).references(() => religion.id, { onDelete: "set null", onUpdate: "cascade" }),
	unitId: varchar({ length: 191 }).references(() => unit.id, { onDelete: "set null", onUpdate: "cascade" }),
	nssStatus: mysqlEnum(['ACTIVE', 'RELEASED', 'COMPLETED']).default('ACTIVE').notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.nssNo], name: "hrs_nss_nssNo" }),
		unique("hrs_nss_email_key").on(table.email),
		unique("hrs_nss_ghcardNo_key").on(table.ghcardNo),
		unique("hrs_nss_nssNo_key").on(table.nssNo),
		unique("hrs_nss_phone_key").on(table.phone),
		unique("hrs_nss_ssnitNo_key").on(table.ssnitNo),
	]);

export const option = mysqlTable("hrs_option", {
	id: varchar({ length: 191 }).notNull(),
	questionId: varchar({ length: 191 }).references(() => question.id, { onDelete: "set null", onUpdate: "cascade" }),
	atttachId: varchar({ length: 191 }).references(() => upload.id, { onDelete: "set null", onUpdate: "cascade" }),
	title: text(),
	tag: varchar({ length: 350 }),
	orderNum: int(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_option_id" }),
	]);

export const paper = mysqlTable("hrs_paper", {
	id: varchar({ length: 191 }).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_paper_id" }),
	]);

export const position = mysqlTable("hrs_position", {
	id: varchar({ length: 191 }).notNull(),
	staffNo: varchar({ length: 191 }).references((): AnyMySqlColumn => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	scaleId: varchar({ length: 191 }).references(() => scale.id, { onDelete: "set null", onUpdate: "cascade" }),
	staffCategory: mysqlEnum(['JS', 'SS', 'SM']).notNull(),
	letterAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	startAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	endAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	duration: int(),
	type: mysqlEnum(['APPOINTMENT', 'RENEWAL']).default('APPOINTMENT').notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	positionInfoId: varchar({ length: 191 }).references(() => positionInfo.id, { onDelete: "set null", onUpdate: "cascade" }),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_position_id" }),
	]);

export const positionInfo = mysqlTable("hrs_position_info", {
	id: varchar({ length: 191 }).notNull(),
	unitId: varchar({ length: 191 }).references(() => unit.id, { onDelete: "set null", onUpdate: "cascade" }),
	title: varchar({ length: 255 }).notNull(),
	description: text(),
	duties: text(),
	allowances: json(),
	durationInYears: int(),
	renewalInYears: int(),
	staffCategory: mysqlEnum(['JS', 'SS', 'SM']).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_position_info_id" }),
	]);

export const promotion = mysqlTable("hrs_promotion", {
	id: varchar({ length: 191 }).notNull(),
	staffNo: varchar({ length: 191 }).references((): AnyMySqlColumn => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	jobId: varchar({ length: 191 }).references(() => job.id, { onDelete: "set null", onUpdate: "cascade" }),
	scaleId: varchar({ length: 191 }).references(() => scale.id, { onDelete: "set null", onUpdate: "cascade" }),
	staffCategory: mysqlEnum(['JS', 'SS', 'SM']).notNull(),
	probation: int(),
	type: mysqlEnum(['APPOINTMENT', 'PROMOTION', 'UPGRADE']).default('APPOINTMENT').notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	assumeDate: date({ mode: 'string' }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	confirmDate: date({ mode: 'string' }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	letterDate: date({ mode: 'string' }),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	effectiveDate: date({ mode: 'string' }),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_promotion_id" }),
	]);

export const qualification = mysqlTable("hrs_qualification", {
	id: varchar({ length: 191 }).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_qualification_id" }),
	]);

export const question = mysqlTable("hrs_question", {
	id: varchar({ length: 191 }).notNull(),
	formId: varchar({ length: 191 }).references(() => form.id, { onDelete: "set null", onUpdate: "cascade" }),
	sectionId: varchar({ length: 191 }).references(() => section.id, { onDelete: "set null", onUpdate: "cascade" }),
	code: varchar({ length: 191 }),
	title: text(),
	orderNum: int(),
	preview: varchar({ length: 191 }),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_question_id" }),
	]);

export const relative = mysqlTable("hrs_relative", {
	id: varchar({ length: 191 }).notNull(),
	relationId: varchar({ length: 191 }).notNull().references(() => relation.id, { onDelete: "set null", onUpdate: "cascade" }),
	titleId: varchar({ length: 191 }).references(() => title.id, { onDelete: "set null", onUpdate: "cascade" }),
	code: varchar({ length: 191 }).notNull(),
	fname: varchar({ length: 255 }).notNull(),
	mname: varchar({ length: 350 }),
	lname: varchar({ length: 255 }).notNull(),
	gender: varchar({ length: 20 }).notNull(),
	dob: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	phone: varchar({ length: 20 }).notNull(),
	address: varchar({ length: 350 }),
	hometown: varchar({ length: 255 }),
	isKin: tinyint().default(1).notNull(),
	isAlive: tinyint().default(1).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	staffId: varchar({ length: 191 }).notNull().references(() => staff.staffNo, { onDelete: "restrict", onUpdate: "cascade" }),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_relative_id" }),
	]);

export const respondent = mysqlTable("hrs_respondent", {
	id: varchar({ length: 191 }).notNull(),
	formId: varchar({ length: 191 }),
	staffId: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	supervisorId: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	tag: varchar({ length: 191 }),
	responseMeta: json(),
	status: mysqlEnum(['HEAD_PENDING', 'HEAD_REQUIRES_UPDATE', 'DEAN_PENDING', 'DEAN_REQUIRES_UPDATE', 'PROVOST_PENDING', 'PROVOST_REQUIRES_UPDATE', 'AMP_FORWARDED', 'AMP_APPROVED', 'GRANTED', 'DECLINED', 'CANCELLED']).default('HEAD_PENDING'),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	nssId: varchar({ length: 191 }),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_respondent_id" }),
	]);

export const response = mysqlTable("hrs_response", {
	id: varchar({ length: 191 }).notNull(),
	questionId: varchar({ length: 191 }).references(() => question.id, { onDelete: "set null", onUpdate: "cascade" }),
	content: text(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	attachId: varchar({ length: 191 }).references(() => upload.id, { onDelete: "set null", onUpdate: "cascade" }),
	respondentId: varchar({ length: 191 }).references(() => respondent.id, { onDelete: "set null", onUpdate: "cascade" }),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_response_id" }),
	]);

export const scale = mysqlTable("hrs_scale", {
	id: varchar({ length: 191 }).notNull(),
	grade: varchar({ length: 350 }),
	gradeNum: int(),
	notch: int(),
	notchAmount: double(),
	level: mysqlEnum(['L', 'H', 'AH']).notNull(),
	staffCategory: mysqlEnum(['JS', 'SS', 'SM']).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_scale_id" }),
	]);

export const section = mysqlTable("hrs_section", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 191 }).notNull(),
	type: varchar({ length: 191 }),
	formType: varchar({ length: 191 }),
	path: varchar({ length: 191 }),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_section_id" }),
	]);

export const specialization = mysqlTable("hrs_specialization", {
	id: varchar({ length: 191 }).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_specialization_id" }),
	]);

export const staff = mysqlTable("hrs_staff", {
	staffNo: varchar({ length: 191 }).notNull(),
	titleId: varchar({ length: 191 }).references(() => title.id, { onDelete: "set null", onUpdate: "cascade" }),
	fname: varchar({ length: 255 }).notNull(),
	mname: varchar({ length: 350 }),
	lname: varchar({ length: 255 }).notNull(),
	gender: varchar({ length: 20 }).notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	dob: date({ mode: 'string' }),
	maritalId: varchar({ length: 191 }).references(() => marital.id, { onDelete: "set null", onUpdate: "cascade" }),
	disabilities: varchar({ length: 350 }),
	phone: varchar({ length: 20 }),
	email: varchar({ length: 255 }),
	hometown: varchar({ length: 255 }),
	birthplace: varchar({ length: 255 }),
	district: varchar({ length: 255 }),
	ssnitNo: varchar({ length: 255 }),
	ghcardNo: varchar({ length: 255 }),
	residentAddress: varchar({ length: 350 }),
	occupation: varchar({ length: 350 }),
	qualification: varchar({ length: 650 }),
	instituteEmail: varchar({ length: 350 }),
	countryId: varchar({ length: 191 }).references(() => country.id, { onDelete: "set null", onUpdate: "cascade" }),
	regionId: varchar({ length: 191 }).references(() => region.id, { onDelete: "set null", onUpdate: "cascade" }),
	religionId: varchar({ length: 191 }).references(() => religion.id, { onDelete: "set null", onUpdate: "cascade" }),
	unitId: varchar({ length: 191 }).references(() => unit.id, { onDelete: "set null", onUpdate: "cascade" }),
	jobId: varchar({ length: 191 }).references(() => job.id, { onDelete: "set null", onUpdate: "cascade" }),
	jobMode: varchar({ length: 350 }),
	promotionId: varchar({ length: 191 }).references((): AnyMySqlColumn => promotion.id, { onDelete: "set null", onUpdate: "cascade" }),
	positionId: varchar({ length: 191 }).references((): AnyMySqlColumn => position.id, { onDelete: "set null", onUpdate: "cascade" }),
	status: tinyint().default(1).notNull(),
	staffStatus: mysqlEnum(['TEMPORAL', 'PERMANENT', 'DEAD', 'RETIRED', 'ABSENCE', 'EXITED']).default('PERMANENT').notNull(),
	// you can use { mode: 'date' }, if you want to have Date as type for this column
	exitDate: date({ mode: 'string' }),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	exitRemark: text(),
	firstOfferId: varchar({ length: 191 }).references((): AnyMySqlColumn => promotion.id, { onDelete: "set null", onUpdate: "cascade" }),
	ssoAddress: varchar({ length: 350 }),
	ssoPhone: varchar({ length: 15 }),
},
	(table) => [
		primaryKey({ columns: [table.staffNo], name: "hrs_staff_staffNo" }),
		unique("hrs_staff_email_key").on(table.email),
		unique("hrs_staff_ghcardNo_key").on(table.ghcardNo),
		unique("hrs_staff_phone_key").on(table.phone),
		unique("hrs_staff_ssnitNo_key").on(table.ssnitNo),
		unique("hrs_staff_staffNo_key").on(table.staffNo),
	]);

export const transfer = mysqlTable("hrs_transfer", {
	id: varchar({ length: 191 }).notNull(),
	fromUnitId: varchar({ length: 191 }).references(() => unit.id, { onDelete: "set null", onUpdate: "cascade" }),
	toUnitId: varchar({ length: 191 }).references(() => unit.id, { onDelete: "set null", onUpdate: "cascade" }),
	reason: varchar({ length: 350 }),
	status: mysqlEnum(['HEAD_PENDING', 'HR_PENDING', 'GRANTED', 'ENDED', 'APPROVED', 'DECLINED', 'CANCELLED']).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	letterDate: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	applyType: mysqlEnum(['DHR', 'SELF']).notNull(),
	approvedOn: datetime({ mode: 'string', fsp: 3 }),
	approverId: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	creatorId: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
	effectiveDate: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	staffId: varchar({ length: 191 }).references(() => staff.staffNo, { onDelete: "set null", onUpdate: "cascade" }),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_transfer_id" }),
	]);

export const upload = mysqlTable("hrs_upload", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 191 }).notNull(),
	uploadType: varchar({ length: 191 }),
	path: varchar({ length: 191 }),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	mime: varchar({ length: 191 }),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "hrs_upload_id" }),
	]);

export const informer = mysqlTable("informer", {
	id: varchar({ length: 191 }).notNull(),
	reference: varchar({ length: 191 }),
	title: varchar({ length: 350 }).notNull(),
	content: text(),
	smsContent: text(),
	receiver: mysqlEnum(['APPLICANT', 'FRESHER', 'FINAL', 'STUDENT', 'UNDERGRAD', 'POSTGRAD', 'ALUMNI', 'STAFF', 'HOD', 'DEAN', 'ASSESSOR', 'DEBTOR']).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "informer_id" }),
	]);

export const log = mysqlTable("log", {
	id: varchar({ length: 191 }).notNull(),
	action: varchar({ length: 255 }).notNull(),
	user: varchar({ length: 255 }),
	student: varchar({ length: 255 }),
	meta: json().notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "log_id" }),
	]);

export const marital = mysqlTable("marital", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "marital_id" }),
	]);

export const mode = mysqlTable("mode", {
	id: varchar({ length: 191 }).notNull(),
	code: varchar({ length: 50 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "mode_id" }),
	]);

export const region = mysqlTable("region", {
	id: varchar({ length: 191 }).notNull(),
	tag: varchar({ length: 50 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "region_id" }),
	]);

export const relation = mysqlTable("relation", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "relation_id" }),
	]);

export const religion = mysqlTable("religion", {
	id: varchar({ length: 191 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "religion_id" }),
	]);

export const app = mysqlTable("sso_app", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 300 }).notNull(),
	tag: varchar({ length: 50 }).notNull(),
	description: varchar({ length: 300 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "sso_app_id" }),
	]);

export const appRole = mysqlTable("sso_arole", {
	id: int().autoincrement().notNull(),
	appId: int().notNull().references(() => app.id, { onDelete: "restrict", onUpdate: "cascade" }),
	title: varchar({ length: 300 }).notNull(),
	description: varchar({ length: 300 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "sso_arole_id" }),
	]);

export const group = mysqlTable("sso_group", {
	id: int().autoincrement().notNull(),
	title: varchar({ length: 300 }).notNull(),
	description: varchar({ length: 300 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "sso_group_id" }),
	]);

export const provider = mysqlTable("sso_provider", {
	providerId: int().autoincrement().notNull(),
	userId: int().references(() => user.id, { onUpdate: "cascade" }),
	accountType: mysqlEnum(['LINKEDIN', 'GOOGLE', 'CREDENTIAL', 'PIN']).notNull(),
	accountId: varchar({ length: 191 }),
	accountSecret: varchar({ length: 191 }),
	status: tinyint().default(1).notNull(),
},
	(table) => [
		primaryKey({ columns: [table.providerId], name: "sso_provider_providerId" }),
	]);

export const support = mysqlTable("sso_support", {
	supportNo: int().autoincrement().notNull(),
	fname: varchar({ length: 255 }).notNull(),
	mname: varchar({ length: 350 }),
	lname: varchar({ length: 255 }).notNull(),
	gender: varchar({ length: 20 }).notNull(),
	phone: varchar({ length: 20 }).notNull(),
	email: varchar({ length: 255 }),
	address: varchar({ length: 350 }),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.supportNo], name: "sso_support_supportNo" }),
	]);

export const userRole = mysqlTable("sso_urole", {
	id: int().autoincrement().notNull(),
	userId: int().notNull().references(() => user.id, { onUpdate: "cascade" }),
	appRoleId: int().notNull().references(() => appRole.id, { onUpdate: "cascade" }),
	roleMeta: varchar({ length: 255 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "sso_urole_id" }),
	]);

export const user = mysqlTable("sso_user", {
	id: int().autoincrement().notNull(),
	groupId: int().notNull().references(() => group.id, { onUpdate: "cascade" }),
	tag: varchar({ length: 50 }).notNull(),
	username: varchar({ length: 50 }).notNull(),
	password: varchar({ length: 50 }).notNull(),
	unlockPin: varchar({ length: 4 }),
	locked: tinyint().default(0).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "sso_user_id" }),
		unique("sso_user_tag_key").on(table.tag),
	]);

export const title = mysqlTable("title", {
	id: varchar({ length: 191 }).notNull(),
	tag: varchar({ length: 50 }).notNull(),
	label: varchar({ length: 50 }).notNull(),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
},
	(table) => [
		primaryKey({ columns: [table.id], name: "title_id" }),
	]);

export const unit = mysqlTable("unit", {
	id: varchar({ length: 191 }).notNull(),
	code: varchar({ length: 50 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	type: mysqlEnum(['ACADEMIC', 'NON_ACADEMIC']).notNull(),
	levelNum: int().notNull(),
	level1Id: varchar({ length: 191 }),
	level2Id: varchar({ length: 191 }),
	location: varchar({ length: 191 }),
	headStaffNo: varchar({ length: 191 }),
	subheadStaffNo: varchar({ length: 191 }),
	status: tinyint().default(1).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	level3Id: varchar({ length: 191 }),
},
	(table) => [
		foreignKey({
			columns: [table.level1Id],
			foreignColumns: [table.id],
			name: "unit_level1Id_fkey"
		}).onUpdate("cascade").onDelete("set null"),
		foreignKey({
			columns: [table.level2Id],
			foreignColumns: [table.id],
			name: "unit_level2Id_fkey"
		}).onUpdate("cascade").onDelete("set null"),
		foreignKey({
			columns: [table.level3Id],
			foreignColumns: [table.id],
			name: "unit_level3Id_fkey"
		}).onUpdate("cascade").onDelete("set null"),
		primaryKey({ columns: [table.id], name: "unit_id" }),
	]);
export const broadsheet = mysqlView("broadsheet", {
	id: varchar({ length: 191 }).notNull(),
	sessionId: varchar({ length: 191 }).notNull(),
	schemeId: varchar({ length: 191 }).notNull(),
	courseId: varchar({ length: 191 }).notNull(),
	indexno: varchar({ length: 191 }).notNull(),
	credit: int().notNull(),
	semesterNum: int().notNull(),
	classScore: double(),
	examScore: double(),
	totalScore: double(),
	type: mysqlEnum(['N', 'R']).notNull(),
	scoreA: double(),
	scoreB: double(),
	scoreC: double(),
	status: tinyint().default(0).notNull(),
	createdAt: datetime({ mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	updatedAt: datetime({ mode: 'string', fsp: 3 }).notNull().$onUpdate(() => sql`(CURRENT_TIMESTAMP(3))`),
	courseTitle: varchar({ length: 450 }),
	fname: varchar({ length: 255 }),
	mname: varchar({ length: 350 }),
	lname: varchar({ length: 255 }),
	program: varchar({ length: 450 }),
	curSemesterNum: int(),
	completeStatus: tinyint().default(0),
	deferStatus: tinyint().default(0),
	programId: varchar({ length: 191 }),
}).algorithm("undefined").sqlSecurity("definer").as(sql`select \`x\`.\`id\` AS \`id\`,\`x\`.\`sessionId\` AS \`sessionId\`,\`x\`.\`schemeId\` AS \`schemeId\`,\`x\`.\`courseId\` AS \`courseId\`,\`x\`.\`indexno\` AS \`indexno\`,\`x\`.\`credit\` AS \`credit\`,\`x\`.\`semesterNum\` AS \`semesterNum\`,\`x\`.\`classScore\` AS \`classScore\`,\`x\`.\`examScore\` AS \`examScore\`,\`x\`.\`totalScore\` AS \`totalScore\`,\`x\`.\`type\` AS \`type\`,\`x\`.\`scoreA\` AS \`scoreA\`,\`x\`.\`scoreB\` AS \`scoreB\`,\`x\`.\`scoreC\` AS \`scoreC\`,\`x\`.\`status\` AS \`status\`,\`x\`.\`createdAt\` AS \`createdAt\`,\`x\`.\`updatedAt\` AS \`updatedAt\`,\`c\`.\`title\` AS \`courseTitle\`,upper(\`s\`.\`fname\`) AS \`fname\`,upper(\`s\`.\`mname\`) AS \`mname\`,upper(\`s\`.\`lname\`) AS \`lname\`,\`p\`.\`longName\` AS \`program\`,\`s\`.\`semesterNum\` AS \`curSemesterNum\`,\`s\`.\`completeStatus\` AS \`completeStatus\`,\`s\`.\`deferStatus\` AS \`deferStatus\`,\`s\`.\`programId\` AS \`programId\` from (((\`aucc\`.\`ais_assessment\` \`x\` left join \`aucc\`.\`ais_course\` \`c\` on((\`x\`.\`courseId\` = \`c\`.\`id\`))) left join \`aucc\`.\`ais_student\` \`s\` on((\`s\`.\`indexno\` = \`x\`.\`indexno\`))) left join \`aucc\`.\`ais_program\` \`p\` on((\`s\`.\`programId\` = \`p\`.\`id\`))) where \`x\`.\`indexno\` in (select \`s\`.\`indexno\` from (\`aucc\`.\`ais_student\` \`s\` left join \`aucc\`.\`ais_program\` \`p\` on((\`s\`.\`programId\` = \`p\`.\`id\`))) where (\`s\`.\`semesterNum\` = \`p\`.\`semesterTotal\`) order by \`s\`.\`programId\`,\`s\`.\`indexno\`,\`x\`.\`semesterNum\`)`);