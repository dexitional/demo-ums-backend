"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysqlAdapter_1 = require("../drizzle/mysqlAdapter");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../drizzle/schema"); // Update paths to your schema
const redis_1 = require("../config/redis");
const helper_1 = require("../util/helper");
const paramStr_1 = require("../util/paramStr");
const moment_1 = __importDefault(require("moment"));
const sha1 = require('sha1');
const { customAlphabet } = require("nanoid");
const pwdgen = customAlphabet("1234567890abcdefghijklmnopqrstuvwzyx", 6);
const sms = require('../config/sms');
const ExcelJS = require('exceljs');
const CACHE_TTL = 3600; // 1 hour
class AisController {
    // Helper to handle Redis caching
    getOrSetCache(key, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedData = yield redis_1.redisClient.get(key);
            if (cachedData)
                return JSON.parse(cachedData);
            const freshData = yield cb();
            if (freshData) {
                yield redis_1.redisClient.setEx(key, CACHE_TTL, JSON.stringify(freshData));
            }
            return freshData;
        });
    }
    fetchTest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tag = '24010001';
                const cacheKey = `test_election_${tag}`;
                const resp = yield this.getOrSetCache(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    // Using JSON_CONTAINS for MySQL JSON array search
                    return yield mysqlAdapter_1.db.select().from(schema_1.election).where((0, drizzle_orm_1.sql) `JSON_CONTAINS(voterData, JSON_OBJECT('tag', ${tag}), '$')`);
                }));
                if (resp === null || resp === void 0 ? void 0 : resp.length) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    loadReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { type, program: pId, major: mId, year, mode } = req.body;
                const cacheKey = `report:${type}:${JSON.stringify(req.body)}`;
                const result = yield this.getOrSetCache(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    let data = [];
                    if (type === 'student_registration') {
                        const yearFilters = year ? [Number(year) * 2, (Number(year) * 2) - 1] : null;
                        const regs = yield mysqlAdapter_1.db.query.activityRegister.findMany({
                            where: (table, { and, eq, inArray }) => and(
                            // join logic handled by findMany with relations
                            (0, drizzle_orm_1.sql) `${table.sessionId} IN (SELECT id FROM session WHERE \`default\` = true)`, pId ? eq((0, drizzle_orm_1.sql) `student.programId`, pId) : undefined, yearFilters ? inArray(table.semesterNum, yearFilters) : undefined),
                            with: {
                                student: { with: { program: true, major: true } },
                                session: true
                            },
                            orderBy: [(0, drizzle_orm_1.asc)(schema_1.activityRegister.createdAt)]
                        });
                        data = regs.map(r => {
                            var _a, _b, _c, _d, _e, _f, _g;
                            return ({
                                'LAST NAME': (_b = (_a = r.student) === null || _a === void 0 ? void 0 : _a.lname) === null || _b === void 0 ? void 0 : _b.toUpperCase(),
                                'FIRST NAME': (_d = (_c = r.student) === null || _c === void 0 ? void 0 : _c.fname) === null || _d === void 0 ? void 0 : _d.toUpperCase(),
                                'INDEX NUMBER': (_e = r.student) === null || _e === void 0 ? void 0 : _e.indexno,
                                'YEAR': Math.ceil(r.semesterNum / 2),
                                'PROGRAM': (_g = (_f = r.student) === null || _f === void 0 ? void 0 : _f.program) === null || _g === void 0 ? void 0 : _g.shortName,
                                'REGISTRATION DATE': r.createdAt
                            });
                        });
                    }
                    if (type === 'student_debtor') {
                        const regs = yield mysqlAdapter_1.db.query.student.findMany({
                            where: (table, { and, eq, gt, inArray }) => and(gt(table.accountNet, 0), pId ? eq(table.programId, pId) : undefined, mId ? eq(table.majorId, mId) : undefined, year ? inArray(table.semesterNum, [Number(year) * 2, (Number(year) * 2) - 1]) : undefined),
                            with: { program: true, major: true },
                            orderBy: [(0, drizzle_orm_1.asc)(schema_1.student.lname)]
                        });
                        data = regs.map(r => {
                            var _a, _b;
                            return ({
                                'LAST NAME': (_a = r.lname) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
                                'INDEX NUMBER': r.indexno,
                                'STUDENT ACCOUNT NET': r.accountNet,
                                'PROGRAM': (_b = r.program) === null || _b === void 0 ? void 0 : _b.shortName
                            });
                        });
                    }
                    if (type === 'exam_eligible') {
                        const yearFilters = year ? [Number(year) * 2, (Number(year) * 2) - 1] : null;
                        const regs = yield mysqlAdapter_1.db.query.student.findMany({
                            where: (table, { and, or, eq, inArray, lte }) => and(or(lte(table.accountNet, 0), eq(table.flagPardon, 1)), eq(table.completeStatus, 1), pId ? eq(table.programId, pId) : undefined, mId ? eq(table.majorId, mId) : undefined, mode ? eq(table.studyMode, mode) : undefined, yearFilters ? inArray(table.semesterNum, yearFilters) : undefined),
                            with: { program: true, major: true },
                            orderBy: [(0, drizzle_orm_1.desc)(schema_1.student.programId), (0, drizzle_orm_1.asc)(schema_1.student.lname)]
                        });
                        data = regs.map((r) => {
                            var _a, _b;
                            return ({
                                'LAST NAME': (_a = r.lname) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
                                'INDEX NUMBER': r.indexno,
                                'YEAR': Math.ceil(r.semesterNum / 2),
                                'PROGRAM': (_b = r.program) === null || _b === void 0 ? void 0 : _b.shortName,
                                'STATUS': r.deferStatus === 1 ? 'DEFERRED' : 'ACTIVE',
                            });
                        });
                    }
                    else if (type === 'resit') {
                        const regs = yield mysqlAdapter_1.db.query.resit.findMany({
                            where: (table, { or, sql }) => or(sql `${table.sessionId} IN (SELECT id FROM session WHERE \`default\` = true)`, sql `${table.trailSessionId} IN (SELECT id FROM session WHERE \`default\` = true)`),
                            with: {
                                course: true,
                                student: { with: { program: true, major: true } }
                            },
                            orderBy: [(0, drizzle_orm_1.asc)((0, drizzle_orm_1.sql) `student.lname`)]
                        });
                        data = regs.map(r => {
                            var _a, _b, _c, _d, _e;
                            return ({
                                'LAST NAME': (_b = (_a = r.student) === null || _a === void 0 ? void 0 : _a.lname) === null || _b === void 0 ? void 0 : _b.toUpperCase(),
                                'INDEX NUMBER': (_c = r.student) === null || _c === void 0 ? void 0 : _c.indexno,
                                'COURSE': `${(_d = r.course) === null || _d === void 0 ? void 0 : _d.title} - ${(_e = r.course) === null || _e === void 0 ? void 0 : _e.id}`,
                                'PAYMENT STATUS': r.paid ? 'YES' : 'NO',
                            });
                        });
                    }
                    else if (type === 'staff') {
                        const regs = yield mysqlAdapter_1.db.query.staff.findMany({
                            where: (table, { eq, sql }) => schema_1.category
                                ? sql `${table.unitId} IN (SELECT id FROM unit WHERE type = ${schema_1.category})`
                                : undefined,
                            with: { job: true, unit: true },
                            orderBy: [(0, drizzle_orm_1.asc)(schema_1.staff.staffNo)]
                        });
                        data = regs.map(r => {
                            var _a, _b, _c, _d, _e;
                            return ({
                                'LAST NAME': (_a = r.lname) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
                                'STAFF NUMBER': r.staffNo,
                                'UNIT': (_c = (_b = r.unit) === null || _b === void 0 ? void 0 : _b.title) === null || _c === void 0 ? void 0 : _c.toUpperCase(),
                                'DESIGNATION': (_e = (_d = r.job) === null || _d === void 0 ? void 0 : _d.title) === null || _e === void 0 ? void 0 : _e.toUpperCase(),
                            });
                        });
                    }
                    return { type, data };
                }));
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    /* Dashboard & Statistics with Redis */
    loadDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cacheKey = "dashboard_stats";
                const stats = yield this.getOrSetCache(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    // 1. Get Default Sessions
                    const activeSessions = yield mysqlAdapter_1.db.query.session.findMany({
                        where: (0, drizzle_orm_1.eq)(schema_1.session.default, 1)
                    });
                    // 2. Academic Session Statistics
                    const academic = yield Promise.all(activeSessions.map((s) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        // Registered Count
                        const regCount = yield mysqlAdapter_1.db.select({ count: (0, drizzle_orm_1.sql) `count(*)` })
                            .from(schema_1.activityRegister)
                            .where((0, drizzle_orm_1.eq)(schema_1.activityRegister.sessionId, s.id));
                        // Unregistered - Direct SQL for complex date/subquery logic
                        const unregQuery = s.tag === 'MAIN'
                            ? (0, drizzle_orm_1.sql) `SELECT count(id) as count FROM ais_student WHERE (DATE_FORMAT(entryDate,'%m') = '09' OR (DATE_FORMAT(entryDate,'%m') = '01' AND ((entrySemesterNum = 1 AND semesterNum > 2) OR (entrySemesterNum = 3 AND semesterNum > 4)))) AND completeStatus = 0 AND deferStatus = 0 AND indexno NOT IN (SELECT indexno FROM ais_activity_register WHERE sessionId = ${s.id})`
                            : (0, drizzle_orm_1.sql) `SELECT count(id) as count FROM ais_student WHERE DATE_FORMAT(entryDate,'%m') = '01' AND ((entrySemesterNum = 1 AND semesterNum < 3) OR (entrySemesterNum = 3 AND semesterNum < 5)) AND completeStatus = 0 AND deferStatus = 0 AND indexno NOT IN (SELECT indexno FROM ais_activity_register WHERE sessionId = ${s.id})`;
                        const unregCount = yield mysqlAdapter_1.db.execute(unregQuery);
                        return {
                            label: `${s.title} - ${s.tag}`,
                            register: regCount[0].count,
                            unregister: ((_a = unregCount[0][0]) === null || _a === void 0 ? void 0 : _a.count) || 0
                        };
                    })));
                    // 3. Resit Statistics
                    const resitStats = yield mysqlAdapter_1.db.select({
                        reg_resit: (0, drizzle_orm_1.sql) `count(CASE WHEN registeredAt IS NOT NULL AND taken = 0 THEN 1 END)`,
                        all_resit: (0, drizzle_orm_1.sql) `count(CASE WHEN sessionId IS NULL THEN 1 END)`
                    }).from(schema_1.resit);
                    return { academic, resitStats: resitStats[0] };
                }));
                res.status(200).json(stats);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    // Helper to clear session-related cache
    clearSessionCache() {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = yield redis_1.redisClient.keys('sessions:*');
            if (keys.length > 0)
                yield redis_1.redisClient.del(keys);
            yield redis_1.redisClient.del('dashboard_stats_full');
        });
    }
    fetchSessionList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cacheKey = 'sessions:list_active';
                const cached = yield redis_1.redisClient.get(cacheKey);
                if (cached)
                    return res.status(200).json(JSON.parse(cached));
                const resp = yield mysqlAdapter_1.db.query.session.findMany({
                    where: (0, drizzle_orm_1.eq)(schema_1.session.status, 1),
                    orderBy: [(0, drizzle_orm_1.desc)(schema_1.session.createdAt)]
                });
                yield redis_1.redisClient.setEx(cacheKey, 3600, JSON.stringify(resp));
                res.status(200).json(resp);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    fetchSessions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (Number(page) - 1) * Number(pageSize);
            try {
                // Define Search Condition
                const whereClause = keyword
                    ? (0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(schema_1.session.title, `%${keyword}%`), (0, drizzle_orm_1.eq)(schema_1.session.id, keyword))
                    : undefined;
                // Execute count and data fetch in parallel (Transaction equivalent)
                const [totalCountResult, data] = yield Promise.all([
                    mysqlAdapter_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.session).where(whereClause),
                    mysqlAdapter_1.db.query.session.findMany({
                        where: whereClause,
                        limit: Number(pageSize),
                        offset: offset,
                        orderBy: [(0, drizzle_orm_1.desc)(schema_1.session.createdAt)]
                    })
                ]);
                const totalDataCount = totalCountResult[0].value;
                res.status(200).json({
                    totalPages: Math.ceil(totalDataCount / Number(pageSize)),
                    totalData: data.length,
                    data: data,
                });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    fetchSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield mysqlAdapter_1.db.query.session.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.session.id, (0, paramStr_1.paramStr)(req.params.id))
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    activateSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sessionId } = req.body;
                const targetSession = yield mysqlAdapter_1.db.query.session.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.session.id, sessionId)
                });
                if (!targetSession)
                    return res.status(202).json({ message: "Session not found" });
                yield mysqlAdapter_1.db.transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    yield tx.update(schema_1.session)
                        .set({ default: 0 })
                        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.ne)(schema_1.session.id, sessionId), (0, drizzle_orm_1.eq)(schema_1.session.tag, targetSession.tag)));
                    yield tx.update(schema_1.session)
                        .set({ default: 1 })
                        .where((0, drizzle_orm_1.eq)(schema_1.session.id, sessionId));
                }));
                yield this.clearSessionCache();
                res.status(200).json({ message: "Session activated" });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    postSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [newSession] = yield mysqlAdapter_1.db.insert(schema_1.session).values(req.body);
                // Logging
                yield mysqlAdapter_1.db.insert(schema_1.log).values({
                    action: `CALENDAR_CREATED`,
                    user: req === null || req === void 0 ? void 0 : req.userId,
                    meta: JSON.stringify(req.body)
                });
                yield this.clearSessionCache();
                res.status(200).json(newSession);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    updateSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mysqlAdapter_1.db.update(schema_1.session)
                    .set(req.body)
                    .where((0, drizzle_orm_1.eq)(schema_1.session.id, (0, paramStr_1.paramStr)(req.params.id)));
                yield mysqlAdapter_1.db.insert(schema_1.log).values({
                    action: `CALENDAR_UPDATED`,
                    user: req === null || req === void 0 ? void 0 : req.userId,
                    meta: JSON.stringify(req.body)
                });
                yield this.clearSessionCache();
                res.status(200).json({ message: "Updated successfully" });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    deleteSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mysqlAdapter_1.db.delete(schema_1.session).where((0, drizzle_orm_1.eq)(schema_1.session.id, (0, paramStr_1.paramStr)(req.params.id)));
                yield mysqlAdapter_1.db.insert(schema_1.log).values({
                    action: `CALENDAR_DELETED`,
                    user: req === null || req === void 0 ? void 0 : req.userId,
                    meta: JSON.stringify({ id: (0, paramStr_1.paramStr)(req.params.id) })
                });
                yield this.clearSessionCache();
                res.status(200).json({ message: "Deleted successfully" });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    /* Student List with Pagination */
    fetchStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, pageSize = 6, keyword = '' } = req.query;
            const offset = (Number(page) - 1) * Number(pageSize);
            try {
                const whereClause = keyword ? (0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(schema_1.student.fname, `%${keyword}%`), (0, drizzle_orm_1.like)(schema_1.student.lname, `%${keyword}%`), (0, drizzle_orm_1.like)(schema_1.student.id, `%${keyword}%`), (0, drizzle_orm_1.like)(schema_1.student.phone, `%${keyword}%`), (0, drizzle_orm_1.like)(schema_1.student.email, `%${keyword}%`), (0, drizzle_orm_1.like)(schema_1.student.indexno, `%${keyword}%`)) : undefined;
                // Parallel execution for count and data
                const [totalCountResult, data] = yield Promise.all([
                    mysqlAdapter_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.student).where(whereClause),
                    mysqlAdapter_1.db.query.student.findMany({
                        where: whereClause,
                        limit: Number(pageSize),
                        offset: offset,
                        with: {
                            title: true,
                            // country: true,
                            region: true,
                            religion: true,
                            disability: true,
                            program: true,
                            // program: { with: { department: true } },
                        },
                        orderBy: [(0, drizzle_orm_1.asc)(schema_1.student.completeStatus), (0, drizzle_orm_1.asc)(schema_1.student.semesterNum)]
                    })
                ]);
                res.status(200).json({
                    totalPages: Math.ceil(totalCountResult[0].value / Number(pageSize)),
                    totalData: data.length,
                    data: data,
                });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    /* Single Student Profile */
    fetchStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield mysqlAdapter_1.db.query.student.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.student.id, (0, paramStr_1.paramStr)(req.params.id)),
                    with: {
                        title: true,
                        // country: true,
                        region: true,
                        religion: true,
                        disability: true,
                        program: true,
                        major: true,
                    }
                });
                if (resp)
                    res.status(200).json(resp);
                else
                    res.status(202).json({ message: `no record found` });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    /* Transcript Logic with Heavy Caching */
    fetchStudentTranscript(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const studentIdOrIndex = (0, paramStr_1.paramStr)(req.params.id);
                const cacheKey = `transcript:${studentIdOrIndex}`;
                const cachedTranscript = yield redis_1.redisClient.get(cacheKey);
                if (cachedTranscript)
                    return res.status(200).json(JSON.parse(cachedTranscript));
                const st = yield mysqlAdapter_1.db.query.student.findFirst({
                    where: (0, drizzle_orm_1.or)((0, drizzle_orm_1.and)((0, drizzle_orm_1.isNotNull)(schema_1.student.indexno), (0, drizzle_orm_1.eq)(schema_1.student.id, studentIdOrIndex)), (0, drizzle_orm_1.eq)(schema_1.student.indexno, studentIdOrIndex)),
                    with: { program: true }
                });
                if (!st || !st.indexno)
                    throw new Error("No valid student or index number found");
                const assessments = yield mysqlAdapter_1.db.query.assessment.findMany({
                    where: (0, drizzle_orm_1.eq)(schema_1.assessment.indexno, st.indexno),
                    with: {
                        scheme: true,
                        session: true,
                        course: true,
                    },
                    orderBy: [(0, drizzle_orm_1.asc)((0, drizzle_orm_1.sql) `session.createdAt`)]
                });
                // 3. Process Transcript Data
                const mdata = new Map();
                for (const sv of assessments) {
                    const sessionTitle = (_b = (_a = sv.session) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : 'none';
                    const grades = (_c = sv.scheme) === null || _c === void 0 ? void 0 : _c.gradeMeta;
                    const processedEntry = Object.assign(Object.assign({}, sv), { student: st, grade: yield (0, helper_1.getGrade)(sv.totalScore, grades), gradepoint: yield (0, helper_1.getGradePoint)(sv.totalScore, grades), classes: (_d = sv.scheme) === null || _d === void 0 ? void 0 : _d.classMeta });
                    if (mdata.has(sessionTitle)) {
                        mdata.get(sessionTitle).push(processedEntry);
                    }
                    else {
                        mdata.set(sessionTitle, [processedEntry]);
                    }
                }
                const finalData = Array.from(mdata);
                // Cache for 24 hours (transcripts don't change often)
                yield redis_1.redisClient.setEx(cacheKey, 86400, JSON.stringify(finalData));
                return res.status(200).json(finalData);
            }
            catch (error) {
                return res.status(202).json({ message: error.message });
            }
        });
    }
    /* Finance Records */
    fetchStudentFinance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield mysqlAdapter_1.db.query.studentAccount.findMany({
                    where: (0, drizzle_orm_1.eq)(schema_1.studentAccount.studentId, (0, paramStr_1.paramStr)(req.params.id)),
                    with: {
                        student: { with: { program: true } },
                        bill: true,
                        charge: true,
                        session: true,
                        transaction: true,
                    }
                });
                if (resp.length)
                    res.status(200).json(resp);
                else
                    res.status(202).json({ message: `no record found` });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    fetchStudentActivity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield mysqlAdapter_1.db.query.student.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.student.id, (0, paramStr_1.paramStr)(req.params.id)),
                    with: {
                        // country: true,
                        program: true, // select: { longName: true } handled via schema config or manual mapping
                    },
                });
                if (resp)
                    res.status(200).json(resp);
                else
                    res.status(202).json({ message: `no record found` });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    stageStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { studentId } = req.body;
                const password = pwdgen();
                const isUser = yield mysqlAdapter_1.db.query.user.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.user.tag, studentId) });
                if (isUser)
                    throw new Error("Student Portal Account Exists!");
                const ssoData = {
                    tag: studentId,
                    username: studentId,
                    password: sha1(password),
                    unlockPin: password,
                    groupId: 1 // Assuming groupId replaces group: { connect: { id: 1 } }
                };
                const [resp] = yield mysqlAdapter_1.db.insert(schema_1.user).values(ssoData);
                if (resp) {
                    const st = yield mysqlAdapter_1.db.query.student.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.student.id, studentId) });
                    if (st === null || st === void 0 ? void 0 : st.phone) {
                        yield sms(st.phone, `Hi! Your new credentials is username: ${(_a = st.instituteEmail) !== null && _a !== void 0 ? _a : studentId}, password: ${password}`);
                    }
                    yield mysqlAdapter_1.db.insert(schema_1.log).values({ action: `STUDENT_ACCOUNT_STAGED`, user: req === null || req === void 0 ? void 0 : req.userId, meta: JSON.stringify(ssoData) });
                    // Invalidate student profile cache
                    yield redis_1.redisClient.del(`student_profile:${studentId}`);
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                res.status(500).json({ message: error instanceof Error ? error.message : error });
            }
        });
    }
    generateIndex(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { studentId } = req.body;
                let indexno = "";
                const st = yield mysqlAdapter_1.db.query.student.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.student.id, studentId),
                    with: { program: true },
                });
                if (!st)
                    throw new Error("Student not found");
                if (st.indexno)
                    throw new Error("Index number exists for student!");
                // Native SQL for specific Date Formatting (MMYY)
                const dateTag = (0, moment_1.default)(st.entryDate).format("MMYY");
                const existingStudents = yield mysqlAdapter_1.db.execute((0, drizzle_orm_1.sql) `
            SELECT id FROM ais_student 
            WHERE DATE_FORMAT(entryDate, '%m%y') = ${dateTag} 
            AND programId = ${st.programId} 
            AND indexno IS NOT NULL 
            AND semesterNum = entrySemesterNum
         `);
                const students = existingStudents[0];
                let studentCount = ((students === null || students === void 0 ? void 0 : students.length) || 0) + 1;
                let loop = true;
                while (loop) {
                    const countStr = studentCount.toString().padStart(4, '0');
                    indexno = `${(_a = st.program) === null || _a === void 0 ? void 0 : _a.prefix}${dateTag}${countStr}`;
                    const ck = yield mysqlAdapter_1.db.query.student.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.student.indexno, indexno) });
                    if (ck)
                        studentCount++;
                    else
                        loop = false;
                }
                yield mysqlAdapter_1.db.update(schema_1.student).set({ indexno }).where((0, drizzle_orm_1.eq)(schema_1.student.id, studentId));
                // Notification & Logging
                const msg = `Hi ${st.fname}! Your AUCB Index number has been generated: ${indexno}`;
                if (st.phone)
                    yield sms(st.phone, msg);
                yield mysqlAdapter_1.db.insert(schema_1.log).values({
                    action: `INDEX_NUMBER_GENERATED`,
                    user: req === null || req === void 0 ? void 0 : req.userId,
                    meta: JSON.stringify({ indexno })
                });
                res.status(200).json({ indexno });
            }
            catch (error) {
                res.status(500).json({ message: error instanceof Error ? error.message : error });
            }
        });
    }
    generateEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { studentId } = req.body;
                const st = yield mysqlAdapter_1.db.query.student.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.student.id, studentId) });
                if (st === null || st === void 0 ? void 0 : st.instituteEmail) {
                    yield mysqlAdapter_1.db.update(schema_1.user).set({ username: st.instituteEmail }).where((0, drizzle_orm_1.eq)(schema_1.user.tag, studentId));
                    throw new Error("mail already exists !");
                }
                let baseUsername = `${(_a = st === null || st === void 0 ? void 0 : st.fname) === null || _a === void 0 ? void 0 : _a.replace(/\s/g, '')}.${st === null || st === void 0 ? void 0 : st.lname}`.toLowerCase();
                let isNew = true;
                let countNum = 1;
                let finalUsername = baseUsername;
                while (isNew) {
                    let checkEmail = `${finalUsername}${countNum > 1 ? countNum : ''}`;
                    const ck = yield mysqlAdapter_1.db.query.student.findFirst({
                        where: (0, drizzle_orm_1.like)(schema_1.student.instituteEmail, `${checkEmail}%`)
                    });
                    if (ck)
                        countNum++;
                    else {
                        finalUsername = checkEmail;
                        isNew = false;
                    }
                }
                const instituteEmail = `${finalUsername}@${process.env.UMS_MAIL}`;
                // Update Database
                yield mysqlAdapter_1.db.transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    yield tx.update(schema_1.student).set({ instituteEmail }).where((0, drizzle_orm_1.eq)(schema_1.student.id, studentId));
                    yield tx.update(schema_1.user).set({ username: instituteEmail }).where((0, drizzle_orm_1.eq)(schema_1.user.tag, studentId));
                    yield tx.insert(schema_1.log).values({
                        action: `STUDENT_EMAIL_GENERATED`,
                        user: req === null || req === void 0 ? void 0 : req.userId,
                        meta: JSON.stringify({ instituteEmail })
                    });
                }));
                res.status(200).json({ instituteEmail });
            }
            catch (error) {
                res.status(500).json({ message: error instanceof Error ? error.message : error });
            }
        });
    }
}
exports.default = AisController;
