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
const moment_1 = __importDefault(require("moment"));
const client_1 = require("../prisma/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const helper_1 = require("../util/helper");
const paramStr_1 = require("../util/paramStr");
const ais = client_1.prisma;
const sha1 = require('sha1');
const { customAlphabet } = require("nanoid");
const pwdgen = customAlphabet("1234567890abcdefghijklmnopqrstuvwzyx", 6);
const sms = require('../config/sms');
const ExcelJS = require('exceljs');
class AisController {
    fetchTest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tag = '24010001';
                const resp = yield ais.election.findMany({
                    // where: { voterList: { array_contains: tag }},
                    where: { voterData: { path: '$[*].tag', array_contains: tag } },
                });
                if (resp === null || resp === void 0 ? void 0 : resp.length) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Reports */
    loadReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { type, program, major, year, mode, session, gsession, rsession, category } = req.body;
                let resp = { type };
                if (type == 'student_registration') {
                    let regs = yield ais.activityRegister.findMany({
                        where: Object.assign(Object.assign(Object.assign(Object.assign({ session: { default: true } }, program && ({ student: { programId: program } })), major && ({ student: { majorId: major } })), mode && ({ student: { studyMode: mode } })), year && ({ semesterNum: { in: [(Number(year) * 2), (Number(year) * 2) - 1] } })),
                        include: { student: { include: { program: true, major: true } }, session: true },
                        orderBy: [
                            { session: { createdAt: 'asc' } },
                            { student: { programId: 'asc' } },
                            { student: { majorId: 'asc' } },
                            { student: { semesterNum: 'asc' } },
                            { student: { studyMode: 'asc' } },
                            { student: { lname: 'asc' } },
                        ]
                    });
                    if (regs.length) {
                        regs = regs.map((r) => {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
                            return ({
                                'LAST NAME': (_b = (_a = r.student) === null || _a === void 0 ? void 0 : _a.lname) === null || _b === void 0 ? void 0 : _b.toUpperCase(),
                                'FIRST NAME': (_d = (_c = r.student) === null || _c === void 0 ? void 0 : _c.fname) === null || _d === void 0 ? void 0 : _d.toUpperCase(),
                                'MIDDLE NAME(S)': (_f = (_e = r.student) === null || _e === void 0 ? void 0 : _e.mname) === null || _f === void 0 ? void 0 : _f.toUpperCase(),
                                'INDEX NUMBER': (_g = r.student) === null || _g === void 0 ? void 0 : _g.indexno,
                                'STUDENT ID': (_h = r.student) === null || _h === void 0 ? void 0 : _h.id,
                                'STUDY MODE': (_j = r.student) === null || _j === void 0 ? void 0 : _j.studyMode,
                                'GENDER': (_k = r.student) === null || _k === void 0 ? void 0 : _k.gender,
                                'YEAR': Math.ceil(r.semesterNum / 2),
                                'ACADEMIC SESSION': `${(_l = r.session) === null || _l === void 0 ? void 0 : _l.title} - ${(_m = r.session) === null || _m === void 0 ? void 0 : _m.tag}`,
                                'PROGRAM': (_p = (_o = r.student) === null || _o === void 0 ? void 0 : _o.program) === null || _p === void 0 ? void 0 : _p.shortName,
                                'MAJOR': (_r = (_q = r.student) === null || _q === void 0 ? void 0 : _q.major) === null || _r === void 0 ? void 0 : _r.shortName,
                                'COURSES': r.courses,
                                'REGISTRATION DATE': r.createdAt
                            });
                        });
                        resp = Object.assign(Object.assign({}, resp), { data: regs });
                    }
                }
                else if (type == 'student_deferment') {
                    let regs = yield ais.activityDefer.findMany({
                        where: Object.assign(Object.assign(Object.assign(Object.assign({}, program && ({ student: { programId: program } })), major && ({ student: { majorId: major } })), mode && ({ student: { studyMode: mode } })), year && ({ semesterNum: { in: [(Number(year) * 2), (Number(year) * 2) - 1] } })),
                        include: { student: { include: { program: true, major: true } } },
                        orderBy: [
                            { student: { programId: 'asc' } },
                            { student: { majorId: 'asc' } },
                            { student: { semesterNum: 'asc' } },
                            { student: { studyMode: 'asc' } },
                            { student: { lname: 'asc' } },
                        ]
                    });
                    if (regs.length) {
                        regs = regs.map((r) => {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                            return ({
                                'LAST NAME': (_b = (_a = r.student) === null || _a === void 0 ? void 0 : _a.lname) === null || _b === void 0 ? void 0 : _b.toUpperCase(),
                                'FIRST NAME': (_d = (_c = r.student) === null || _c === void 0 ? void 0 : _c.fname) === null || _d === void 0 ? void 0 : _d.toUpperCase(),
                                'MIDDLE NAME(S)': (_f = (_e = r.student) === null || _e === void 0 ? void 0 : _e.mname) === null || _f === void 0 ? void 0 : _f.toUpperCase(),
                                'INDEX NUMBER': (_g = r.student) === null || _g === void 0 ? void 0 : _g.indexno,
                                'STUDENT ID': (_h = r.student) === null || _h === void 0 ? void 0 : _h.id,
                                'STUDY MODE': (_j = r.student) === null || _j === void 0 ? void 0 : _j.studyMode,
                                'GENDER': (_k = r.student) === null || _k === void 0 ? void 0 : _k.gender,
                                'YEAR': Math.ceil(r.semesterNum / 2),
                                'PROGRAM': (_m = (_l = r.student) === null || _l === void 0 ? void 0 : _l.program) === null || _m === void 0 ? void 0 : _m.shortName,
                                'MAJOR': (_p = (_o = r.student) === null || _o === void 0 ? void 0 : _o.major) === null || _p === void 0 ? void 0 : _p.shortName,
                                'DURATION': r.durationInYears,
                                'RESUMPTION DATE': r.end
                            });
                        });
                        resp = Object.assign(Object.assign({}, resp), { data: regs });
                    }
                }
                else if (type == 'student_debtor') {
                    let regs = yield ais.student.findMany({
                        where: Object.assign(Object.assign(Object.assign(Object.assign({ 
                            //completeStatus: false,
                            accountNet: { gt: 0 } }, program && ({ programId: program })), major && ({ majorId: major })), mode && ({ studyMode: mode })), year && ({ semesterNum: { in: [(Number(year) * 2), (Number(year) * 2) - 1] } })),
                        include: { program: true, major: true },
                        orderBy: [
                            { programId: 'asc' },
                            { majorId: 'asc' },
                            { semesterNum: 'asc' },
                            { studyMode: 'asc' },
                            { lname: 'asc' },
                        ]
                    });
                    if (regs.length) {
                        regs = regs.map((r) => {
                            var _a, _b, _c, _d, _e;
                            return ({
                                'LAST NAME': (_a = r.lname) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
                                'FIRST NAME': (_b = r.fname) === null || _b === void 0 ? void 0 : _b.toUpperCase(),
                                'MIDDLE NAME(S)': (_c = r.mname) === null || _c === void 0 ? void 0 : _c.toUpperCase(),
                                'INDEX NUMBER': r.indexno,
                                'STUDENT ID': r.id,
                                'STUDY MODE': r.studyMode,
                                'GENDER': r.gender,
                                'YEAR': Math.ceil(r.semesterNum / 2),
                                'PROGRAM': (_d = r.program) === null || _d === void 0 ? void 0 : _d.shortName,
                                'MAJOR': (_e = r.major) === null || _e === void 0 ? void 0 : _e.shortName,
                                'STUDENT ACCOUNT NET': r.accountNet,
                            });
                        });
                        resp = Object.assign(Object.assign({}, resp), { data: regs });
                    }
                }
                else if (type == 'student_profile') {
                    let regs = yield ais.student.findMany({
                        where: Object.assign(Object.assign(Object.assign(Object.assign({ completeStatus: false }, program && ({ programId: program })), major && ({ majorId: major })), mode && ({ studyMode: mode })), year && ({ semesterNum: { in: [(Number(year) * 2), (Number(year) * 2) - 1] } })),
                        include: { program: true, major: true },
                        orderBy: [
                            { programId: 'desc' },
                            { majorId: 'asc' },
                            { semesterNum: 'asc' },
                            { studyMode: 'asc' },
                            { lname: 'asc' },
                        ]
                    });
                    if (regs.length) {
                        regs = regs.map((r) => {
                            var _a, _b, _c, _d, _e;
                            return ({
                                'LAST NAME': (_a = r.lname) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
                                'FIRST NAME': (_b = r.fname) === null || _b === void 0 ? void 0 : _b.toUpperCase(),
                                'MIDDLE NAME(S)': (_c = r.mname) === null || _c === void 0 ? void 0 : _c.toUpperCase(),
                                'INDEX NUMBER': r.indexno,
                                'STUDENT ID': r.id,
                                'STUDY MODE': r.studyMode,
                                'GENDER': r.gender,
                                'YEAR': Math.ceil(r.semesterNum / 2),
                                'PROGRAM': (_d = r.program) === null || _d === void 0 ? void 0 : _d.shortName,
                                'MAJOR': (_e = r.major) === null || _e === void 0 ? void 0 : _e.shortName,
                                'STATUS': r.deferStatus == 1 ? 'DEFERRED' : 'ACTIVE',
                            });
                        });
                        resp = Object.assign(Object.assign({}, resp), { data: regs });
                    }
                }
                else if (type == 'exam_eligible') {
                    let regs = yield ais.student.findMany({
                        where: {
                            OR: [
                                { accountNet: { lte: 0 } },
                                { flagPardon: true },
                            ],
                            AND: [
                                { completeStatus: false },
                                Object.assign({}, program && ({ programId: program })),
                                Object.assign({}, major && ({ majorId: major })),
                                Object.assign({}, mode && ({ studyMode: mode })),
                                Object.assign({}, year && ({ semesterNum: { in: [(Number(year) * 2), (Number(year) * 2) - 1] } })),
                            ],
                        },
                        include: { program: true, major: true },
                        orderBy: [
                            { programId: 'desc' },
                            { majorId: 'asc' },
                            { semesterNum: 'asc' },
                            { studyMode: 'asc' },
                            { lname: 'asc' },
                        ]
                    });
                    if (regs.length) {
                        regs = regs.map((r) => {
                            var _a, _b, _c, _d, _e;
                            return ({
                                'LAST NAME': (_a = r.lname) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
                                'FIRST NAME': (_b = r.fname) === null || _b === void 0 ? void 0 : _b.toUpperCase(),
                                'MIDDLE NAME(S)': (_c = r.mname) === null || _c === void 0 ? void 0 : _c.toUpperCase(),
                                'INDEX NUMBER': r.indexno,
                                'STUDENT ID': r.id,
                                'STUDY MODE': r.studyMode,
                                'GENDER': r.gender,
                                'YEAR': Math.ceil(r.semesterNum / 2),
                                'PROGRAM': (_d = r.program) === null || _d === void 0 ? void 0 : _d.shortName,
                                'MAJOR': (_e = r.major) === null || _e === void 0 ? void 0 : _e.shortName,
                                'STATUS': r.deferStatus == 1 ? 'DEFERRED' : 'ACTIVE',
                            });
                        });
                        resp = Object.assign(Object.assign({}, resp), { data: regs });
                    }
                }
                else if (type == 'resit') {
                    let regs = yield ais.resit.findMany({
                        where: {
                            OR: [
                                Object.assign({}, session && ({ session: { default: true } })),
                                Object.assign({}, rsession && ({ trailSession: { default: true } })),
                            ]
                        },
                        include: { course: true, student: { include: { program: true, major: true } } },
                        orderBy: [
                            { student: { programId: 'asc' } },
                            { student: { majorId: 'asc' } },
                            { student: { semesterNum: 'asc' } },
                            { student: { studyMode: 'asc' } },
                            { student: { lname: 'asc' } },
                        ]
                    });
                    if (regs.length) {
                        regs = regs.map((r) => {
                            var _a, _b, _c, _d, _e, _f, _g, _h;
                            return ({
                                'LAST NAME': (_a = r.student.lname) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
                                'FIRST NAME': (_b = r.student.fname) === null || _b === void 0 ? void 0 : _b.toUpperCase(),
                                'MIDDLE NAME(S)': (_c = r.student.mname) === null || _c === void 0 ? void 0 : _c.toUpperCase(),
                                'INDEX NUMBER': (_d = r.student) === null || _d === void 0 ? void 0 : _d.indexno,
                                'STUDENT ID': (_e = r.student) === null || _e === void 0 ? void 0 : _e.id,
                                'STUDY MODE': r.student.studyMode,
                                'GENDER': r.student.gender,
                                'YEAR': Math.ceil(r.student.semesterNum / 2),
                                'PROGRAM': (_f = r.student.program) === null || _f === void 0 ? void 0 : _f.shortName,
                                'COURSE': `${(_g = r.course) === null || _g === void 0 ? void 0 : _g.title} - ${(_h = r.course) === null || _h === void 0 ? void 0 : _h.id}`,
                                'REGISTRATION DATE': r.registeredAt ? 'YES' : 'NO',
                                'PAYMENT STATUS': r.paid ? 'YES' : 'NO',
                            });
                        });
                        resp = Object.assign(Object.assign({}, resp), { data: regs });
                    }
                }
                else if (type == 'graduate_list') {
                    let regs = yield ais.graduate.findMany({
                        where: Object.assign({}, gsession && ({ graduateSession: { default: true } })),
                        include: { graduateSession: true, student: { include: { program: true, major: true } } },
                        orderBy: [
                            { student: { programId: 'asc' } },
                            { student: { majorId: 'asc' } },
                            { student: { semesterNum: 'asc' } },
                            { student: { studyMode: 'asc' } },
                            { student: { lname: 'asc' } },
                        ]
                    });
                    if (regs.length) {
                        regs = regs.map((r) => {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                            return ({
                                'LAST NAME': (_a = r.student.lname) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
                                'FIRST NAME': (_b = r.student.fname) === null || _b === void 0 ? void 0 : _b.toUpperCase(),
                                'MIDDLE NAME(S)': (_c = r.student.mname) === null || _c === void 0 ? void 0 : _c.toUpperCase(),
                                'INDEX NUMBER': (_d = r.student) === null || _d === void 0 ? void 0 : _d.indexno,
                                'STUDENT ID': (_e = r.student) === null || _e === void 0 ? void 0 : _e.id,
                                'STUDY MODE': r.student.studyMode,
                                'GENDER': r.student.gender,
                                'PROGRAM': (_f = r.student.program) === null || _f === void 0 ? void 0 : _f.shortName,
                                'MAJOR': (_g = r.student.major) === null || _g === void 0 ? void 0 : _g.shortName,
                                'SESSION': (_j = (_h = r.graduateSession) === null || _h === void 0 ? void 0 : _h.title) === null || _j === void 0 ? void 0 : _j.toUpperCase(),
                                'CGPA': r.cgpa,
                                'CLASS': r.class,
                            });
                        });
                        resp = Object.assign(Object.assign({}, resp), { data: regs });
                    }
                }
                else if (type == 'staff') {
                    let regs = yield ais.staff.findMany({
                        where: Object.assign({}, category && ({ unit: { type: category } })),
                        include: { job: true, unit: true },
                        orderBy: [
                            { staffNo: 'asc' },
                        ]
                    });
                    if (regs.length) {
                        regs = regs.map((r) => {
                            var _a, _b, _c, _d, _e, _f, _g;
                            return ({
                                'LAST NAME': (_a = r.lname) === null || _a === void 0 ? void 0 : _a.toUpperCase(),
                                'FIRST NAME': (_b = r.fname) === null || _b === void 0 ? void 0 : _b.toUpperCase(),
                                'MIDDLE NAME(S)': (_c = r.mname) === null || _c === void 0 ? void 0 : _c.toUpperCase(),
                                'STAFF NUMBER': r.staffNo,
                                'PHONE NUMBER': r.phone,
                                'EMAIL': r === null || r === void 0 ? void 0 : r.email,
                                'INSTITUTIONAL EMAIL': r.instituteEmail,
                                'UNIT': (_e = (_d = r.unit) === null || _d === void 0 ? void 0 : _d.title) === null || _e === void 0 ? void 0 : _e.toUpperCase(),
                                'DESIGNATION': (_g = (_f = r.job) === null || _f === void 0 ? void 0 : _f.title) === null || _g === void 0 ? void 0 : _g.toUpperCase(),
                                'STAFF STATUS': r.staffStatus,
                            });
                        });
                        resp = Object.assign(Object.assign({}, resp), { data: regs });
                    }
                }
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Dashboard & Statistics */
    loadDashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Main Statistics
                // const students:any = await ais.student.findMany({ where: { default: true } }); // students
                // Academic Session Statistics
                const sessions = yield ais.session.findMany({ where: { default: true } }); // Sessions
                const academic = yield Promise.all(sessions.map((s) => __awaiter(this, void 0, void 0, function* () {
                    const { tag } = s;
                    // Registered
                    const reg = yield ais.activityRegister.findMany({ where: { sessionId: s.id } });
                    // const unregister:any = await ais.activityRegister.findMany({ where: { sessionId: s.id, student: { gender: 'F' }} });
                    const unreg = tag == 'MAIN'
                        ? yield ais.$queryRaw `select id from ais_student s where (date_format(entryDate,'%m') = '09' or (date_format(entryDate,'%m') = '01' and ((entrySemesterNum = 1 and semesterNum > 2) or (entrySemesterNum = 3 and semesterNum > 4)))) and completeStatus = 0 and deferStatus = 0 and indexno not in (select indexno from ais_activity_register where sessionId = ${s.id})`
                        : yield ais.$queryRaw `select id from ais_student s where date_format(entryDate,'%m') = '01' and ((entrySemesterNum = 1 and semesterNum < 3) or (entrySemesterNum = 3 and semesterNum < 5)) and completeStatus = 0 and deferStatus = 0 and indexno not in (select indexno from ais_activity_register where sessionId = ${s.id})`;
                    return ({
                        label: `${s.title} - ${s.tag}`,
                        register: reg === null || reg === void 0 ? void 0 : reg.length,
                        unregister: unreg === null || unreg === void 0 ? void 0 : unreg.length
                    });
                })));
                // Resit Session Statistics
                const rsession = yield ais.resitSession.findFirst({ where: { default: true } }); // Resit Sessions
                const reg_resit = yield ais.resit.count({ where: { resitSession: { default: true }, registeredAt: { not: null }, taken: false } }); // Registered Resits
                const all_resit = yield ais.resit.count({ where: { resitSessionId: null } }); // All Students Resits
                const cs_resit = yield ais.resit.groupBy({
                    by: ['courseId'],
                    where: { resitSession: { default: true }, registeredAt: { not: null }, taken: false },
                    _count: {
                        courseId: true
                    }
                });
                // const cs_resit:any = await ais.student.groupBy({ 
                //    by: ['programId'], 
                //    where: { programId: 'dcd0771d-a587-4242-a46e-8ee2bf0bad31' },
                //    _count:{
                //       programId: true,
                //    }, 
                // }); 
                //console.log("text", cs_resit);
                const resit = {
                    label: rsession === null || rsession === void 0 ? void 0 : rsession.title,
                    register: reg_resit,
                    estimate: all_resit,
                    courses: (cs_resit === null || cs_resit === void 0 ? void 0 : cs_resit.length) || 0,
                };
                // Graduation Session Statistics
                const gsession = yield ais.graduateSession.findFirst({ where: { default: true } }); // Resit Sessions
                const graduand = yield ais.graduate.count({ where: { graduateSession: { default: true } } }); // Registered Resits
                const completed = yield ais.student.count({ where: { completeStatus: true, graduateStatus: false } }); // All Students Resits
                const graduation = {
                    label: gsession === null || gsession === void 0 ? void 0 : gsession.title,
                    graduand,
                    complete: completed,
                };
                // Student Statistics
                const mactive = yield ais.student.count({ where: { completeStatus: false, deferStatus: false, gender: 'M' } });
                const factive = yield ais.student.count({ where: { completeStatus: false, deferStatus: false, gender: 'F' } });
                const mdefer = yield ais.student.count({ where: { completeStatus: false, deferStatus: true, gender: 'M' } });
                const fdefer = yield ais.student.count({ where: { completeStatus: false, deferStatus: true, gender: 'F' } });
                const mcomplete = yield ais.student.count({ where: { completeStatus: true, deferStatus: false, gender: 'M' } });
                const fcomplete = yield ais.student.count({ where: { completeStatus: true, deferStatus: false, gender: 'F' } });
                const mgraduate = yield ais.student.count({ where: { completeStatus: true, deferStatus: false, graduateStatus: true, gender: 'M' } });
                const fgraduate = yield ais.student.count({ where: { completeStatus: true, deferStatus: false, graduateStatus: true, gender: 'F' } });
                // Department Statistics
                const depts = yield ais.unit.findMany({ where: { type: 'ACADEMIC', levelNum: 2 } });
                const department = yield Promise.all(depts.map((r) => __awaiter(this, void 0, void 0, function* () {
                    const programs = yield ais.program.count({ where: { unitId: r.id } });
                    const students = yield ais.student.count({ where: { program: { unitId: r.id }, completeStatus: false } });
                    const staff = yield ais.staff.count({ where: { unitId: r.id, status: true } });
                    return ({
                        label: r.title,
                        programs,
                        students,
                        staff
                    });
                })));
                // Program Statistics
                const progs = yield ais.program.findMany();
                const program = yield Promise.all(progs.map((r) => __awaiter(this, void 0, void 0, function* () {
                    // // Applicant
                    // const m_applicant:any = await ais.$queryRaw`select * from ams_step_choice c left join ams_step_profile p on p.serial = c.serial left join ams_applicant a on p.serial = a.serial where p.gender = 'M' and a.admissionId = ${session?.id} and c.programId = ${r?.id}`;
                    // const f_applicant:any = await ais.$queryRaw`select * from ams_step_choice c left join ams_step_profile p on p.serial = c.serial left join ams_applicant a on p.serial = a.serial where p.gender = 'F' and a.admissionId = ${session?.id} and c.programId = ${r?.id}`;
                    const y1 = yield ais.student.count({ where: { programId: r.id, completeStatus: false, semesterNum: { in: [1, 2] } } });
                    const y2 = yield ais.student.count({ where: { programId: r.id, completeStatus: false, semesterNum: { in: [3, 4] } } });
                    const y3 = yield ais.student.count({ where: { programId: r.id, completeStatus: false, semesterNum: { in: [5, 6] } } });
                    const y4 = yield ais.student.count({ where: { programId: r.id, completeStatus: false, semesterNum: { in: [7, 8] } } });
                    return ({
                        label: r.code,
                        y1,
                        y2,
                        y3,
                        y4,
                    });
                })));
                let data = {
                    sessions: {
                        academic,
                        resit,
                        graduation
                    },
                    student: {
                        active: { f: factive, m: mactive },
                        defer: { f: fdefer, m: mdefer },
                        complete: { f: fcomplete, m: mcomplete },
                        graduate: { f: fgraduate, m: mgraduate }
                    },
                    department,
                    program,
                };
                if (data) {
                    res.status(200).json(data);
                }
                else {
                    res.status(204).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Session */
    fetchSessionList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.session.findMany({ where: { status: true }, orderBy: { createdAt: 'desc' } });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchSessions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = { orderBy: { createdAt: 'desc' } };
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { title: { contains: keyword } },
                                { id: { contains: keyword } },
                            ],
                        },
                        orderBy: { createdAt: 'desc' }
                    };
                const resp = yield ais.$transaction([
                    ais.session.count(Object.assign({}, (searchCondition))),
                    ais.session.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize) }))
                ]);
                //if(resp && resp[1]?.length){
                res.status(200).json({
                    totalPages: (_a = Math.ceil(resp[0] / pageSize)) !== null && _a !== void 0 ? _a : 0,
                    totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                    data: resp[1],
                });
                //} else {
                //res.status(202).json({ message: `no records found` })
                //}
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.session.findUnique({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    activateSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sessionId } = req.body;
                const resm = yield ais.session.findUnique({ where: { id: sessionId } });
                const resx = yield ais.session.updateMany({ where: { NOT: { id: sessionId }, tag: resm === null || resm === void 0 ? void 0 : resm.tag }, data: { default: false } });
                //const resx = await ais.session.updateMany({ where: { NOT: { id: sessionId }  }, data: { default: false } })
                const resp = yield ais.session.update({ where: { id: sessionId }, data: { default: true } });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.session.create({ data: Object.assign({}, req.body) });
                if (resp) {
                    // Log Login Response
                    yield ais.log.create({ data: { action: `CALENDAR_CREATED`, user: req === null || req === void 0 ? void 0 : req.userId, meta: req.body } });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.session.update({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    data: Object.assign({}, req.body)
                });
                if (resp) {
                    // Log Login Response
                    yield ais.log.create({ data: { action: `CALENDAR_UPDATED`, user: req === null || req === void 0 ? void 0 : req.userId, meta: req.body } });
                    //  Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.session.delete({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    // Log Login Response
                    yield ais.log.create({ data: { action: `CALENDAR_DELETED`, user: req === null || req === void 0 ? void 0 : req.userId, meta: req.body } });
                    // Return response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Student */
    fetchStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 6, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { fname: { contains: keyword } },
                                { lname: { contains: keyword } },
                                { id: { contains: keyword } },
                                { phone: { contains: keyword } },
                                { email: { contains: keyword } },
                                { indexno: { contains: keyword } },
                            ],
                        }
                    };
                const resp = yield ais.$transaction([
                    ais.student.count(Object.assign({}, (searchCondition))),
                    ais.student.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize), include: {
                            title: { select: { label: true } },
                            country: { select: { longName: true } },
                            region: { select: { title: true } },
                            religion: { select: { title: true } },
                            disability: { select: { title: true } },
                            program: {
                                select: {
                                    longName: true,
                                    department: { select: { title: true } }
                                }
                            },
                        }, orderBy: [
                            { completeStatus: 'asc' },
                            { semesterNum: 'asc' }
                        ] }))
                ]);
                //if(resp && resp[1]?.length){
                res.status(200).json({
                    totalPages: (_a = Math.ceil(resp[0] / pageSize)) !== null && _a !== void 0 ? _a : 0,
                    totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                    data: resp[1],
                });
                //} else {
                //res.status(202).json({ message: `no records found` })
                //}
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.student.findUnique({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    include: {
                        title: { select: { label: true } },
                        country: { select: { longName: true, nationality: true } },
                        region: { select: { title: true } },
                        religion: { select: { title: true } },
                        disability: { select: { title: true } },
                        program: {
                            select: {
                                longName: true,
                                shortName: true,
                                department: { select: { title: true } }
                            }
                        },
                        major: {
                            select: {
                                longName: true,
                                shortName: true,
                            }
                        },
                    },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchStudentTranscript(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const st = yield ais.student.findFirst({
                    where: {
                        OR: [
                            {
                                AND: [
                                    { indexno: { not: null } },
                                    { id: (0, paramStr_1.paramStr)(req.params.id) }
                                ]
                            },
                            { indexno: (0, paramStr_1.paramStr)(req.params.id) }
                        ]
                    },
                    select: { indexno: true, fname: true, mname: true, lname: true, id: true, gender: true, entryDate: true, exitDate: true, program: { select: { longName: true, shortName: true, stype: true, category: true } } }
                });
                if (!st)
                    throw ("No index number generated");
                const resp = yield ais.assessment.findMany({
                    where: {
                        indexno: st === null || st === void 0 ? void 0 : st.indexno,
                    },
                    include: {
                        //student: true,
                        //  student: { include: { program: true } },
                        //  student: { select: { indexno: true, fname: true, mname: true, lname: true, id: true, gender: true, entryDate: true, exitDate: true, program: { select: { longName: true, shortName: true, stype: true, category: true } } } },
                        scheme: { select: { gradeMeta: true, classMeta: true } },
                        session: { select: { title: true, year: true, semester: true } },
                        course: { select: { title: true } },
                    },
                    orderBy: { session: { createdAt: 'asc' } }
                });
                if (resp) {
                    // Class Awards
                    var mdata = new Map();
                    for (const sv of resp) {
                        const index = (_b = (_a = sv === null || sv === void 0 ? void 0 : sv.session) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : 'none';
                        const grades = (_c = sv.scheme) === null || _c === void 0 ? void 0 : _c.gradeMeta;
                        const classes = (_d = sv.scheme) === null || _d === void 0 ? void 0 : _d.classMeta;
                        const zd = Object.assign(Object.assign({}, sv), { student: st, grade: yield (0, helper_1.getGrade)(sv.totalScore, grades), gradepoint: yield (0, helper_1.getGradePoint)(sv.totalScore, grades), classes });
                        // Data By Courses
                        if (mdata.has(index)) {
                            mdata.set(index, [...mdata.get(index), Object.assign({}, zd)]);
                        }
                        else {
                            mdata.set(index, [Object.assign({}, zd)]);
                        }
                    }
                    return res.status(200).json(Array.from(mdata));
                }
                else {
                    return res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(202).json({ message: error.message });
            }
        });
    }
    fetchStudentTranscripts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cacheKey = `transcripts:${JSON.stringify(req.body.key)}`;
                const result = yield (0, helper_1.getOrSetCache)(cacheKey, () => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    const resp = yield ais.broadsheet.findMany({
                        where: {
                            indexno: { in: (_a = req.body) === null || _a === void 0 ? void 0 : _a.data },
                        },
                        orderBy: { sessionCreatedAt: 'asc' }
                    });
                    if (resp === null || resp === void 0 ? void 0 : resp.length) {
                        var mdata = new Map();
                        for (const sv of resp) {
                            const index = sv.indexno;
                            if (mdata.has(index)) {
                                mdata.set(index, [...mdata.get(index), sv]);
                            }
                            else {
                                mdata.set(index, [sv]);
                            }
                        }
                        const vdata = yield Promise.all((_b = Array.from(mdata)) === null || _b === void 0 ? void 0 : _b.map((st) => __awaiter(this, void 0, void 0, function* () {
                            var _a;
                            let [indexno, tdata] = st;
                            let sdata = new Map();
                            for (const sv of tdata) {
                                const cindex = (_a = sv.title) !== null && _a !== void 0 ? _a : 'none';
                                const grades = sv.gradeMeta;
                                const classes = sv.classMeta;
                                const zd = Object.assign(Object.assign({}, sv), { grade: yield (0, helper_1.getGrade)(sv.totalScore, grades), gradepoint: yield (0, helper_1.getGradePoint)(sv.totalScore, grades), classes });
                                // Data By Courses
                                if (sdata.has(cindex)) {
                                    sdata.set(cindex, [...sdata.get(cindex), Object.assign({}, zd)]);
                                }
                                else {
                                    sdata.set(cindex, [Object.assign({}, zd)]);
                                }
                            }
                            return [indexno, Array.from(sdata)];
                        })));
                        return vdata;
                    }
                }));
                if (result) {
                    // Return Response
                    return res.status(200).json(result);
                }
                else {
                    return res.status(202).json({ message: `No records` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(202).json({ message: error.message });
            }
        });
    }
    fetchStudentFinance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.studentAccount.findMany({
                    where: { studentId: (0, paramStr_1.paramStr)(req.params.id) },
                    include: {
                        student: { select: { fname: true, mname: true, indexno: true, program: { select: { longName: true } } } },
                        bill: { select: { narrative: true } },
                        charge: { select: { title: true } },
                        session: { select: { title: true } },
                        transaction: { select: { transtag: true } },
                    },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchStudentActivity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.student.findUnique({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    include: {
                        country: true,
                        program: {
                            select: {
                                longName: true
                            }
                        },
                    },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    stageStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { studentId } = req.body;
                const password = pwdgen();
                const isUser = yield ais.user.findFirst({ where: { tag: studentId } });
                if (isUser)
                    throw ("Student Portal Account Exists!");
                const ssoData = { tag: studentId, username: studentId, password: sha1(password), unlockPin: password }; // AUCC only
                //   const ssoData = { tag:studentId, username:studentId, password:sha1(password), unlockPin: password }  // MLK & Others
                // Populate SSO Account
                const resp = yield ais.user.create({
                    data: Object.assign(Object.assign({}, ssoData), { group: { connect: { id: 1 } } }),
                });
                if (resp) {
                    // Send Credentials By SMS
                    const st = yield ais.student.findFirst({ where: { id: studentId } });
                    if (st === null || st === void 0 ? void 0 : st.phone)
                        yield sms(st === null || st === void 0 ? void 0 : st.phone, `Hi! Your new credentials is username: ${(_a = st === null || st === void 0 ? void 0 : st.instituteEmail) !== null && _a !== void 0 ? _a : studentId}, password: ${password}`);
                    // Log Login Response
                    yield ais.log.create({ data: { action: `STUDENT_ACCOUNT_STAGED`, user: req === null || req === void 0 ? void 0 : req.userId, meta: ssoData } });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json(error);
            }
        });
    }
    resetStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { studentId } = req.body;
                const password = pwdgen();
                const resp = yield ais.user.updateMany({
                    where: { tag: studentId },
                    // data: { password: sha1(password), unlockPin: password },
                    data: { password: sha1(password) },
                    include: true
                });
                if (resp === null || resp === void 0 ? void 0 : resp.count) {
                    // Send Password By SMS
                    const st = yield ais.student.findFirst({ where: { id: studentId } });
                    if (st === null || st === void 0 ? void 0 : st.phone)
                        yield sms(st === null || st === void 0 ? void 0 : st.phone, `Hi! Your new credentials is username: ${(_a = st === null || st === void 0 ? void 0 : st.instituteEmail) !== null && _a !== void 0 ? _a : studentId}, password: ${password}`);
                    // Log Login Response
                    yield ais.log.create({ data: { action: `STUDENT_ACCOUNT_RESET`, user: req === null || req === void 0 ? void 0 : req.userId, meta: { password: sha1(password) } } });
                    // Return Password
                    res.status(200).json({ password });
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json(error);
            }
        });
    }
    changePhoto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { studentId } = req.body;
                const password = pwdgen();
                const resp = yield ais.user.updateMany({
                    where: { tag: studentId },
                    data: { password: sha1(password) },
                });
                if (resp) {
                    res.status(200).json({ password });
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json(error);
            }
        });
    }
    generateIndex(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { studentId } = req.body;
                let indexno;
                const student = yield ais.student.findUnique({
                    where: { id: studentId },
                    include: { program: { select: { prefix: true } } },
                });
                if (student === null || student === void 0 ? void 0 : student.indexno)
                    throw ("Index number exists for student!");
                // const students = await ais.$queryRaw`select * from ais_student where date_format(entryDate,'%m%y') = ${moment(student?.entryDate).format("MMYYYY")} and programId = ${student?.programId}`;
                const students = yield ais.$queryRaw `select * from ais_student where date_format(entryDate,'%m%y') = ${(0, moment_1.default)(student === null || student === void 0 ? void 0 : student.entryDate).format("MMYY")} and programId = ${student === null || student === void 0 ? void 0 : student.programId} and indexno is not null and (semesterNum = entrySemesterNum)`;
                // console.log("index student: ", students,moment(student?.entryDate).format("MMYY"));
                // AUCC INDEX NUMBER GENERATION
                let studentCount = (students === null || students === void 0 ? void 0 : students.length) + 1;
                let loop = true;
                while (loop) {
                    // Compute Index Number
                    const count = studentCount.toString().length == 1 ? `000${studentCount}` : studentCount.toString().length == 2 ? `00${studentCount}` : studentCount.toString().length == 3 ? `0${studentCount}` : studentCount;
                    indexno = `${(_a = student === null || student === void 0 ? void 0 : student.program) === null || _a === void 0 ? void 0 : _a.prefix}${(0, moment_1.default)((student === null || student === void 0 ? void 0 : student.entryDate) || new Date()).format("MMYY")}${count}`;
                    // console.log(student?.program?.prefix, moment(student?.entryDate || new Date()).format("MMYY"), studentCount, indexno)
                    // Check If Index Number Exists
                    const ck = yield ais.student.findFirst({ where: { indexno } });
                    if (ck) {
                        studentCount = studentCount + 1;
                    }
                    else {
                        loop = false;
                    }
                }
                // MLK INDEX NUMBER GENERATION
                // const count = student?.progCount?.toString().length == 1 ? `00${student?.progCount}`  : student?.progCount?.toString().length == 2 ? `0${student?.progCount}` : student?.progCount;
                // indexno = `${student?.program?.prefix}/${moment(student?.entryDate || new Date()).format("YY")}/${count}`
                const resp = yield ais.student.update({
                    where: { id: studentId },
                    data: { indexno },
                });
                if (resp) {
                    // Send Notfication
                    const msg = `Hi ${student.fname}! Your AUCB Index number has been generated: ${indexno}, Thank you!`;
                    yield sms(student === null || student === void 0 ? void 0 : student.phone, msg);
                    // Log Login Response
                    yield ais.log.create({ data: { action: `INDEX_NUMBER_GENERATED`, user: req === null || req === void 0 ? void 0 : req.userId, meta: { indexno } } });
                    // Return Password
                    res.status(200).json({ indexno });
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json(error);
            }
        });
    }
    generateEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let count = 1;
                let isNew = true;
                const { studentId } = req.body;
                const st = yield ais.student.findFirst({ where: { id: studentId } });
                if (st === null || st === void 0 ? void 0 : st.instituteEmail) {
                    yield ais.user.updateMany({ where: { tag: studentId }, data: { username: st === null || st === void 0 ? void 0 : st.instituteEmail } });
                    throw ("mail already exists !");
                }
                let username = `${(_a = st === null || st === void 0 ? void 0 : st.fname) === null || _a === void 0 ? void 0 : _a.replaceAll(' ', '')}.${st === null || st === void 0 ? void 0 : st.lname}`.toLowerCase();
                while (isNew) {
                    const ck = yield ais.student.findFirst({ where: { instituteEmail: { startsWith: `${username}${count > 1 ? count : ''}` } } });
                    if (ck)
                        count = count + 1;
                    else
                        isNew = false;
                }
                // Update Student Email
                const instituteEmail = `${username}@${process.env.UMS_MAIL}`;
                const resp = yield ais.student.update({ where: { id: studentId }, data: { instituteEmail } });
                if (resp) {
                    // Update SSO User
                    yield ais.user.updateMany({ where: { tag: studentId }, data: { username: instituteEmail } });
                    // Log Login Response
                    yield ais.log.create({ data: { action: `STUDENT_EMAIL_GENERATED`, user: req === null || req === void 0 ? void 0 : req.userId, meta: { instituteEmail } } });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json(error);
            }
        });
    }
    postStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { titleId, programId, countryId, regionId, religionId, disabilityId, majorId } = req.body;
                delete req.body.titleId;
                delete req.body.programId;
                delete req.body.countryId;
                delete req.body.regionId;
                delete req.body.religionId;
                delete req.body.disabilityId;
                delete req.body.majorId;
                //if (req.body.entryDate) req.body.entryDate = moment(req.body.entryDate).toDate;
                req.body.indexno = !req.body.indexno ? null : req.body.indexno;
                req.body.completeType = !req.body.completeType ? null : req.body.completeType;
                //req.body.entryDate  = !req.body.entryDate ? null : moment(req.body.entryDate).toDate();
                if (req.body.entryDate)
                    req.body.entryDate = new Date(req.body.entryDate);
                if (req.body.dob)
                    req.body.dob = new Date(req.body.dob);
                const resp = yield ais.student.create({
                    data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), programId && ({ program: { connect: { id: programId } } })), titleId && ({ title: { connect: { id: titleId } } })), countryId && ({ country: { connect: { id: countryId } } })), regionId && ({ region: { connect: { id: regionId } } })), religionId && ({ religion: { connect: { id: religionId } } })), disabilityId && ({ disability: { connect: { id: disabilityId } } })), majorId && majorId == 'NONE' && ({ major: { disconnect: true } })), majorId && majorId != 'NONE' && ({ major: { connect: { id: majorId } } }))
                });
                if (resp) {
                    // Log Login Response
                    yield ais.log.create({
                        data: {
                            action: `STUDENT_CREATED`, user: req === null || req === void 0 ? void 0 : req.userId, meta: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), programId && ({ program: { connect: { id: programId } } })), titleId && ({ title: { connect: { id: titleId } } })), countryId && ({ country: { connect: { id: countryId } } })), regionId && ({ region: { connect: { id: regionId } } })), religionId && ({ religion: { connect: { id: religionId } } })), disabilityId && ({ disability: { connect: { id: disabilityId } } })), majorId && majorId == 'NONE' && ({ major: { disconnect: true } })), majorId && majorId != 'NONE' && ({ major: { connect: { id: majorId } } }))
                        }
                    });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { titleId, programId, countryId, regionId, religionId, disabilityId, majorId, instituteEmail, indexno } = req.body;
                delete req.body.titleId;
                delete req.body.programId;
                delete req.body.countryId;
                delete req.body.regionId;
                delete req.body.religionId;
                delete req.body.disabilityId;
                delete req.body.majorId;
                // delete req.body.dob;
                // delete req.body.indexno;
                req.body.completeType = !req.body.completeType ? null : req.body.completeType;
                if (indexno != undefined)
                    req.body.indexno = !req.body.indexno ? null : req.body.indexno;
                if (req.body.entryDate)
                    req.body.entryDate = new Date(req.body.entryDate);
                if (req.body.dob)
                    req.body.dob = new Date(req.body.dob);
                const resp = yield ais.student.update({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), programId && ({ program: { connect: { id: programId } } })), titleId && ({ title: { connect: { id: titleId } } })), countryId && ({ country: { connect: { id: countryId } } })), regionId && ({ region: { connect: { id: regionId } } })), religionId && ({ religion: { connect: { id: religionId } } })), disabilityId && ({ disability: { connect: { id: disabilityId } } })), majorId && majorId == 'NONE' && ({ major: { disconnect: true } })), majorId && majorId != 'NONE' && ({ major: { connect: { id: majorId } } }))
                });
                if (resp) {
                    // Update Email as tag in sso_user
                    if (instituteEmail)
                        yield ais.user.updateMany({ where: { tag: (0, paramStr_1.paramStr)(req.params.id) }, data: { username: instituteEmail } });
                    // Log Login Response
                    yield ais.log.create({
                        data: {
                            action: `STUDENT_UPDATED`, user: req === null || req === void 0 ? void 0 : req.userId, meta: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), programId && ({ program: { connect: { id: programId } } })), titleId && ({ title: { connect: { id: titleId } } })), countryId && ({ country: { connect: { id: countryId } } })), regionId && ({ region: { connect: { id: regionId } } })), religionId && ({ religion: { connect: { id: religionId } } })), disabilityId && ({ disability: { connect: { id: disabilityId } } })), majorId && majorId == 'NONE' && ({ major: { disconnect: true } })), majorId && majorId != 'NONE' && ({ major: { connect: { id: majorId } } }))
                        }
                    });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.student.delete({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    // Log Response
                    yield ais.log.create({ data: { action: `STUDENT_DELETED`, user: req === null || req === void 0 ? void 0 : req.userId, meta: resp } });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    publishStudentTranscript(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body.assessmentId);
                const resp = yield ais.$executeRaw `update ais_assessment set status = 1 where id = ${(0, paramStr_1.paramStr)(req.body.assessmentId)} and totalScore is not null`;
                if (resp) {
                    // Log Response
                    yield ais.log.create({ data: { action: `ASSESSMENT_PUBLISHED`, user: req === null || req === void 0 ? void 0 : req.userId, meta: resp } });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteStudentTranscript(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.assessment.delete({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    // Log Response
                    yield ais.log.create({ data: { action: `ASSESSMENT_DELETED`, user: req === null || req === void 0 ? void 0 : req.userId, meta: resp } });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Courses */
    fetchCourseList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.course.findMany({ where: { status: true }, orderBy: { title: 'asc' } });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchCourses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { title: { contains: keyword } },
                                { id: { contains: keyword } },
                            ],
                        }
                    };
                const resp = yield ais.$transaction([
                    ais.course.count(Object.assign({}, (searchCondition))),
                    ais.course.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize) }))
                ]);
                //if(resp && resp[1]?.length){
                res.status(200).json({
                    totalPages: (_a = Math.ceil(resp[0] / pageSize)) !== null && _a !== void 0 ? _a : 0,
                    totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                    data: resp[1],
                });
                //} else {
                //res.status(202).json({ message: `no records found` })
                //}
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.course.findUnique({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.course.create({
                    data: Object.assign({}, req.body),
                });
                if (resp) {
                    // Log Login Response
                    yield ais.log.create({ data: { action: `COURSE_CREATED`, user: req === null || req === void 0 ? void 0 : req.userId, meta: req.body } });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.course.update({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    data: Object.assign({}, req.body)
                });
                if (resp) {
                    // Log Login Response
                    yield ais.log.create({ data: { action: `COURSE_UPDATED`, user: req === null || req === void 0 ? void 0 : req.userId, meta: req.body } });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteCourse(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.course.delete({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    // Log Login Response
                    yield ais.log.create({ data: { action: `COURSE_DELETED`, user: req === null || req === void 0 ? void 0 : req.userId, meta: resp } });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Structure & Curriculum */
    fetchCurriculums(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { courseId: { contains: keyword } },
                                { unit: { title: { contains: keyword } } },
                                { program: { longName: { contains: keyword } } },
                                { course: { title: { contains: keyword } } },
                            ],
                        }
                    };
                const resp = yield ais.$transaction([
                    ais.structure.count(Object.assign({}, (searchCondition))),
                    ais.structure.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize), include: {
                            unit: { select: { title: true } },
                            program: { select: { longName: true } },
                            course: { select: { title: true } },
                        } }))
                ]);
                //if(resp && resp[1]?.length){
                res.status(200).json({
                    totalPages: (_a = Math.ceil(resp[0] / pageSize)) !== null && _a !== void 0 ? _a : 0,
                    totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                    data: resp[1],
                });
                // } else {
                //   res.status(202).json({ message: `no records found` })
                // }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchCurriculumList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.structure.findMany({
                    where: { status: true },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchCurriculum(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.structure.findUnique({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postCurriculum(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { unitId, programId, courseId, majorId } = req.body;
                delete req.body.courseId;
                delete req.body.programId;
                delete req.body.unitId;
                delete req.body.majorId;
                const resp = yield ais.structure.create({
                    data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), programId && ({ program: { connect: { id: programId } } })), courseId && ({ course: { connect: { id: courseId } } })), unitId && ({ unit: { connect: { id: unitId } } })), majorId && ({ major: { connect: { id: majorId } } }))
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateCurriculum(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { unitId, programId, courseId, majorId } = req.body;
                delete req.body.courseId;
                delete req.body.programId;
                delete req.body.unitId;
                delete req.body.majorId;
                const resp = yield ais.structure.update({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), programId && ({ program: { connect: { id: programId } } })), courseId && ({ course: { connect: { id: courseId } } })), unitId && ({ unit: { connect: { id: unitId } } })), majorId && ({ major: { connect: { id: majorId } } }))
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteCurriculum(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.structure.delete({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Schemes */
    fetchSchemes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { title: { contains: keyword } },
                            ],
                        }
                    };
                const resp = yield ais.$transaction([
                    ais.scheme.count(Object.assign({}, (searchCondition))),
                    ais.scheme.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize), include: {
                            _count: {
                                select: { program: true }
                            }
                        } }))
                ]);
                //if(resp && resp[1]?.length){
                res.status(200).json({
                    totalPages: (_a = Math.ceil(resp[0] / pageSize)) !== null && _a !== void 0 ? _a : 0,
                    totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                    data: resp[1],
                });
                //} else {
                //res.status(202).json({ message: `no records found` })
                //}
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchSchemeList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.scheme.findMany({
                    where: { status: true },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchScheme(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.scheme.findUnique({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    include: { program: true }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postScheme(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const resp = yield ais.scheme.create({
                    data: Object.assign({}, req.body),
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateScheme(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const resp = yield ais.scheme.update({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    data: Object.assign({}, req.body)
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteScheme(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.scheme.delete({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Registrations */
    fetchRegistrationList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.activityRegister.findMany({
                    where: { session: { default: true } },
                    orderBy: { createdAt: 'desc' },
                    include: {
                        student: {
                            select: {
                                fname: true, mname: true, lname: true,
                                semesterNum: true, id: true,
                                program: { select: { longName: true } }
                            }
                        }
                    }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchRegistrations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            session: { default: true },
                            OR: [
                                { indexno: { contains: keyword } },
                                { student: { fname: { contains: keyword } } },
                                { student: { mname: { contains: keyword } } },
                                { student: { lname: { contains: keyword } } },
                                { student: { id: { contains: keyword } } },
                                { student: { program: { longName: { contains: keyword } } } },
                                { session: { title: { contains: keyword } } },
                            ],
                        }
                    };
                const resp = yield ais.$transaction([
                    ais.activityRegister.count(Object.assign({}, (searchCondition))),
                    ais.activityRegister.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize), orderBy: { createdAt: 'desc' }, include: {
                            student: {
                                select: {
                                    fname: true, mname: true, lname: true, indexno: true,
                                    semesterNum: true, id: true, gender: true,
                                    program: { select: { longName: true } },
                                }
                            },
                            session: { select: { title: true, tag: true } },
                        } }))
                ]);
                //if(resp && resp[1]?.length){
                res.status(200).json({
                    totalPages: (_a = Math.ceil(resp[0] / pageSize)) !== null && _a !== void 0 ? _a : 0,
                    totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                    data: resp[1],
                });
                // } else {
                //    res.status(202).json({ message: `no records found` })
                // }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchRegistration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let resp = [];
                const st = yield ais.student.findUnique({
                    where: { id: (0, paramStr_1.paramStr)(req.params.indexno) },
                    select: { id: true, indexno: true, fname: true, mname: true, lname: true, gender: true, semesterNum: true, program: { select: { longName: true, department: true } } },
                });
                if (st) {
                    // Get Active Sessions Info
                    const sessions = yield ais.session.findMany({ where: { default: true } });
                    const session = sessions.find((row) => { var _a, _b; return ((0, moment_1.default)(st === null || st === void 0 ? void 0 : st.entryDate).format("MM") == '01' && (st === null || st === void 0 ? void 0 : st.semesterNum) <= 2) ? ((_a = row === null || row === void 0 ? void 0 : row.tag) === null || _a === void 0 ? void 0 : _a.toUpperCase()) == 'SUB' : ((_b = row === null || row === void 0 ? void 0 : row.tag) === null || _b === void 0 ? void 0 : _b.toUpperCase()) == 'MAIN'; });
                    // Assessment 
                    // resp = await ais.assessment.findMany({
                    //    include: {
                    //       course: { select: { title: true, creditHour: true } },
                    //       // student: { select: { id: true, indexno: true, fname: true, mname: true, lname: true, gender: true, semesterNum: true, program: { select: { longName: true, department: true }} }},
                    //       session: { select: { title: true } },
                    //    },
                    //    where: {
                    //       indexno: st?.indexno,
                    //       session: { default: true }
                    //    },
                    // });
                    resp = yield ais.assessment.findMany({
                        include: {
                            course: { select: { title: true, creditHour: true } },
                            session: { select: { title: true } },
                        },
                        where: {
                            indexno: st === null || st === void 0 ? void 0 : st.indexno,
                            sessionId: session === null || session === void 0 ? void 0 : session.id
                        },
                    });
                }
                // Resit Courses
                const resits = yield ais.resit.findMany({
                    where: {
                        indexno: (0, paramStr_1.paramStr)(req.params.indexno),
                        registerSession: { default: true }
                    },
                    select: {
                        course: { select: { title: true, creditHour: true } },
                        registerSession: { select: { title: true } },
                        courseId: true
                    }
                });
                if (resits.length) {
                    for (let rs of resits)
                        resp.push({ course: rs.course, session: rs.registerSession, courseId: rs.courseId, type: 'R' });
                }
                if (resp) {
                    // Add Student Bio
                    resp = resp.map((r) => (Object.assign(Object.assign({}, r), { student: st })));
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchRegistrationMount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            try {
                const courses = [];
                const id = (0, paramStr_1.paramStr)(req.params.indexno);
                // Get Student Info
                const student = yield ais.student.findUnique({ include: { program: { select: { schemeId: true, hasMajor: true } } }, where: { id } });
                const indexno = student === null || student === void 0 ? void 0 : student.indexno;
                // Get Active Sessions Info
                const sessions = yield ais.session.findMany({ where: { default: true } });
                // console.log("sessions: ", sessions);
                // Get Session, for AUCC Only
                // const session: any = sessions.find((row: any) => (moment(student?.entryDate).format("MM") == '01' && student?.semesterNum <= 2) ? row?.tag?.toUpperCase() == 'SUB' : row?.tag?.toUpperCase() == 'MAIN');
                // NB: Entry Year 1 for January Stream joins September Stream in Year 2 and Entry Year 2 for January Stream joins September Stream in Year 3
                const session = sessions.find((row) => {
                    var _a;
                    const streamTag = ((0, moment_1.default)(student === null || student === void 0 ? void 0 : student.entryDate).format("MM") == '01' && (((student === null || student === void 0 ? void 0 : student.entrySemesterNum) == 1 && ['1', '2'].includes(student === null || student === void 0 ? void 0 : student.semesterNum)) || ((student === null || student === void 0 ? void 0 : student.entrySemesterNum) == 3 && ['3', '4'].includes(student === null || student === void 0 ? void 0 : student.semesterNum)))) ? 'SUB' : 'MAIN';
                    return ((_a = row === null || row === void 0 ? void 0 : row.tag) === null || _a === void 0 ? void 0 : _a.toUpperCase()) == streamTag;
                });
                // Get Session, for MLK Only
                // const session:any = sessions[0];
                // console.log("Session: ", session?.tag);
                // console.log("Registration Stream: ", moment(student?.entryDate).format("MM"));
                // console.log("Registration Stream: ", ['01','09'].includes(moment(student?.entryDate).format("MM") ? 'Stream Passed':'Issue with Stream / Entry Month'));
                // console.log("Registration SemesterNum: ", student?.semesterNum);
                // Get Normal Courses with/without Majors
                const maincourses = yield ais.structure.findMany({
                    include: { course: { select: { title: true, creditHour: true } }, major: { select: { shortName: true } } },
                    where: {
                        semesterNum: student === null || student === void 0 ? void 0 : student.semesterNum,
                        programId: student === null || student === void 0 ? void 0 : student.programId,
                    },
                    orderBy: { type: 'asc' }
                });
                // Meta & Instructions
                const meta = yield ais.structmeta.findFirst({
                    where: { programId: student === null || student === void 0 ? void 0 : student.programId, majorId: student === null || student === void 0 ? void 0 : student.majorId, semesterNum: student === null || student === void 0 ? void 0 : student.semesterNum },
                });
                //### Current Posted Bill 
                // const groupCode = await getBillCodePrisma(student?.semesterNum);
                // const bill = await ais.bill.findFirst({
                //    where: {
                //       programId: student?.programId, sessionId: session?.id, residentialStatus: student?.residentialStatus || 'RESIDENTIAL',
                //       OR: groupCode,
                //    },
                // })
                // const meta:any = []
                if (student && maincourses.length) {
                    for (const course of maincourses) {
                        const isAdded = courses.find((c) => c.code == course.courseId);
                        if (!isAdded)
                            courses.push(Object.assign({ code: course.courseId, course: (_a = course === null || course === void 0 ? void 0 : course.course) === null || _a === void 0 ? void 0 : _a.title, credit: (_b = course === null || course === void 0 ? void 0 : course.course) === null || _b === void 0 ? void 0 : _b.creditHour, type: course === null || course === void 0 ? void 0 : course.type, lock: course === null || course === void 0 ? void 0 : course.lock, sessionId: session === null || session === void 0 ? void 0 : session.id, schemeId: (_c = student === null || student === void 0 ? void 0 : student.program) === null || _c === void 0 ? void 0 : _c.schemeId, semesterNum: student === null || student === void 0 ? void 0 : student.semesterNum, indexno }, course.majorId && ({ major: (_d = course === null || course === void 0 ? void 0 : course.major) === null || _d === void 0 ? void 0 : _d.shortName })));
                    }
                }
                // Get Resit Courses
                const resitcourses = yield ais.resit.findMany({
                    include: { course: { select: { title: true, creditHour: true } } },
                    where: {
                        indexno, taken: false, trailSession: { semester: session === null || session === void 0 ? void 0 : session.semesterNum },
                    }
                });
                if (student && resitcourses.length) {
                    for (const course of resitcourses) {
                        const isAdded = courses.find((c) => c.code == course.courseId);
                        if (!isAdded)
                            courses.push(Object.assign({ code: course.courseId, course: (_e = course === null || course === void 0 ? void 0 : course.course) === null || _e === void 0 ? void 0 : _e.title, credit: (_f = course === null || course === void 0 ? void 0 : course.course) === null || _f === void 0 ? void 0 : _f.creditHour, type: 'R', lock: false, sessionId: session.id, schemeId: (_g = student === null || student === void 0 ? void 0 : student.program) === null || _g === void 0 ? void 0 : _g.schemeId, semesterNum: student.semesterNum, indexno }, course.majorId && ({ major: (_h = course === null || course === void 0 ? void 0 : course.major) === null || _h === void 0 ? void 0 : _h.shortName })));
                    }
                }
                // Conditions
                let condition = true; // Allow Registration
                let message; // Reason attached
                /*
                   // Check for Exceeded Credit Hours - After
                   // If No courses are not selected! - After
                   // Check whether Total Number of Electives are chosen - After
                   
                   // If student Doesnt Have an Index Number - Before
                      if(!student?.indexno) { condition = false; message = "No Index Number for Student!" }
                   // If Semester Level or Program ID or Major  ID is not Updated, Block Registration - Before
                      if(!student?.programId || (student.program.hasMajor && !student.majorId) || !student?.semesterNum) { condition = false; message = "No Major or Program or Level Set!" }
                   // If Student is Owing Fees, Lock Registration - Before
                      if(student?.accountNet > 0 && student?.accountNet < (Bill amount * Payment Percentage )) { condition = false; message = "No Index Number for Student!" }
                   // If Student is Pardoned by Finance, Allow Registration - Before
                   // If Registration Period is Inactive - Before
                   // If Registration Period is Active and Halt status is ON - Before
                   // If Registration Period is Extended for Late Finers - Before
                */
                // Check for Exceeded Credit Hours - After
                // If No courses are not selected! - After
                // Check whether Total Number of Electives are chosen - After
                // If student Doesnt Have an Index Number - Before
                if (!(student === null || student === void 0 ? void 0 : student.indexno)) {
                    condition = false;
                    message = "No Index Number for Student!";
                }
                // If Semester Level or Program ID or (Major  ID for Year 3,4) is not Updated, Block Registration - Before
                if (!(student === null || student === void 0 ? void 0 : student.programId) || (student.program.hasMajor && student.semesterNum > 4 && !student.majorId) || !(student === null || student === void 0 ? void 0 : student.semesterNum)) {
                    condition = false;
                    message = "No Major or Program or Level Set!";
                }
                // If Student is Owing Fees, Lock Registration - Before
                // if(student?.accountNet > 0 && student?.accountNet < (Bill amount * Payment Percentage )) { condition = false; message = "No Index Number for Student!" }
                // If Student is Pardoned by Finance, Allow Registration - Before
                // If Registration Period is Inactive - Before
                // If Registration Period is Active and Halt status is ON - Before
                // If Registration Period is Extended for Late Finers - Before
                if (courses === null || courses === void 0 ? void 0 : courses.length) {
                    res.status(200).json({ session: session === null || session === void 0 ? void 0 : session.title, courses, meta, condition, message, registerStart: session === null || session === void 0 ? void 0 : session.registerStart, registerEnd: session === null || session === void 0 ? void 0 : session.registerEnd, registerEndLate: session === null || session === void 0 ? void 0 : session.registerEndLate });
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(202).json({ message: error.message });
            }
        });
    }
    postRegistration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = req.body;
                const data = [], rdata = [];
                // Get Active Sessions Info
                const st = yield ais.student.findFirst({ include: { program: { select: { schemeId: true, hasMajor: true } } }, where: { indexno: courses[0].indexno } });
                const sessions = yield ais.session.findMany({ where: { default: true } });
                const session = sessions.find((row) => { var _a, _b; return ((0, moment_1.default)(st === null || st === void 0 ? void 0 : st.entryDate).format("MM") == '01' && (st === null || st === void 0 ? void 0 : st.semesterNum) <= 2) ? ((_a = row === null || row === void 0 ? void 0 : row.tag) === null || _a === void 0 ? void 0 : _a.toUpperCase()) == 'SUB' : ((_b = row === null || row === void 0 ? void 0 : row.tag) === null || _b === void 0 ? void 0 : _b.toUpperCase()) == 'MAIN'; });
                // Check If Registration Data exists
                const slip = yield ais.assessment.findFirst({ where: { indexno: courses[0].indexno, sessionId: session.id } });
                if (slip)
                    throw ("Registration already submitted!");
                const resitcourses = courses.filter((row) => row.type == 'R');
                const maincourses = courses.filter((row) => row.type != 'R');
                if (maincourses.length) {
                    for (const course of maincourses) {
                        data.push({
                            courseId: course.code,
                            sessionId: course.sessionId,
                            schemeId: course.schemeId,
                            credit: course.credit,
                            semesterNum: course.semesterNum,
                            indexno: course.indexno,
                            // totalScore: 0,
                            type: 'N'
                        });
                    }
                }
                if (resitcourses === null || resitcourses === void 0 ? void 0 : resitcourses.length) {
                    // Resit Session Info
                    const rsession = yield ais.resitSession.findFirst({ where: { default: true } });
                    // Save Resit Registration
                    for (const course of resitcourses) {
                        const ups = yield ais.resit.updateMany({
                            where: {
                                indexno: course === null || course === void 0 ? void 0 : course.indexno,
                                courseId: course === null || course === void 0 ? void 0 : course.code,
                                taken: false,
                                paid: true
                            },
                            data: {
                                resitSessionId: rsession.id,
                                registerSessionId: course === null || course === void 0 ? void 0 : course.sessionId
                                //registerSession: { connect: { id: course?.sessionId }},
                                //... rsession && ({ session: { connect: { id:rsession?.id }} }),
                                //taken: true  - Only when Resit Exam is taken
                            }
                        });
                        if (ups)
                            rdata.push(ups);
                    }
                }
                // Log Registration
                const isLogged = yield ais.activityRegister.findFirst({
                    where: {
                        indexno: maincourses[0].indexno,
                        sessionId: maincourses[0].sessionId
                    }
                });
                if (!isLogged)
                    yield ais.activityRegister.createMany({
                        data: [{
                                indexno: maincourses[0].indexno,
                                sessionId: maincourses[0].sessionId,
                                courses: courses === null || courses === void 0 ? void 0 : courses.length,
                                credits: courses === null || courses === void 0 ? void 0 : courses.reduce((sum, cur) => sum + cur.credit, 0),
                                semesterNum: maincourses[0].semesterNum,
                                dump: courses
                            }]
                    });
                else
                    yield ais.activityRegister.update({
                        where: { id: isLogged === null || isLogged === void 0 ? void 0 : isLogged.id },
                        data: {
                            indexno: maincourses[0].indexno,
                            sessionId: maincourses[0].sessionId,
                            courses: courses === null || courses === void 0 ? void 0 : courses.length,
                            credits: courses === null || courses === void 0 ? void 0 : courses.reduce((sum, cur) => sum + cur.credit, 0),
                            semesterNum: maincourses[0].semesterNum,
                            dump: courses
                        }
                    });
                // Save Registration Courses
                const mainresp = yield ais.assessment.createMany({ data });
                if (mainresp) {
                    res.status(200).json({ courses: mainresp, resits: rdata, totalCourses: courses.length });
                }
                else {
                    res.status(200).json({ message: `No selected courses found!` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(200).json({ message: error });
            }
        });
    }
    updateRegistration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const indexno = (0, paramStr_1.paramStr)(req.params.indexno);
                const courses = req.body;
                const data = [], rdata = [];
                const resitcourses = courses.filter((row) => row.type == 'R');
                const maincourses = courses.filter((row) => row.type != 'R');
                if (maincourses.length) {
                    for (const course of maincourses) {
                        data.push({
                            courseId: course.courseId,
                            sessionId: course.sessionId,
                            schemeId: course.schemeId,
                            credit: course.credit,
                            semesterNum: course.semesterNum,
                            indexno,
                            // totalScore: 0
                        });
                    }
                }
                if (resitcourses.length) {
                    for (const course of resitcourses) {
                        const ups = yield ais.resit.updateMany({
                            where: {
                                indexno,
                                courseId: course.courseId,
                                taken: false
                            },
                            data: {
                                registerSessionId: course.sessionId,
                                resitSessionId: course.sessionId,
                                //taken: true
                            }
                        });
                        if (ups)
                            rdata.push(ups);
                    }
                }
                const mainresp = yield ais.assessment.createMany({ data });
                if (mainresp) {
                    res.status(200).json({ courses: mainresp, resits: rdata });
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteRegistration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const { data } =  req.body;
                // if(data?.length){
                // }
                // Delete Courses Registration
                const resp = yield ais.assessment.deleteMany({
                    where: {
                        indexno: (0, paramStr_1.paramStr)(req.params.indexno),
                        session: { default: true }
                    }
                });
                // Delete Registration Log
                const log = yield ais.activityRegister.deleteMany({
                    where: {
                        indexno: (0, paramStr_1.paramStr)(req.params.indexno),
                        session: { default: true }
                    }
                });
                // Reset Resit Registration
                const resit = yield ais.resit.updateMany({
                    where: {
                        indexno: (0, paramStr_1.paramStr)(req.params.indexno),
                        registerSession: { default: true }
                    },
                    data: {
                        taken: false,
                        resitSessionId: null,
                        registerSessionId: null,
                    }
                });
                if (resp === null || resp === void 0 ? void 0 : resp.count) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `Registration not deleted` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* programs */
    fetchProgramList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.program.findMany({
                    where: { status: true },
                    include: {
                        department: { select: { title: true } },
                    },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchPrograms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 6, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { code: { contains: keyword } },
                                { shortName: { contains: keyword } },
                                { longName: { contains: keyword } },
                                { prefix: { contains: keyword } },
                            ],
                        }
                    };
                const resp = yield ais.$transaction([
                    ais.program.count(Object.assign({}, (searchCondition))),
                    ais.program.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize), include: {
                            department: { select: { title: true } },
                            student: { select: { _count: true } }
                        } }))
                ]);
                //if(resp && resp[1]?.length){
                res.status(200).json({
                    totalPages: (_a = Math.ceil(resp[0] / pageSize)) !== null && _a !== void 0 ? _a : 0,
                    totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                    data: resp[1],
                });
                //} else {
                //res.status(202).json({ message: `no records found` })
                //}
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchProgram(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.program.findUnique({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    include: {
                        department: { select: { title: true } },
                        student: { select: { _count: true } }
                    }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchProgramStructure(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                const resp = yield ais.program.findUnique({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    include: {
                        structure: {
                            select: {
                                id: true,
                                type: true,
                                semesterNum: true,
                                course: { select: { title: true, creditHour: true, id: true, practicalHour: true, theoryHour: true } }
                            },
                            orderBy: [{ semesterNum: 'asc' }, { type: 'asc' },]
                        },
                        structmeta: {
                            select: {
                                id: true,
                                minCredit: true,
                                maxCredit: true,
                                maxElectiveNum: true,
                                semesterNum: true,
                                major: { select: { longName: true } }
                            },
                            orderBy: { semesterNum: 'asc' }
                        }
                    },
                });
                if ((_a = resp === null || resp === void 0 ? void 0 : resp.structure) === null || _a === void 0 ? void 0 : _a.length) {
                    var mdata = new Map(), sdata = new Map();
                    for (const sv of resp === null || resp === void 0 ? void 0 : resp.structure) {
                        const index = `LEVEL ${Math.ceil(sv.semesterNum / 2) * 100}, ${sv.semesterNum % 2 == 0 ? 'SEMESTER 2' : 'SEMESTER 1'}` || 'none';
                        const zd = Object.assign(Object.assign({}, sv), { course: (_b = sv === null || sv === void 0 ? void 0 : sv.course) === null || _b === void 0 ? void 0 : _b.title, code: (_c = sv === null || sv === void 0 ? void 0 : sv.course) === null || _c === void 0 ? void 0 : _c.id, credit: (_d = sv === null || sv === void 0 ? void 0 : sv.course) === null || _d === void 0 ? void 0 : _d.creditHour, practical: (_e = sv === null || sv === void 0 ? void 0 : sv.course) === null || _e === void 0 ? void 0 : _e.practicalHour, theory: (_f = sv === null || sv === void 0 ? void 0 : sv.course) === null || _f === void 0 ? void 0 : _f.theoryHour, type: sv === null || sv === void 0 ? void 0 : sv.type });
                        // Data By Level - Semester
                        if (mdata.has(index)) {
                            mdata.set(index, [...mdata.get(index), Object.assign({}, zd)]);
                        }
                        else {
                            mdata.set(index, [Object.assign({}, zd)]);
                        }
                    }
                    for (const sv of resp === null || resp === void 0 ? void 0 : resp.structmeta) {
                        const index = `LEVEL ${Math.ceil(sv.semesterNum / 2) * 100}, ${sv.semesterNum % 2 == 0 ? 'SEMESTER 2' : 'SEMESTER 1'}` || 'none';
                        const zd = Object.assign({}, sv);
                        // Data By Level - Semester
                        if (sdata.has(index)) {
                            sdata.set(index, [...sdata.get(index), Object.assign({}, zd)]);
                        }
                        else {
                            sdata.set(index, [Object.assign({}, zd)]);
                        }
                    }
                    console.log(Object.fromEntries(sdata));
                    res.status(200).json({ data: Array.from(mdata), meta: Object.fromEntries(sdata) });
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchProgramStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const resp = yield ais.program.findUnique({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    include: {
                        student: {
                            where: { completeStatus: false },
                            select: {
                                id: true,
                                indexno: true,
                                fname: true,
                                mname: true,
                                lname: true,
                                gender: true,
                                semesterNum: true,
                                residentialStatus: true,
                                deferStatus: true,
                                program: { select: { shortName: true, longName: true } }
                            },
                            orderBy: { semesterNum: 'asc' }
                        }
                    },
                });
                if ((_a = resp === null || resp === void 0 ? void 0 : resp.student) === null || _a === void 0 ? void 0 : _a.length) {
                    var mdata = new Map();
                    for (const sv of resp === null || resp === void 0 ? void 0 : resp.student) {
                        const index = `LEVEL ${Math.ceil(sv.semesterNum / 2) * 100}` || 'none';
                        const zd = Object.assign({}, sv);
                        // Data By Level - Semester
                        if (mdata.has(index)) {
                            mdata.set(index, [...mdata.get(index), Object.assign({}, zd)]);
                        }
                        else {
                            mdata.set(index, [Object.assign({}, zd)]);
                        }
                    }
                    res.status(200).json(Array.from(mdata));
                }
                else {
                    res.status(200).json([]);
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchProgramStatistics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.program.findUnique({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    include: {
                        department: { select: { title: true } },
                    }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postProgram(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { unitId, schemeId } = req.body;
                delete req.body.schemeId;
                delete req.body.unitId;
                const resp = yield ais.program.create({
                    data: Object.assign(Object.assign(Object.assign({}, req.body), unitId && ({ department: { connect: { id: unitId } } })), schemeId && ({ scheme: { connect: { id: schemeId } } }))
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateProgram(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { unitId, schemeId } = req.body;
                delete req.body.schemeId;
                delete req.body.unitId;
                const resp = yield ais.program.update({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    data: Object.assign(Object.assign(Object.assign({}, req.body), unitId && ({ department: { connect: { id: unitId } } })), schemeId && ({ scheme: { connect: { id: schemeId } } }))
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteProgram(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.program.delete({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Majors */
    fetchMajorList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.major.findMany({
                    where: { status: true },
                    include: {
                        program: { select: { shortName: true } },
                    },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Departments */
    fetchDepartments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.unit.findMany({
                    where: { status: true, levelNum: 2, type: 'ACADEMIC' },
                    include: {
                        level1: { select: { title: true, code: true } },
                        _count: {
                            select: {
                                staff: true,
                                program: true
                            }
                        },
                    },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Faculties */
    fetchFaculties(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.unit.findMany({
                    where: { status: true, levelNum: 1, type: 'ACADEMIC' },
                    include: {
                        levelI: { select: { _count: { select: { program: true } } } },
                        _count: {
                            select: {
                                staff: true,
                                levelI: true
                            }
                        },
                    },
                    orderBy: {}
                });
                console.log("Faculties: ", resp);
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Units */
    fetchUnits(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { page = 1, pageSize = 6, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { title: { contains: keyword } },
                                { code: { contains: keyword } },
                                { headStaffNo: { contains: keyword } },
                            ],
                        },
                        //include: { level1: true },
                        //   orderBy: { createdAt: 'asc'}
                    };
                const resp = yield ais.$transaction([
                    ais.unit.count(Object.assign({}, (searchCondition))),
                    ais.unit.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize) }))
                ]);
                if (resp && ((_a = resp[1]) === null || _a === void 0 ? void 0 : _a.length)) {
                    res.status(200).json({
                        totalPages: (_b = Math.ceil(resp[0] / pageSize)) !== null && _b !== void 0 ? _b : 0,
                        totalData: (_c = resp[1]) === null || _c === void 0 ? void 0 : _c.length,
                        data: resp[1],
                    });
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchUnitList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.unit.findMany({
                    where: { status: true },
                    include: { level1: true },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchUnit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.unit.findUnique({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    include: { level1: true },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postUnit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { level1Id } = req.body;
                delete req.body.level1Id;
                const resp = yield ais.unit.create({
                    data: Object.assign(Object.assign({}, req.body), level1Id && ({ level1: { connect: { id: level1Id } } })),
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateUnit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { level1Id, headStaffNo: newHead } = req.body;
                delete req.body.level1Id;
                const unit = yield ais.unit.findFirst({ where: { id: (0, paramStr_1.paramStr)(req.params.id) } });
                const resp = yield ais.unit.update({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    data: Object.assign(Object.assign(Object.assign({}, req.body), level1Id && ({ level1: { connect: { id: level1Id } } })), !level1Id && ({ level1: { disconnect: true } }))
                });
                if (resp) {
                    // Stage Head or Dean of Unit
                    if (['ACADEMIC'].includes(unit === null || unit === void 0 ? void 0 : unit.type) && newHead && newHead != unit.headStaffNo) {
                        //###### NEW HEAD/DEAN ####//
                        // Update Role of New Head or Dean
                        let userId;
                        const nrole = yield ais.userRole.findFirst({
                            where: {
                                user: { tag: newHead },
                                appRole: { id: { in: [1, 2, 3, 4, 5, 6, 13, 14, 15, 16] } }
                            }
                        });
                        if (nrole) {
                            userId = nrole.userId;
                            // Remove AIS Roles
                            yield ais.userRole.deleteMany({
                                where: {
                                    user: { tag: newHead },
                                    appRole: { id: { in: [1, 2, 3, 4, 5, 6, 13, 14, 15, 16] } }
                                }
                            });
                        }
                        else {
                            const user = yield ais.user.findFirst({ where: { tag: newHead } });
                            if (user)
                                userId = user.id;
                        }
                        if ((unit === null || unit === void 0 ? void 0 : unit.levelNum) == 1) {
                            yield ais.userRole.create({
                                data: {
                                    userId,
                                    appRoleId: 4,
                                    roleMeta: unit === null || unit === void 0 ? void 0 : unit.id
                                }
                            });
                        }
                        else {
                            yield ais.userRole.create({
                                data: {
                                    userId,
                                    appRoleId: 3,
                                    roleMeta: unit === null || unit === void 0 ? void 0 : unit.id
                                }
                            });
                        }
                        // ###### OLD HEAD/DEAN ###### //
                        if (unit === null || unit === void 0 ? void 0 : unit.headStaffNo) {
                            const orole = yield ais.userRole.findFirst({
                                where: {
                                    user: { tag: unit === null || unit === void 0 ? void 0 : unit.headStaffNo },
                                    appRole: { id: { in: [1, 2, 3, 4, 5, 6, 13, 14, 15, 16] } }
                                }
                            });
                            if (orole) {
                                // Remove AIS Roles
                                yield ais.userRole.deleteMany({
                                    where: {
                                        user: { tag: unit === null || unit === void 0 ? void 0 : unit.headStaffNo },
                                        appRole: { id: { in: [1, 2, 3, 4, 5, 6, 13, 14, 15, 16] } }
                                    }
                                });
                                // Create Assessor Role
                                yield ais.userRole.create({
                                    data: {
                                        userId: orole === null || orole === void 0 ? void 0 : orole.userId,
                                        appRoleId: 1,
                                        roleMeta: null
                                    }
                                });
                            }
                        }
                    }
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteUnit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.unit.delete({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Jobs */
    fetchJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { page = 1, pageSize = 6, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { title: { contains: keyword } },
                                { id: { contains: keyword } },
                            ],
                        },
                        include: {
                            level1: { select: { title: true, code: true } }
                        },
                    };
                const resp = yield ais.$transaction([
                    ais.job.count(Object.assign({}, (searchCondition))),
                    ais.job.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize) }))
                ]);
                if (resp && ((_a = resp[1]) === null || _a === void 0 ? void 0 : _a.length)) {
                    res.status(200).json({
                        totalPages: (_b = Math.ceil(resp[0] / pageSize)) !== null && _b !== void 0 ? _b : 0,
                        totalData: (_c = resp[1]) === null || _c === void 0 ? void 0 : _c.length,
                        data: resp[1],
                    });
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchJobList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.job.findMany({
                    where: { status: true }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.job.findUnique({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.job.create({
                    data: Object.assign({}, req.body),
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.job.update({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    data: Object.assign({}, req.body)
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.job.delete({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Progression */
    fetchProgressions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 6, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {
                where: { session: { default: true } }
            };
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            session: { default: true },
                            OR: [
                                { indexno: { contains: keyword } },
                                { session: { title: { contains: keyword } } },
                                { student: { id: { contains: keyword } } },
                                { student: { fname: { contains: keyword } } },
                                { student: { lname: { contains: keyword } } },
                            ],
                        }
                    };
                const resp = yield ais.$transaction([
                    ais.activityProgress.count(Object.assign({}, (searchCondition))),
                    ais.activityProgress.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize), include: {
                            student: { include: { program: true } },
                            session: true
                        } }))
                ]);
                //if(resp && resp[1]?.length){
                res.status(200).json({
                    totalPages: (_a = Math.ceil(resp[0] / pageSize)) !== null && _a !== void 0 ? _a : 0,
                    totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                    data: resp[1],
                });
                // } else {
                //    res.status(202).json({ message: `no records found` })
                // }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchProgression(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.activityProgress.findUnique({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postProgression(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const { indexno } = req.body;
                delete req.body.indexno;
                // Check If Student Exist with Index number
                const st = yield ais.student.findFirst({ where: { indexno, deferStatus: false, completeStatus: false }, include: { program: { select: { semesterTotal: true } } } });
                if (!st)
                    throw ("Student can't be progressed, check indexno,defer or complete status!");
                // Fetch Active Session for Student - AUCC Only
                const session = ((st.semesterNum <= 2 && st.entrySemesterNum == 1) || (st.semesterNum <= 4 && st.entrySemesterNum == 3)) && ['01', '1'].includes((0, moment_1.default)(st.entryDate).format("MM"))
                    ? yield ais.session.findFirst({ where: { default: true, tag: 'SUB' } })
                    : yield ais.session.findFirst({ where: { default: true, tag: 'MAIN' } });
                // Fetch Active Session for Student - MLK & Others Only
                // const session = await ais.sesssion.findFirst({ where: { default: true }})
                // Check If Progressed
                const pg = yield ais.activityProgress.findFirst({ where: { indexno, sessionId: session === null || session === void 0 ? void 0 : session.id } });
                if (pg)
                    throw ("Student already progressed !");
                // Save Progression Data
                const resp = yield ais.activityProgress.create({
                    data: Object.assign(Object.assign({ semesterNum: (st.semesterNum + 1 > ((_a = st.program) === null || _a === void 0 ? void 0 : _a.semesterTotal) ? 0 : st.semesterNum + 1), status: true }, session && ({ session: { connect: { id: session === null || session === void 0 ? void 0 : session.id } } })), indexno && ({ student: { connect: { indexno } } }))
                });
                if (resp) {
                    // Update Student SemesterNum & CompleteStatus
                    yield ais.student.update({
                        where: { id: st === null || st === void 0 ? void 0 : st.id },
                        data: {
                            semesterNum: (st.semesterNum + 1 > ((_b = st.program) === null || _b === void 0 ? void 0 : _b.semesterTotal) ? 0 : st.semesterNum + 1),
                            completeStatus: (st.semesterNum + 1 > ((_c = st.program) === null || _c === void 0 ? void 0 : _c.semesterTotal) ? true : false)
                        }
                    });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(202).json({ message: error.message });
            }
        });
    }
    postAllProgression(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sessionId } = req.body;
                delete req.body.sessionId;
                // Fetch Active Session for Student
                const session = yield ais.session.findFirst({ where: { id: sessionId } });
                // AUCC only
                const students = session.tag == 'SUB'
                    ? yield ais.$queryRaw `select s.id,indexno,semesterNum,p.semesterTotal from ais_student s left join ais_program p on s.programId = p.id where (((semesterNum <= 2 and entrySemesterNum = 1) or (semesterNum <= 4 and entrySemesterNum = 3)) and date_format(entryDate,'%m') = '01') and completeStatus = 0 and deferStatus = 0 and indexno is not NULL`
                    : yield ais.$queryRaw `select s.id,indexno,semesterNum,p.semesterTotal from ais_student s left join ais_program p on s.programId = p.id where ((((semesterNum > 2 and entrySemesterNum = 1) or (semesterNum > 4 and entrySemesterNum = 3)) and date_format(entryDate,'%m') = '01') or (date_format(entryDate,'%m') <> '01') or entryDate is null) and completeStatus = 0 and deferStatus = 0 and indexno is not NULL`;
                // MLK & Others only
                // const students = await ais.$queryRaw`select indexno,semesterNum from ais_student where completeStatus = 0 and deferStatus = 0 and indexno is not NULL`;
                const resp = yield Promise.all(students.map((st) => __awaiter(this, void 0, void 0, function* () {
                    console.log("st: ", st);
                    // Check If Progressed
                    const pg = yield ais.activityProgress.findFirst({ where: { indexno: st === null || st === void 0 ? void 0 : st.indexno, sessionId: session === null || session === void 0 ? void 0 : session.id } });
                    if (pg)
                        return null;
                    // Update Student SemesterNum & CompleteStatus
                    yield ais.student.update({
                        where: { id: st === null || st === void 0 ? void 0 : st.id },
                        data: {
                            semesterNum: ((st === null || st === void 0 ? void 0 : st.semesterNum) + 1 > (st === null || st === void 0 ? void 0 : st.semesterTotal) ? 0 : Math.min(st === null || st === void 0 ? void 0 : st.semesterTotal, (st === null || st === void 0 ? void 0 : st.semesterNum) + 1)),
                            completeStatus: ((st === null || st === void 0 ? void 0 : st.semesterNum) + 1 > (st === null || st === void 0 ? void 0 : st.semesterTotal) ? true : false)
                        }
                    });
                    // Update Session Progression Status
                    yield ais.session.update({ where: { id: sessionId }, data: { progressStudent: true } });
                    // Return Response
                    return ais.activityProgress.create({
                        data: Object.assign({ student: { connect: { indexno: st.indexno } }, semesterNum: ((st === null || st === void 0 ? void 0 : st.semesterNum) + 1 > (st === null || st === void 0 ? void 0 : st.semesterTotal) ? 0 : Math.min(st === null || st === void 0 ? void 0 : st.semesterTotal, (st === null || st === void 0 ? void 0 : st.semesterNum) + 1)), status: true }, session && ({ session: { connect: { id: session === null || session === void 0 ? void 0 : session.id } } }))
                    });
                })));
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateProgression(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.activityProgress.update({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    data: Object.assign({}, req.body)
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteProgression(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.activityProgress.delete({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Sheets */
    fetchSheets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 6, keyword = '', unit = '' } = req.query;
            console.log("unit:", unit);
            const offset = (page - 1) * pageSize;
            let searchCondition = unit
                ? {
                    where: {
                        session: { OR: [{ default: true }, { assignLateSheet: true }] },
                        OR: [
                            { unit: { id: unit, levelNum: 2 } },
                            { unit: { level1Id: unit, levelNum: 2 } },
                        ]
                    },
                    orderBy: { session: { createdAt: 'desc' } }
                }
                : {
                    where: {
                        session: { OR: [{ default: true }, { assignLateSheet: true }] },
                    },
                    orderBy: { session: { createdAt: 'desc' } }
                };
            try {
                if (keyword && unit)
                    searchCondition = {
                        where: {
                            session: {
                                OR: [
                                    { default: true },
                                    { assignLateSheet: true },
                                ]
                            },
                            AND: [
                                {
                                    OR: [
                                        { id: { contains: keyword } },
                                        { courseId: { contains: keyword } },
                                        { session: { title: { contains: keyword } } },
                                        { course: { title: { contains: keyword } } },
                                        { course: { id: { contains: keyword } } },
                                        { program: { longName: { contains: keyword } } },
                                        { unit: { title: { contains: keyword }, levelNum: 2 } },
                                    ]
                                },
                                {
                                    OR: [
                                        ({ unit: { id: unit, levelNum: 2 } }),
                                        ({ unit: { level1Id: unit, levelNum: 2 } }),
                                    ]
                                }
                            ]
                        }
                    };
                else if (keyword)
                    searchCondition = {
                        where: {
                            session: {
                                OR: [
                                    { default: true },
                                    { assignLateSheet: true },
                                ]
                            },
                            OR: [
                                { id: { contains: keyword } },
                                { courseId: { contains: keyword } },
                                { session: { title: { contains: keyword } } },
                                { course: { title: { contains: keyword } } },
                                { course: { id: { contains: keyword } } },
                                { program: { longName: { contains: keyword } } },
                                { unit: { title: { contains: keyword }, levelNum: 2 } },
                            ]
                        }
                    };
                const resp = yield ais.$transaction([
                    ais.sheet.count(Object.assign({}, (searchCondition))),
                    ais.sheet.findMany(Object.assign(Object.assign({}, (searchCondition &&
                        (Object.assign(Object.assign({}, searchCondition), { include: {
                                session: true,
                                program: true,
                                course: true,
                                major: true,
                                assignee: true,
                            } })))), { skip: offset, take: Number(pageSize), orderBy: [
                            { session: { createdAt: 'desc' } },
                            { semesterNum: 'asc' }
                        ] }))
                ]);
                //if(resp && resp[1]?.length){
                res.status(200).json({
                    totalPages: (_a = Math.ceil(resp[0] / pageSize)) !== null && _a !== void 0 ? _a : 0,
                    totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                    data: resp[1],
                });
                // } else {
                //res.status(202).json({ message: `no records found` })
                //}
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchMySheets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const assignStaffId = req.userId;
            const { page = 1, pageSize = 6, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {
                where: {
                    //assessorId: assignStaffId,
                    assignStaffId,
                    session: {
                        OR: [
                            { default: true },
                            { assignLateSheet: true },
                        ]
                    },
                }
            };
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            //assessorId: assignStaffId,
                            assignStaffId,
                            session: {
                                OR: [
                                    { default: true },
                                    { assignLateSheet: true },
                                ]
                            },
                            OR: [
                                { id: { contains: keyword } },
                                { session: { title: { contains: keyword } } },
                                { course: { title: { contains: keyword } } },
                                { course: { id: { contains: keyword } } },
                                { program: { longName: { contains: keyword } } },
                                { unit: { title: { contains: keyword }, levelNum: 2 } },
                            ],
                        }
                    };
                const resp = yield ais.$transaction([
                    ais.sheet.count(Object.assign({}, (searchCondition))),
                    ais.sheet.findMany(Object.assign(Object.assign({}, (searchCondition &&
                        (Object.assign(Object.assign({}, searchCondition), { include: {
                                session: true,
                                program: true,
                                course: true,
                                major: true,
                                assignee: true,
                            } })))), { skip: offset, take: Number(pageSize), 
                        // orderBy: [{ sessionId:'desc'},{ semesterNum:'asc'}]
                        orderBy: [
                            { session: { createdAt: 'desc' } },
                            { semesterNum: 'asc' }
                        ] }))
                ]);
                //if(resp && resp[1]?.length){
                res.status(200).json({
                    totalPages: (_a = Math.ceil(resp[0] / pageSize)) !== null && _a !== void 0 ? _a : 0,
                    totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                    data: resp[1],
                });
                // } else {
                //res.status(202).json({ message: `no records found` })
                //}
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    stageSheet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                // Fetch Active Semester
                const { sessionId } = req.body;
                // Fetch Session Info
                const session = yield ais.session.findFirst({ where: { id: sessionId, default: true } });
                if (session) {
                    // Fetch Mounted Courses all Program Levels
                    let mounts = yield ais.structure.findMany({ where: { status: true }, include: { program: true } });
                    mounts = mounts.filter((meta) => ((meta === null || meta === void 0 ? void 0 : meta.semesterNum) % 2) == ((session === null || session === void 0 ? void 0 : session.semester) == 'SEM2' ? 0 : 1));
                    let data = [];
                    for (let meta of mounts) {
                        let modes;
                        console.log("MODE: ", (_a = meta === null || meta === void 0 ? void 0 : meta.program) === null || _a === void 0 ? void 0 : _a.category);
                        switch ((_b = meta === null || meta === void 0 ? void 0 : meta.program) === null || _b === void 0 ? void 0 : _b.category) {
                            case "CP":
                                modes = ["M", "E", "W"];
                                break;
                            case "DP":
                                modes = ["M", "E", "W"];
                                break;
                            case "UG":
                                modes = ["M", "E", "W"];
                                break;
                            case "PG":
                                modes = ["W"];
                                break;
                        }
                        // Re-populate Data
                        for (const mode of modes) {
                            data.push(Object.assign(Object.assign({}, meta), { studyMode: mode }));
                        }
                    }
                    //console.log(data);
                    // Check whether Sheets are generated 
                    const form = yield ais.sheet.findFirst({ where: { sessionId, status: true } });
                    if (form) {
                        // Update Generated Flag
                        yield ais.session.update({ where: { id: sessionId }, data: { stageSheet: true } });
                        // Return Response
                        return res.status(202).json({ message: `sheets exists for calendar` });
                    }
                    // Upsert Bulk into Sheet 
                    const resp = yield Promise.all(data === null || data === void 0 ? void 0 : data.map((row) => __awaiter(this, void 0, void 0, function* () {
                        let { courseId, programId, unitId, majorId } = row;
                        return yield ais.sheet.create({
                            data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ semesterNum: row.semesterNum, studyMode: row.studyMode }, sessionId && ({ session: { connect: { id: sessionId } } })), courseId && ({ course: { connect: { id: courseId } } })), programId && ({ program: { connect: { id: programId } } })), majorId && ({ major: { connect: { id: majorId } } })), unitId && ({ unit: { connect: { id: unitId } } }))
                        });
                    })));
                    if (resp) {
                        // Update Stage Status in Calendar
                        yield ais.session.update({ where: { id: sessionId }, data: { stageSheet: true } });
                        return res.status(200).json(resp);
                    }
                    else {
                        return res.status(202).json({ message: `no record found` });
                    }
                }
                else {
                    return res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    cleanSheet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                // Fetch Active Semester
                // const { sessionId } = req.body
                // const sessionId = 'f63b1b74-0533-4a62-8510-6292cc93a9a3'; 2026/2025 first
                // const sessionId = 'a500f0cb-6114-4039-81f5-5102382d4d4f'; 2025/2024 second jan
                // const sessionId = '44872c48-a33c-4a7a-a9ce-eb486e59aab2'; 2025/2024 second main
                // const sessionId = '71c730c1-638e-4ee0-9d6a-8fdceac5851c'; //2025/2024 first main
                // const sessionId = 'eb4bc6a5-87c9-4740-80bd-f932beb813de'; //2025/2024 first jan
                // const sessionId = 'cd431ccf-b5f2-4743-9b82-f481d6dea7db'; //2024/2023 second jan
                // const sessionId = '937c57c1-6595-4982-a3f7-3f2c29c7fc82'; //2024/2023 second main
                // const sessionId = '3149b295-ce38-4cb3-9f94-bed2b552d998'; //2024/2023 first jan
                const sessionId = 'cbc5fa67-7982-4516-b824-ff860c756a1b'; //2024/2023 first main
                // Fetch Session Info
                const session = yield ais.session.findFirst({ where: { id: sessionId } });
                if (session) {
                    // Fetch Mounted Courses all Program Levels
                    let mounts = yield ais.structure.findMany({ where: { status: true }, include: { program: true } });
                    mounts = mounts.filter((meta) => ((meta === null || meta === void 0 ? void 0 : meta.semesterNum) % 2) == ((session === null || session === void 0 ? void 0 : session.semester) == 'SEM2' ? 0 : 1));
                    let data = [];
                    for (let meta of mounts) {
                        let modes;
                        console.log("MODE: ", (_a = meta === null || meta === void 0 ? void 0 : meta.program) === null || _a === void 0 ? void 0 : _a.category);
                        switch ((_b = meta === null || meta === void 0 ? void 0 : meta.program) === null || _b === void 0 ? void 0 : _b.category) {
                            case "CP":
                                modes = ["M", "E", "W"];
                                break;
                            case "DP":
                                modes = ["M", "E", "W"];
                                break;
                            case "UG":
                                modes = ["M", "E", "W"];
                                break;
                            case "PG":
                                modes = ["W"];
                                break;
                        }
                        // Re-populate Data
                        for (const mode of modes) {
                            data.push(Object.assign(Object.assign({}, meta), { studyMode: mode }));
                        }
                    }
                    // Upsert Bulk into Sheet 
                    const resp = yield Promise.all(data === null || data === void 0 ? void 0 : data.map((row) => __awaiter(this, void 0, void 0, function* () {
                        let { courseId, programId, unitId, majorId } = row;
                        const sheetM = yield ais.sheet.findFirst({ where: { semesterNum: row.semesterNum, sessionId, programId, courseId } });
                        const sheet = yield ais.sheet.findFirst({ where: { semesterNum: row.semesterNum, studyMode: row.studyMode, sessionId, programId, courseId } });
                        yield ais.$executeRaw `set foreign_key_checks=0`;
                        if (sheet) {
                            return yield ais.$executeRaw `UPDATE ais_sheet SET semesterNum = ${row.semesterNum}, studyMode = ${row.studyMode}, assignStaffId = ${(sheetM === null || sheetM === void 0 ? void 0 : sheetM.assignStaffId) || null}, sessionId = ${sessionId || null}, courseId = ${courseId || null}, programId = ${programId || null}, majorId = ${majorId || null}, unitId = ${unitId || null}, updatedAt = NOW() WHERE id = ${sheet.id}`;
                        }
                        else {
                            return yield ais.$executeRaw `INSERT INTO ais_sheet (id,semesterNum,studyMode,assignStaffId,sessionId,courseId,programId,majorId,unitId,status,createdAt,updatedAt) VALUES (UUID(),${row.semesterNum}, ${row.studyMode}, ${(sheetM === null || sheetM === void 0 ? void 0 : sheetM.assignStaffId) || null}, ${sessionId || null}, ${courseId || null}, ${programId || null}, ${majorId || null}, ${unitId || null}, 1, NOW(),NOW())`;
                        }
                    })));
                    if (resp) {
                        // Clean Records without StudyModes
                        yield ais.$executeRaw `DELETE from ais_sheet where sessionId = ${sessionId} and studyMode is null`;
                        return res.status(200).json(resp);
                    }
                    else {
                        return res.status(202).json({ message: `no record found` });
                    }
                }
                else {
                    return res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    sanitizeSheet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newData = new Map();
                let sheetData = require(path_1.default.join(__dirname, '/../../util/sheetData.json'));
                // console.log(sheetData);
                for (let dt of sheetData) {
                    if (newData.has(`${dt.semesterNum}${dt.studyMode}${dt.sessionId}${dt.courseId}${dt.programId}`)) {
                        let dm = newData.get(`${dt.semesterNum}${dt.studyMode}${dt.sessionId}${dt.courseId}${dt.programId}`);
                        if (dm) {
                            if (!dm.unitId && dt.unitId)
                                dm.unitId = dt.unitId;
                            if (!dm.majorId && dt.majorId)
                                dm.majorId = dt.majorId;
                            if (!dm.assignStaffId && dt.assignStaffId)
                                dm.assignStaffId = dt.assignStaffId;
                            if (!dm.assessorId && dt.assessorId)
                                dm.assessorId = dt.assessorId;
                            if (!dm.certifierId && dt.certifierId)
                                dm.certifierId = dt.certifierId;
                            if (!dm.assessed && dt.assessed)
                                dm.assessed = dt.assessed;
                            if (!dm.certified && dt.certified)
                                dm.certified = dt.certified;
                            if (!dm.finalized && dt.finalized)
                                dm.finalized = dt.finalized;
                            newData.set(`${dt.semesterNum}${dt.studyMode}${dt.sessionId}${dt.courseId}${dt.programId}`, dm);
                        }
                    }
                    else {
                        newData.set(`${dt.semesterNum}${dt.studyMode}${dt.sessionId}${dt.courseId}${dt.programId}`, dt);
                    }
                }
                // Write to Database
                const insData = Array.from(newData).map(([_, d]) => d);
                // Upsert Bulk into Sheet 
                // const resp: any = await Promise.all(insData?.map(async (row: any) => {
                //    let { courseId, programId, unitId, majorId, sessionId } = row;
                //    return await ais.sheet.create({
                //       data: {
                //          semesterNum: row.semesterNum,
                //          assessed: !!row.assessed,
                //          certified: !!row.certified,
                //          finalized: !!row.finalized,
                //          status: !!row.status,
                //          ...sessionId && ({ session: { connect: { id: sessionId } } }),
                //          ...courseId && ({ course: { connect: { id: courseId } } }),
                //          ...programId && ({ program: { connect: { id: programId } } }),
                //          ...majorId && ({ major: { connect: { id: majorId } } }),
                //          ...unitId && ({ unit: { connect: { id: unitId } } }),
                //       }
                //    })
                // }))
                console.log(insData);
                // Write to File
                const jsonData = JSON.stringify(Array.from(newData).map(([_, d]) => d), null, 2);
                const filePath = path_1.default.join(__dirname, '/../../util/sheetData2.json');
                fs_1.default.writeFile(filePath, jsonData, (err) => {
                    if (err)
                        console.error('Error writing file:', err);
                    else
                        console.log(`Array successfully written to ${filePath}`);
                });
                // Return JSON Output
                return res.status(200).json(Array.from(newData).map(([_, d]) => d));
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fixSheet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let sheetData = require(path_1.default.join(__dirname, '/../../util/sheetData2.json'));
                const sessionId = `f63b1b74-0533-4a62-8510-6292cc93a9a3`;
                const sheets = yield ais.sheet.findMany({
                    where: {
                        sessionId,
                    }
                });
                // Upsert Bulk into Sheet 
                yield ais.$executeRaw `set foreign_key_checks=0`;
                const resp = yield Promise.all(sheets === null || sheets === void 0 ? void 0 : sheets.map((row) => __awaiter(this, void 0, void 0, function* () {
                    const sm = sheetData.find((r) => r.sessionId == sessionId && r.semesterNum == row.semesterNum && r.programId == row.programId && r.assignStaffId != null);
                    if (sm)
                        // return await ais.sheet.update({
                        //    where: { id: row.id },
                        //    data: {
                        //       assessed:      !!sm.assessed,
                        //       certified:     !!sm.certified,
                        //       finalized:     !!sm.finalized,
                        //       // assignStaffId: sm.assignStaffId,
                        //       // assessorId:    sm.assessorId,
                        //       // certifierId:   sm.certifierId,
                        //       ...sm.assignStaffId && ({ assignee: { connect: { staffNo: sm.assignStaffId } } }),
                        //       ...sm.assessorId && ({ assessor: { connect: { staffNo: sm.assessorId } } }),
                        //       ...sm.certifierId && ({ certifier: { connect: { staffNo: sm.certifierId } } }),
                        //    }
                        // })
                        return yield ais.$executeRaw `update ais_sheet set assignStaffId=${sm.assignStaffId}, assessorId=${sm.assessorId}, certifierId=${sm.certifierId} WHERE id = ${row.id}`;
                })));
                yield ais.$executeRaw `set foreign_key_checks=1`;
                console.log(resp);
                // Write to File
                // Return JSON Output
                return res.status(200).json(resp);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    loadSheet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch Active Semester
                const { sheetId } = req.body;
                // Fetch Session Info
                const sheet = yield ais.sheet.findFirst({ where: { id: sheetId, status: true }, include: { program: true, unit: true, session: true, course: true, major: true } });
                if (sheet) {
                    // Fetch Mounted Courses all Program Levels
                    let mounts = yield ais.assessment.findMany({
                        where: {
                            semesterNum: sheet.semesterNum,
                            sessionId: sheet === null || sheet === void 0 ? void 0 : sheet.sessionId,
                            courseId: sheet === null || sheet === void 0 ? void 0 : sheet.courseId,
                            student: { programId: sheet === null || sheet === void 0 ? void 0 : sheet.programId },
                        },
                        include: {
                            student: {
                                select: { fname: true, mname: true, lname: true, id: true, indexno: true, studyMode: true, gender: true, programId: true }
                            },
                            scheme: true,
                            course: true,
                            session: true
                        },
                        orderBy: { student: { fname: 'asc' } }
                    });
                    mounts = mounts === null || mounts === void 0 ? void 0 : mounts.filter((st, i) => {
                        //console.log(sheet, st?.semesterNum, st?.student?.studyMode, sheet?.studyMode)
                        // if(st?.student?.semesterNum < 5) return sheet?.programId == st?.student?.programId && sheet?.studyMode == st?.student?.studyMode;
                        // return sheet?.programId == st?.student?.programId && sheet?.majorId == st?.student?.majorId && sheet?.studyMode == st?.student?.studyMode;
                        // if(st?.student?.semesterNum < 5) return sheet?.studyMode == st?.student?.studyMode; // Level 100 - 200 dont have majors assigned
                        // return sheet?.majorId == st?.student?.majorId && sheet?.studyMode == st?.student?.studyMode; // Level 300 and Above should have Majors 
                        // if(sheet?.studyMode) return sheet?.studyMode == st?.student?.studyMode; 
                        var _a;
                        if ((sheet === null || sheet === void 0 ? void 0 : sheet.studyMode) == null)
                            return true;
                        return (sheet === null || sheet === void 0 ? void 0 : sheet.studyMode) == ((_a = st === null || st === void 0 ? void 0 : st.student) === null || _a === void 0 ? void 0 : _a.studyMode);
                    });
                    let resp = mounts === null || mounts === void 0 ? void 0 : mounts.map((row) => {
                        var _a, _b;
                        const grade = (0, helper_1.getGrade)(row.totalScore, (_a = row.scheme) === null || _a === void 0 ? void 0 : _a.gradeMeta);
                        const gradepoint = (0, helper_1.getGradePoint)(row.totalScore, (_b = row.scheme) === null || _b === void 0 ? void 0 : _b.gradeMeta);
                        return (Object.assign(Object.assign({}, row), { grade,
                            gradepoint }));
                    });
                    console.log("resp: ", resp);
                    if (resp) {
                        res.status(200).json(resp);
                    }
                    else {
                        res.status(202).json({ message: `no record found` });
                    }
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    uploadSheet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch Active Semester
                const { id, data } = req.body;
                // const createdBy = req.userId;
                let resp, sheetId = 0;
                const sheet = yield ais.sheet.findFirst({ where: { id } });
                if ((data === null || data === void 0 ? void 0 : data.length) && sheet && !sheet.assessed) {
                    const { sessionId, courseId } = sheet;
                    resp = yield Promise.all(data === null || data === void 0 ? void 0 : data.map((row) => __awaiter(this, void 0, void 0, function* () {
                        let { indexno, classScore, examScore, totalScore, sheet } = row;
                        classScore = classScore != '' ? classScore : null;
                        examScore = examScore != '' ? examScore : null;
                        totalScore = totalScore != '' ? totalScore : null;
                        sheetId = sheet;
                        let isExist = yield ais.assessment.findFirst({ where: { sessionId, courseId, indexno } });
                        if (isExist && sheetId == sheetId) {
                            return yield ais.assessment.update({ where: { id: isExist === null || isExist === void 0 ? void 0 : isExist.id }, data: { classScore, examScore, totalScore } });
                        }
                        return null;
                    })));
                }
                else
                    return resp;
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `Upload failed` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    saveSheet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch Active Semester
                const { count, data } = req.body;
                let mounts = [];
                const courseId = data[`cid`];
                const sessionId = data[`sid`];
                for (let i = 0; i < count; i++) {
                    const scoreA = data[`${i}_scorea`] ? parseFloat(data[`${i}_scorea`]) : null;
                    const scoreB = data[`${i}_scoreb`] ? parseFloat(data[`${i}_scoreb`]) : null;
                    const scoreC = data[`${i}_scorec`] ? parseFloat(data[`${i}_scorec`]) : null;
                    let classScore = (scoreA && scoreB && scoreC) ? (scoreA + scoreB + scoreC) : (scoreA && scoreB && !scoreC) ? (scoreA + scoreB) : parseFloat(data[`${i}_class`]);
                    classScore = !isNaN(classScore) ? classScore : null;
                    let examScore = parseFloat(data[`${i}_exam`]);
                    examScore = !isNaN(examScore) ? examScore : null;
                    let totalScore = classScore + examScore;
                    totalScore = !isNaN(totalScore) ? totalScore : null;
                    const indexno = data[`${i}_idx`];
                    const id = data[`${i}_id`];
                    mounts.push({
                        where: { id, course: { id: courseId }, session: { id: sessionId }, indexno },
                        data: {
                            // ... scoreA && ({ scoreA }),
                            // ... scoreB && ({ scoreB }),
                            // ... scoreC && ({ scoreC }),
                            scoreA,
                            scoreB,
                            scoreC,
                            classScore,
                            examScore,
                            totalScore,
                        }
                    });
                }
                // Bulk Score Update 
                const resp = yield Promise.all(mounts === null || mounts === void 0 ? void 0 : mounts.map((query) => __awaiter(this, void 0, void 0, function* () {
                    return yield ais.assessment.updateMany(query);
                })));
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    stageAuccSheet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                // Fetch Active Semester
                const { sessionId } = req.body;
                let loopcount = 0;
                // Check whether Sheets are generated 
                const form = yield ais.sheet.findFirst({ where: { sessionId, status: true } });
                if (form)
                    res.status(202).json({ message: `no record found` });
                // Fetch Session Info
                const session = yield ais.session.findFirst({ where: { id: sessionId, default: true } });
                if (session) {
                    if (((_a = session === null || session === void 0 ? void 0 : session.tag) === null || _a === void 0 ? void 0 : _a.toLowerCase()) == 'main') {
                        // Fetch Mounted Courses all Program Levels
                        const mounts = yield ais.structure.findMany({ where: { status: true, program: { status: true } }, include: { program: true } });
                        if (mounts === null || mounts === void 0 ? void 0 : mounts.length) {
                            for (let meta of mounts) {
                                if (meta.semesterNum % 2 == (session.semester == 'SEM2' ? 1 : 0))
                                    continue;
                                var sessionModes = [];
                                switch ((_b = meta === null || meta === void 0 ? void 0 : meta.program) === null || _b === void 0 ? void 0 : _b.category) {
                                    case "CP":
                                        sessionModes = ["M"];
                                        break;
                                    case "DP":
                                        sessionModes = ["M", "E", "W"];
                                        break;
                                    case "UG":
                                        sessionModes = ["M", "E", "W"];
                                        break;
                                    case "PG":
                                        sessionModes = ["W"];
                                        break;
                                }
                                // Run Data For All Existing Session Modes
                                if (sessionModes === null || sessionModes === void 0 ? void 0 : sessionModes.length) {
                                    const resp = yield Promise.all(sessionModes === null || sessionModes === void 0 ? void 0 : sessionModes.map((mode) => __awaiter(this, void 0, void 0, function* () {
                                        let { courseId, programId, unitId, majorId } = meta;
                                        return yield ais.sheet.create({
                                            data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ semesterNum: meta.semesterNum, studyMode: mode }, sessionId && ({ session: { connect: { id: sessionId } } })), courseId && ({ course: { connect: { id: courseId } } })), programId && ({ program: { connect: { id: programId } } })), majorId && ({ major: { connect: { id: majorId } } })), unitId && ({ unit: { connect: { id: unitId } } }))
                                        });
                                    })));
                                    if (resp.length)
                                        loopcount += resp.length;
                                }
                            }
                        }
                    }
                    else {
                        // JAN - SUB STREAM
                        const code = session === null || session === void 0 ? void 0 : session.admissionPrefix;
                        if (code) { // Only Set for January Sessions - not Main Session
                            // Check Student if students admitted
                            const st = yield ais.$queryRaw `select * from ais_student where date_format(entryDate,'%m%y') = ${code} and semesterNum < 5`;
                            // Fetch Mounted Courses all Program Levels
                            let mounts = yield ais.structure.findMany({ where: { status: true, semesterNum: { lt: 5 }, program: { status: true } }, include: { program: true } });
                            // Filter Mounted to Some Specific course and programs
                            let holder = new Set();
                            for (const s of st) {
                                if (!holder.has(`${s.programId}${s.semesterNum}${s.studyMode ? s.studyMode : ""}`))
                                    holder.add(`${s.programId}${s.semesterNum}${s.studyMode ? s.studyMode : ""}`);
                            }
                            mounts = mounts.filter((r) => [1, 2].includes(r.semesterNum) || ([3, 4].includes(r.semesterNum) && holder.has(`${r.programId}${r.semesterNum}${r.studyMode ? r.studyMode : ""}`)));
                            if ((st === null || st === void 0 ? void 0 : st.length) && (mounts === null || mounts === void 0 ? void 0 : mounts.length)) {
                                for (let meta of mounts) {
                                    if (meta.semesterNum % 2 == (session.semester == 'SEM2' ? 1 : 0))
                                        continue;
                                    var sessionModes = [];
                                    switch ((_c = meta === null || meta === void 0 ? void 0 : meta.program) === null || _c === void 0 ? void 0 : _c.category) {
                                        case "CP":
                                            sessionModes = ["M"];
                                            break;
                                        case "DP":
                                            sessionModes = ["M", "E", "W"];
                                            break;
                                        case "UG":
                                            sessionModes = ["M", "E", "W"];
                                            break;
                                        case "PG":
                                            sessionModes = ["W"];
                                            break;
                                    }
                                    // Run Data For All Existing Session Modes
                                    if (sessionModes === null || sessionModes === void 0 ? void 0 : sessionModes.length) {
                                        const resp = yield Promise.all(sessionModes === null || sessionModes === void 0 ? void 0 : sessionModes.map((mode) => __awaiter(this, void 0, void 0, function* () {
                                            let { courseId, programId, unitId, majorId } = meta;
                                            return yield ais.sheet.create({
                                                data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ semesterNum: meta.semesterNum, studyMode: mode }, sessionId && ({ session: { connect: { id: sessionId } } })), courseId && ({ course: { connect: { id: courseId } } })), programId && ({ program: { connect: { id: programId } } })), majorId && ({ major: { connect: { id: majorId } } })), unitId && ({ unit: { connect: { id: unitId } } }))
                                            });
                                        })));
                                        if (resp.length)
                                            loopcount += resp.length;
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    // Session Not Default or Activated
                    res.status(202).json({ message: `Session is not activated!` });
                }
                if (loopcount) {
                    // Update Stage Status in Calendar
                    yield ais.session.update({ where: { id: sessionId }, data: { stageSheet: true } });
                    res.status(200).json(loopcount);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchSheet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.sheet.findUnique({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    include: {
                        session: { select: { title: true, tag: true } },
                        program: { select: { longName: true, category: true } },
                        course: { select: { title: true, id: true, creditHour: true } },
                        major: { select: { longName: true } },
                        assignee: true,
                        assessor: true,
                        certifier: true
                    },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postSheet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.sheet.create({
                    data: Object.assign({}, req.body),
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    submitSheet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const assessorId = req.userId;
                const resp = yield ais.sheet.update({ where: { id: (0, paramStr_1.paramStr)(req.params.id) }, data: { assessed: true, assessorId } });
                if (resp) {
                    console.log(resp);
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    closeSheet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.sheet.findUnique({ where: { id: (0, paramStr_1.paramStr)(req.params.id) } });
                if (resp) {
                    let { courseId, programId, unitId, majorId, sessionId, semesterNum, studyMode } = resp;
                    // Fetch Affected Students
                    const assessments = yield ais.assessment.findMany({
                        where: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, sessionId && ({ sessionId })), courseId && ({ courseId })), programId && ({ student: { programId } })), majorId && ({ student: { majorId } })), studyMode && ({ student: { studyMode } })), semesterNum && ({ semesterNum: Number(semesterNum) })),
                        include: { scheme: true }
                    });
                    // Generate Resit Data on Sheet Close
                    //const rsession = await ais.resitSession.findFirst({ where: { default: true }});
                    const all = yield Promise.all(assessments.filter((a) => a.totalScore < a.scheme.passMark).map((r) => __awaiter(this, void 0, void 0, function* () {
                        const { sessionId, indexno, courseId, schemeId, semesterNum } = r;
                        return yield ais.resit.upsert({
                            where: {
                                resitId: {
                                    indexno,
                                    courseId,
                                    trailSessionId: sessionId,
                                }
                            },
                            create: {
                                semesterNum: Number(semesterNum),
                                totalScore: null,
                                trailSession: { connect: { id: sessionId } },
                                course: { connect: { id: courseId } },
                                scheme: { connect: { id: schemeId } },
                                student: { connect: { indexno: indexno } },
                            },
                            update: {}
                        });
                    })));
                    // Update Student Assessment Publish Status
                    yield ais.assessment.updateMany({
                        where: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, sessionId && ({ sessionId })), courseId && ({ courseId })), programId && ({ student: { programId } })), majorId && ({ student: { majorId } })), studyMode && ({ student: { studyMode } })), semesterNum && ({ semesterNum: Number(semesterNum) })),
                        data: { status: true },
                    });
                    console.log(all);
                    // Update Sheet
                    yield ais.sheet.update({ where: { id: (0, paramStr_1.paramStr)(req.params.id) }, data: { finalized: true } });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    publishSheet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const certifierId = req.userId;
                const resp = yield ais.sheet.findUnique({ where: { id: (0, paramStr_1.paramStr)(req.params.id) } });
                if (resp) {
                    let { courseId, programId, unitId, majorId, sessionId, semesterNum, studyMode } = resp;
                    // Update Student Assessment Publish Status
                    const ups = yield ais.assessment.updateMany({
                        where: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, sessionId && ({ sessionId })), courseId && ({ courseId })), programId && ({ student: { programId } })), majorId && ({ student: { majorId } })), studyMode && ({ student: { studyMode } })), semesterNum && ({ semesterNum: Number(semesterNum) })),
                        data: { status: true }
                    });
                    // Update Sheet
                    yield ais.sheet.update({ where: { id: (0, paramStr_1.paramStr)(req.params.id) }, data: { certified: true, certifierId } });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    unpublishSheet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.sheet.findUnique({ where: { id: (0, paramStr_1.paramStr)(req.params.id) } });
                if (resp) {
                    let { courseId, programId, unitId, majorId, sessionId, semesterNum, studyMode } = resp;
                    // Update Student Assessment Publish Status
                    const ups = yield ais.assessment.updateMany({
                        where: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, sessionId && ({ sessionId })), courseId && ({ courseId })), programId && ({ student: { programId } })), majorId && ({ student: { majorId } })), studyMode && ({ student: { studyMode } })), semesterNum && ({ semesterNum: Number(semesterNum) })),
                        data: { status: false }
                    });
                    console.log(ups);
                    // Update Sheet
                    yield ais.sheet.update({ where: { id: (0, paramStr_1.paramStr)(req.params.id) }, data: { certified: false, certifierId: null } });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateSheet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { courseId, programId, unitId, majorId, sessionId, semesterNum, studyMode, assignStaffId } = req.body;
                const sheet = yield ais.sheet.findUnique({ where: { id: (0, paramStr_1.paramStr)(req.params.id) } });
                const resp = yield ais.sheet.update({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, studyMode && ({ studyMode })), semesterNum && ({ semesterNum: Number(semesterNum) })), sessionId && ({ session: { connect: { id: sessionId } } })), courseId && ({ course: { connect: { id: courseId } } })), programId && ({ program: { connect: { id: programId } } })), unitId && ({ unit: { connect: { id: unitId } } })), majorId && majorId == 'NONE' && ({ major: { disconnect: true } })), majorId && majorId != 'NONE' && ({ major: { connect: { id: majorId } } })), assignStaffId && ({ assignee: { connect: { staffNo: assignStaffId } } }))
                });
                if (resp) {
                    // Send SMS 
                    if (assignStaffId && (assignStaffId != sheet.assignStaffId)) {
                        const st = yield ais.staff.findFirst({ where: { staffNo: assignStaffId } });
                        if (st === null || st === void 0 ? void 0 : st.phone)
                            yield sms(st === null || st === void 0 ? void 0 : st.phone, `Hi! You have been assigned a course with course code: ${sheet === null || sheet === void 0 ? void 0 : sheet.courseId} for Year ${Math.ceil((sheet === null || sheet === void 0 ? void 0 : sheet.semesterNum) / 2)}. Please login to assess your students.`);
                    }
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    reverseSheet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sheet = yield ais.sheet.findUnique({ where: { id: (0, paramStr_1.paramStr)(req.params.id) } });
                const resp = yield ais.sheet.update({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    data: {
                        assigned: false,
                        certified: false,
                        finalized: false
                    }
                });
                if (resp) {
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteSheet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.sheet.delete({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Backlog */
    fetchBacklogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { page = 1, pageSize = 6, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { title: { contains: keyword } },
                                { session: { title: { contains: keyword } } },
                            ],
                        },
                    };
                const resp = yield ais.$transaction([
                    ais.activityBacklog.count(Object.assign({}, (searchCondition))),
                    ais.activityBacklog.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize), include: {
                            session: true
                        } }))
                ]);
                if (resp && ((_a = resp[1]) === null || _a === void 0 ? void 0 : _a.length)) {
                    return res.status(200).json({
                        totalPages: (_b = Math.ceil(resp[0] / pageSize)) !== null && _b !== void 0 ? _b : 0,
                        totalData: (_c = resp[1]) === null || _c === void 0 ? void 0 : _c.length,
                        data: resp[1],
                    });
                }
                else {
                    return res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchBacklog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.activityBacklog.findUnique({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    include: { session: true }
                });
                if (resp) {
                    return res.status(200).json(resp);
                }
                else {
                    return res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    approveBacklog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const approvedBy = req.userId;
                const rs = yield ais.activityBacklog.findUnique({
                    where: { id: (_a = req.body) === null || _a === void 0 ? void 0 : _a.backlogId },
                });
                if (rs) {
                    const { id, type, meta, sessionId, schemeId } = rs;
                    let data = [], resp;
                    if (type == 'ASSESSMENT') { // BACKLOG ASSESSMENT
                        data = yield Promise.all(meta.map((r) => __awaiter(this, void 0, void 0, function* () {
                            var _a;
                            const as = yield ais.assessment.findFirst({ where: { sessionId, courseId: r.courseId, indexno: r.indexno.trim() } });
                            const cs = yield ais.course.findUnique({ where: { id: r.courseId } });
                            // Log Existing Data
                            yield ais.log.create({ data: { action: `BACKLOG_${type}`, user: req.userId, student: r.indexno.trim(), meta: as } });
                            // Upsert New Data
                            return yield ais.assessment.upsert({
                                where: {
                                    id: (_a = as === null || as === void 0 ? void 0 : as.id) !== null && _a !== void 0 ? _a : ''
                                },
                                create: {
                                    indexno: r.indexno.trim(),
                                    courseId: r.courseId,
                                    semesterNum: Number(r.semesterNum),
                                    classScore: r.scoreClass,
                                    examScore: r.scoreExam,
                                    totalScore: r.scoreTotal,
                                    type: r.scoreType,
                                    status: true,
                                    credit: cs === null || cs === void 0 ? void 0 : cs.creditHour,
                                    sessionId,
                                    schemeId
                                },
                                update: {
                                    semesterNum: Number(r.semesterNum),
                                    classScore: r.scoreClass,
                                    examScore: r.scoreExam,
                                    totalScore: r.scoreTotal,
                                    type: r.scoreType,
                                    credit: cs === null || cs === void 0 ? void 0 : cs.creditHour,
                                    schemeId
                                },
                            });
                        })));
                        resp = { count: data === null || data === void 0 ? void 0 : data.length };
                    }
                    else if (type == 'REGISTRATION') { // BACKLOG REGISTRATION
                        data = yield Promise.all(meta.map((r) => __awaiter(this, void 0, void 0, function* () {
                            const cs = yield ais.course.findUnique({ where: { id: r.courseId } });
                            return ({
                                indexno: r.indexno.trim(),
                                courseId: r.courseId,
                                semesterNum: Number(r.semesterNum),
                                type: r.scoreType,
                                status: true,
                                credit: cs === null || cs === void 0 ? void 0 : cs.creditHour,
                                sessionId,
                                schemeId
                            });
                        })));
                        resp = yield ais.assessment.createMany({ data });
                    }
                    else if (type == 'DELETION') { // BACKLOG DELETION
                        data = yield Promise.all(meta.map((r) => __awaiter(this, void 0, void 0, function* () {
                            const as = yield ais.assessment.findFirst({ where: { sessionId, courseId: r.courseId, indexno: r.indexno } });
                            // Log Existing Data
                            yield ais.log.create({ data: { action: `BACKLOG_${type}`, user: req.userId, student: r.indexno, meta: as } });
                            // Upsert New Data
                            return ais.assessment.deleteMany({ where: { indexno: r.indexno, courseId: r.courseId, sessionId } });
                        })));
                        resp = { count: data === null || data === void 0 ? void 0 : data.length };
                    }
                    console.log(resp);
                    if (resp === null || resp === void 0 ? void 0 : resp.count) {
                        // Update Backlog Status
                        yield ais.activityBacklog.update({ where: { id }, data: { approvedBy, status: true } });
                        // Return Response
                        res.status(200).json({ success: true, data: resp });
                    }
                    else {
                        res.status(202).json({ message: `no records found` });
                    }
                }
                else
                    throw ("Invalid Backlog Id");
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    uploadBacklog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const data = req.body;
                let resp;
                if (data === null || data === void 0 ? void 0 : data.length) {
                    const createdBy = req.userId;
                    let sessionId = data[0].sessionId, schemeId = data[0].schemeId;
                    let meta = [];
                    data === null || data === void 0 ? void 0 : data.map((row) => __awaiter(this, void 0, void 0, function* () {
                        let { courseId, type, status, semesterNum, indexno, classScore, examScore, totalScore } = row;
                        indexno = indexno.trim();
                        courseId = courseId.trim();
                        schemeId = schemeId.trim();
                        type = type.trim();
                        semesterNum = +semesterNum;
                        classScore = classScore != '' ? parseFloat(classScore) : null;
                        examScore = examScore != '' ? parseFloat(examScore) : null;
                        totalScore = totalScore != '' ? parseFloat(totalScore) : null;
                        status = !!status;
                        meta.push({ indexno, courseId, semesterNum, scoreType: type, scoreClass: classScore, scoreExam: examScore, scoreTotal: totalScore });
                    }));
                    resp = yield ais.activityBacklog.create({
                        data: Object.assign(Object.assign(Object.assign({ title: `UPLOAD - ${(_a = (0, moment_1.default)().format('LLL')) === null || _a === void 0 ? void 0 : _a.toUpperCase()} - ${createdBy}`, type: `ASSESSMENT`, meta }, createdBy && ({ creator: { connect: { staffNo: createdBy } } })), sessionId && ({ session: { connect: { id: sessionId } } })), schemeId && ({ scheme: { connect: { id: schemeId } } })),
                    });
                }
                else
                    return resp;
                if (resp) {
                    console.log(resp);
                    res.status(200).json({ success: true, data: resp });
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(202).json({ message: error.message });
            }
        });
    }
    postBacklog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { sessionId, schemeId, type, userId } = req.body;
                const createdBy = req.userId || userId;
                let meta = [];
                const metaNum = parseInt(req.body.metaNum);
                if (metaNum)
                    for (let i = 1; i <= metaNum; i++) {
                        const indexno = req.body[`${i}_indexno`].trim();
                        const courseId = req.body[`${i}_courseId`];
                        const semesterNum = req.body[`${i}_semesterNum`];
                        const scoreType = req.body[`${i}_scoreType`];
                        const scoreClass = parseFloat(req.body[`${i}_scoreClass`]);
                        const scoreExam = parseFloat(req.body[`${i}_scoreExam`]);
                        const scoreTotal = parseFloat(req.body[`${i}_scoreTotal`]);
                        if (type == 'REGISTRATION')
                            meta.push({ indexno, courseId, semesterNum, scoreType });
                        else if (type == 'ASSESSMENT')
                            meta.push({ indexno, courseId, semesterNum, scoreType, scoreClass, scoreExam, scoreTotal });
                        else
                            meta.push({ indexno, courseId, semesterNum });
                    }
                const resp = yield ais.activityBacklog.create({
                    data: Object.assign(Object.assign(Object.assign({ title: `ENTRY - ${(_a = (0, moment_1.default)().format('LLL')) === null || _a === void 0 ? void 0 : _a.toUpperCase()} - ${createdBy}`, type,
                        meta }, createdBy && ({ creator: { connect: { staffNo: createdBy } } })), sessionId && ({ session: { connect: { id: sessionId } } })), schemeId && ({ scheme: { connect: { id: schemeId } } })),
                });
                if (resp) {
                    res.status(200).json({ success: true, data: resp });
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateBacklog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sessionId, schemeId, type, userId } = req.body;
                // const createdBy = req.userId || userId;
                let meta = [];
                const metaNum = parseInt(req.body.metaNum);
                if (metaNum)
                    for (let i = 1; i <= metaNum; i++) {
                        const indexno = req.body[`${i}_indexno`].trim();
                        const courseId = req.body[`${i}_courseId`];
                        const semesterNum = req.body[`${i}_semesterNum`];
                        const scoreType = req.body[`${i}_scoreType`];
                        const scoreClass = parseFloat(req.body[`${i}_scoreClass`]);
                        const scoreExam = parseFloat(req.body[`${i}_scoreExam`]);
                        const scoreTotal = parseFloat(req.body[`${i}_scoreTotal`]);
                        if (type == 'REGISTRATION')
                            meta.push({ indexno, courseId, semesterNum, scoreType });
                        else if (type == 'ASSESSMENT')
                            meta.push({ indexno, courseId, semesterNum, scoreType, scoreClass, scoreExam, scoreTotal });
                        else
                            meta.push({ indexno, courseId, semesterNum });
                    }
                const resp = yield ais.activityBacklog.update({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    data: Object.assign(Object.assign({ 
                        // title,
                        type,
                        meta }, sessionId && ({ session: { connect: { id: sessionId } } })), schemeId && ({ scheme: { connect: { id: schemeId } } })),
                });
                if (resp) {
                    res.status(200).json({ success: true, data: resp });
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteBacklog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.activityBacklog.delete({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Resit */
    fetchResits(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 6, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { indexno: { contains: keyword } },
                                { student: { fname: { contains: keyword } } },
                                { student: { lname: { contains: keyword } } },
                                { course: { title: { contains: keyword } } },
                                { course: { id: { contains: keyword } } },
                                { trailSession: { title: { contains: keyword } } },
                            ],
                        },
                    };
                const resp = yield ais.$transaction([
                    ais.resit.count(Object.assign({}, (searchCondition))),
                    ais.resit.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize), include: {
                            resitSession: true,
                            trailSession: true,
                            registerSession: true,
                            course: true,
                            student: { include: { program: true } },
                        } }))
                ]);
                //if(resp && resp[1]?.length){
                return res.status(200).json({
                    totalPages: (_a = Math.ceil(resp[0] / pageSize)) !== null && _a !== void 0 ? _a : 0,
                    totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                    data: resp[1],
                });
                // } else {
                //    return res.status(202).json({ message: `no records found` })
                // }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchResit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.resit.findUnique({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    include: { session: true }
                });
                if (resp) {
                    return res.status(200).json(resp);
                }
                else {
                    return res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postResit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdBy = req.userId;
                const { sessionId, schemeId, type, title } = req.body;
                const resp = yield ais.resit.create({
                    data: Object.assign(Object.assign(Object.assign({ title,
                        type }, createdBy && ({ creator: { connect: { staffNo: createdBy } } })), sessionId && ({ resitSession: { connect: { id: sessionId } } })), schemeId && ({ scheme: { connect: { id: schemeId } } })),
                });
                if (resp) {
                    res.status(200).json({ success: true, data: resp });
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateResit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdBy = req.userId;
                const { sessionId, schemeId, type, title } = req.body;
                const resp = yield ais.resit.update({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    data: Object.assign(Object.assign(Object.assign({ title,
                        type }, createdBy && ({ creator: { connect: { staffNo: createdBy } } })), sessionId && ({ resitSession: { connect: { id: sessionId } } })), schemeId && ({ scheme: { connect: { id: schemeId } } })),
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteResit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.resit.delete({ where: { id: (0, paramStr_1.paramStr)(req.params.id) } });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Resit Session */
    fetchResitSessions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 6, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { title: { contains: keyword } },
                            ],
                        },
                    };
                const resp = yield ais.$transaction([
                    ais.resitSession.count(Object.assign({}, (searchCondition))),
                    ais.resitSession.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize) }))
                ]);
                //if(resp && resp[1]?.length){
                return res.status(200).json({
                    totalPages: (_a = Math.ceil(resp[0] / pageSize)) !== null && _a !== void 0 ? _a : 0,
                    totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                    data: resp[1],
                });
                // } else {
                //    return res.status(202).json({ message: `no records found` })
                // }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchResitSessionsList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.resitSession.findMany({
                    orderBy: { createdAt: 'desc' }
                });
                // Return Response
                return res.status(200).json(resp);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchResitSessionList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            try {
                const resp = yield ais.resit.findMany({
                    where: { resitSessionId: (0, paramStr_1.paramStr)(req.params.id) },
                    include: { course: true, student: true, scheme: true }
                });
                if (resp.length) {
                    const grades = (_a = resp[0].scheme) === null || _a === void 0 ? void 0 : _a.gradeMeta;
                    const dm = yield Promise.all(resp.map((r) => __awaiter(this, void 0, void 0, function* () {
                        return (Object.assign(Object.assign({}, r), { grade: yield (0, helper_1.getGrade)(r === null || r === void 0 ? void 0 : r.totalScore, grades) }));
                    })));
                    let courseMap = new Map();
                    for (let d of dm) {
                        if (courseMap.has(`${(_b = d === null || d === void 0 ? void 0 : d.course) === null || _b === void 0 ? void 0 : _b.id} - ${(_c = d === null || d === void 0 ? void 0 : d.course) === null || _c === void 0 ? void 0 : _c.title}`)) {
                            let cs = courseMap.get(`${(_d = d === null || d === void 0 ? void 0 : d.course) === null || _d === void 0 ? void 0 : _d.id} - ${(_e = d === null || d === void 0 ? void 0 : d.course) === null || _e === void 0 ? void 0 : _e.title}`);
                            cs.push(d);
                            courseMap.set(`${(_f = d === null || d === void 0 ? void 0 : d.course) === null || _f === void 0 ? void 0 : _f.id} - ${(_g = d === null || d === void 0 ? void 0 : d.course) === null || _g === void 0 ? void 0 : _g.title}`, cs);
                        }
                        else {
                            courseMap.set(`${(_h = d === null || d === void 0 ? void 0 : d.course) === null || _h === void 0 ? void 0 : _h.id} - ${(_j = d === null || d === void 0 ? void 0 : d.course) === null || _j === void 0 ? void 0 : _j.title}`, [d]);
                        }
                    }
                    // Return Response
                    return res.status(200).json(Array.from(courseMap));
                }
                else {
                    return res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchResitSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.resitSession.findUnique({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                });
                if (resp) {
                    return res.status(200).json(resp);
                }
                else {
                    return res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    saveResitSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch Active Semester
                const { count, data } = req.body;
                console.log(req.body);
                let mounts = [];
                for (let i = 0; i < count; i++) {
                    const totalScore = data[`${i}_totalScore`] ? parseFloat(data[`${i}_totalScore`]) : null;
                    const id = data[`${i}_id`];
                    mounts.push({
                        where: { id },
                        data: {
                            totalScore,
                            taken: true
                        }
                    });
                }
                // Bulk Score Update 
                const resp = yield Promise.all(mounts === null || mounts === void 0 ? void 0 : mounts.map((query) => __awaiter(this, void 0, void 0, function* () {
                    return yield ais.resit.updateMany(query);
                })));
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postResitSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.resitSession.create({
                    data: req.body,
                });
                if (resp) {
                    res.status(200).json({ success: true, data: resp });
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateResitSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.resitSession.update({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    data: req.body,
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteResitSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.resitSession.delete({ where: { id: (0, paramStr_1.paramStr)(req.params.id) } });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Graduate Session */
    fetchGraduateLogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { indexno: { contains: keyword } },
                                { graduateSession: { contains: keyword } },
                                { reason: { contains: keyword } },
                            ],
                        }
                    };
                const resp = yield ais.$transaction([
                    ais.graduateLog.count(Object.assign({}, (searchCondition))),
                    ais.graduateLog.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize) }))
                ]);
                //if(resp && resp[1]?.length){
                res.status(200).json({
                    totalPages: (_a = Math.ceil(resp[0] / pageSize)) !== null && _a !== void 0 ? _a : 0,
                    totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                    data: resp[1],
                });
                //} else {
                //res.status(202).json({ message: `no records found` })
                //}
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Graduate Session */
    fetchGraduateSessions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { title: { contains: keyword } },
                                { description: { contains: keyword } },
                            ],
                        }
                    };
                const resp = yield ais.$transaction([
                    ais.graduateSession.count(Object.assign({}, (searchCondition))),
                    ais.graduateSession.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize), include: {
                            _count: {
                                select: { graduate: true }
                            }
                        } }))
                ]);
                //if(resp && resp[1]?.length){
                res.status(200).json({
                    totalPages: (_a = Math.ceil(resp[0] / pageSize)) !== null && _a !== void 0 ? _a : 0,
                    totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                    data: resp[1],
                });
                //} else {
                //res.status(202).json({ message: `no records found` })
                //}
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchGraduateSessionsList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.graduateSession.findMany();
                // Return Response
                return res.status(200).json(resp);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchGraduateSessionList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            try {
                const resp = yield ais.graduate.findMany({
                    where: { graduateSessionId: (0, paramStr_1.paramStr)(req.params.id) },
                    include: { student: { include: { program: true } } },
                    orderBy: {
                        student: { lname: 'asc' }
                    }
                });
                if (resp.length) {
                    const dm = resp;
                    let programMap = new Map();
                    for (let d of dm) {
                        if (programMap.has((_b = (_a = d === null || d === void 0 ? void 0 : d.student) === null || _a === void 0 ? void 0 : _a.program) === null || _b === void 0 ? void 0 : _b.longName)) {
                            let cs = programMap.get((_d = (_c = d === null || d === void 0 ? void 0 : d.student) === null || _c === void 0 ? void 0 : _c.program) === null || _d === void 0 ? void 0 : _d.longName);
                            cs.push(d);
                            programMap.set((_f = (_e = d === null || d === void 0 ? void 0 : d.student) === null || _e === void 0 ? void 0 : _e.program) === null || _f === void 0 ? void 0 : _f.longName, cs);
                        }
                        else {
                            programMap.set((_h = (_g = d === null || d === void 0 ? void 0 : d.student) === null || _g === void 0 ? void 0 : _g.program) === null || _h === void 0 ? void 0 : _h.longName, [d]);
                        }
                    }
                    // Return Response
                    return res.status(200).json(Array.from(programMap));
                }
                else {
                    res.status(202).json([]);
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    generateGraduateSessionList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.graduateSession.findFirst({ where: { default: true } });
                if (resp) {
                    // Clean Graduates
                    const dels = yield ais.graduate.deleteMany({
                        where: { graduateSessionId: resp === null || resp === void 0 ? void 0 : resp.id }
                    });
                    // Fetch All students with Completed Status, Graduated Status with Program link
                    let sts = yield ais.student.findMany({
                        where: {
                            completeStatus: true,
                            graduateStatus: false,
                            indexno: { not: null },
                            semesterNum: 0
                        },
                        include: { program: true },
                    });
                    // const targets = ['G0922','G0123','S0922','S0123','B0922','B0123','C0922','C0123','M0922','M0123'];
                    // let sts = await ais.student.findMany({
                    //    where: { 
                    //       completeStatus: true, 
                    //       graduateStatus: false, 
                    //       indexno: { not: null },
                    //       OR: targets.map(target => ({
                    //          indexno: {
                    //            contains: target
                    //          }
                    //       }))
                    //    },
                    //    include: { program: true },
                    // })
                    // PHASE 2
                    // let allStudents = await ais.student.findMany({
                    //    where: {
                    //       completeStatus: true,
                    //       graduateStatus: false,
                    //       indexno: { not: null },
                    //       semesterNum: 0
                    //    },
                    //    include: { 
                    //       program: true 
                    //    },
                    // });
                    // let sts = allStudents.filter((student:any) => {
                    //    // return student.program && student.program.semesterTotal === student.semesterNum;
                    //    return ['G0922','G0123','S0922','S0123','B0922','B0123','C0922','C0123','M0922','M0123'].includes(student?.indexno);
                    // });
                    sts = yield Promise.all(sts.map((st) => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b, _c, _d;
                        let verified = true;
                        let verifiedRemark = [];
                        let incompleteCount = 0;
                        // Get Credit Total
                        const as = yield ais.assessment.aggregate({ _sum: { credit: true }, where: { indexno: st.indexno } }); // Credit Total
                        // Get CGPA for Student
                        let ax = yield ais.assessment.findMany({ where: { indexno: st.indexno }, include: { scheme: true } });
                        let az = ax.reduce((acc, r) => {
                            var _a;
                            // Check for IC
                            if (r.totalScore === undefined || r.totalScore == null)
                                incompleteCount += 1;
                            // Compute Gragepoint
                            const grades = (_a = r.scheme) === null || _a === void 0 ? void 0 : _a.gradeMeta;
                            const gv = (0, helper_1.getGradePoint)((r.totalScore || 0), grades);
                            return acc + (gv * r.credit);
                        }, 0);
                        const cgpa = (az / (((_a = as === null || as === void 0 ? void 0 : as._sum) === null || _a === void 0 ? void 0 : _a.credit) || 0)).toFixed(2);
                        const classes = (ax === null || ax === void 0 ? void 0 : ax.length) ? (_b = ax[0].scheme) === null || _b === void 0 ? void 0 : _b.classMeta : null;
                        const graduateClass = (0, helper_1.getClass)(cgpa, classes);
                        // #1. Check From Resit Table, whether Student doesnt have Pending and Untaken Resits
                        // const rs = await ais.resit.count({ where: { indexno: st.indexno, taken: false } });
                        // const isPassedResit = !Boolean(rs);   
                        const isPassedResit = true;
                        if (!isPassedResit) {
                            verified = false;
                            verifiedRemark.push(`Untaken Resit(s)`);
                        }
                        // #2. Check Whether Total Credit hours in assessment is greater or equal to Program Credit Minimum
                        const isPassedCreditTotal = (((_c = as === null || as === void 0 ? void 0 : as._sum) === null || _c === void 0 ? void 0 : _c.credit) || 0) >= ((_d = st === null || st === void 0 ? void 0 : st.program) === null || _d === void 0 ? void 0 : _d.creditTotal);
                        if (!isPassedCreditTotal) {
                            verified = false;
                            verifiedRemark.push(`Program Credit Minimum Not Met`);
                        }
                        // #3. Check Whether IC or Incomplete Courses exist.
                        if (incompleteCount > 0) {
                            verified = false;
                            verifiedRemark.push(`${incompleteCount} IC(s) Identified`);
                        }
                        if (isPassedCreditTotal && isPassedResit)
                            return yield ais.graduate.upsert({
                                where: { indexno: st === null || st === void 0 ? void 0 : st.indexno },
                                create: { cgpa, verified, verifiedRemark: verifiedRemark ? verifiedRemark === null || verifiedRemark === void 0 ? void 0 : verifiedRemark.join(", ") : null, class: graduateClass, indexno: st === null || st === void 0 ? void 0 : st.indexno, graduateSessionId: resp === null || resp === void 0 ? void 0 : resp.id },
                                update: { cgpa, verified, verifiedRemark: verifiedRemark ? verifiedRemark === null || verifiedRemark === void 0 ? void 0 : verifiedRemark.join(", ") : null, class: graduateClass }
                            });
                        return;
                    })));
                    // Return Response
                    return res.status(200).json(resp);
                }
                else {
                    return res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchGraduateSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.graduateSession.findUnique({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postGraduateSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.graduateSession.create({
                    data: Object.assign({}, req.body),
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateGraduateSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.graduateSession.update({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    data: Object.assign({}, req.body)
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteGraduateSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.graduateSession.delete({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Graduate */
    fetchGraduates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            graduateSession: { default: true },
                            OR: [
                                { student: { id: { contains: keyword } } },
                                { student: { indexno: { contains: keyword } } },
                                { student: { fname: { contains: keyword } } },
                                { student: { lname: { contains: keyword } } },
                                { graduateSession: { title: { contains: keyword } } },
                            ],
                        }
                    };
                const resp = yield ais.$transaction([
                    ais.graduate.count(Object.assign({}, (searchCondition))),
                    ais.graduate.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize), include: {
                            student: { include: { program: true } },
                            graduateSession: true
                        } }))
                ]);
                //if(resp && resp[1]?.length){
                res.status(200).json({
                    totalPages: (_a = Math.ceil(resp[0] / pageSize)) !== null && _a !== void 0 ? _a : 0,
                    totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                    data: resp[1],
                });
                //} else {
                //res.status(202).json({ message: `no records found` })
                //}
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchGraduateList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.graduate.findMany({
                    where: { status: true },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchGraduate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.graduate.findUnique({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    include: { program: true }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    uploadGraduate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                let resp;
                console.log("Data: ", data === null || data === void 0 ? void 0 : data.length);
                if (data === null || data === void 0 ? void 0 : data.length) {
                    let logs = [];
                    const certPrintedBy = req.userId;
                    let count = 0;
                    // for(let row of data){
                    yield Promise.all(data.map((row) => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b, _c, _d, _e, _f;
                        let { certno: certNo, indexno, year, cgpa } = row;
                        // Log Record
                        logs.push({ indexno, graduateSession: `${year} GRADUATION ` });
                        // Get Student Data - Check If  student Exist
                        const st = yield ais.student.findFirst({
                            where: { indexno },
                            include: {
                                program: {
                                    include: {
                                        scheme: {
                                            select: { classMeta: true }
                                        }
                                    }
                                }
                            }
                        });
                        //console.log("st: ", !!st)
                        if (!st)
                            count += 1;
                        if (st === null || st === void 0 ? void 0 : st.indexno) {
                            console.log("st: ", !!st), st === null || st === void 0 ? void 0 : st.fname;
                            try {
                                let graduateSessionId;
                                const classes = ((_b = (_a = st === null || st === void 0 ? void 0 : st.program) === null || _a === void 0 ? void 0 : _a.scheme) === null || _b === void 0 ? void 0 : _b.classMeta) || null;
                                const graduateClass = (0, helper_1.getClass)(cgpa, classes);
                                // Upsert Graduation Session, 
                                const gs = yield ais.graduateSession.findFirst({ where: { title: `${year} GRADUATION` } });
                                if (gs) {
                                    graduateSessionId = gs === null || gs === void 0 ? void 0 : gs.id;
                                }
                                else {
                                    const insGs = yield ais.graduateSession.create({ data: { title: `${year} GRADUATION`, description: `${year} GRADUATION`, start: new Date(`${year}-11-15`), end: new Date(`${year}-11-20`), status: true, default: false } });
                                    console.log("insGs: ", insGs);
                                    graduateSessionId = insGs === null || insGs === void 0 ? void 0 : insGs.id;
                                }
                                // Update Graduation Data and Status
                                const gst = yield ais.graduate.upsert({
                                    where: { indexno: (_c = st === null || st === void 0 ? void 0 : st.indexno) === null || _c === void 0 ? void 0 : _c.trim() },
                                    create: { cgpa: String(cgpa), certNo: String(certNo), class: graduateClass, certPrinted: true, certPrintedAt: new Date(`${year}-11-01`), certPrintedBy, indexno: (_d = st === null || st === void 0 ? void 0 : st.indexno) === null || _d === void 0 ? void 0 : _d.trim(), graduateSessionId },
                                    update: { cgpa: String(cgpa), certNo: String(certNo), class: graduateClass }
                                });
                                if (gst) {
                                    // Remove from Log
                                    logs = logs === null || logs === void 0 ? void 0 : logs.filter((r) => r.indexno != indexno);
                                    // Update CGPA, Graduate Status, Complete Status in Student Model
                                    yield ais.student.update({ where: { id: st === null || st === void 0 ? void 0 : st.id }, data: { graduateStatus: true, completeStatus: true, completeType: 'GRADUATION' } });
                                }
                            }
                            catch (error) {
                                // Remove from Log
                                logs = logs === null || logs === void 0 ? void 0 : logs.filter((r) => r.indexno != indexno);
                                const lg = yield ais.graduateLog.upsert({
                                    where: { indexno_graduateSession: { indexno, graduateSession: `${year} GRADUATION` } },
                                    create: { indexno, graduateSession: `${year} GRADUATION`, reason: (_e = error === null || error === void 0 ? void 0 : error.code) === null || _e === void 0 ? void 0 : _e.toUpperCase() },
                                    update: { reason: (_f = error === null || error === void 0 ? void 0 : error.code) === null || _f === void 0 ? void 0 : _f.toUpperCase() }
                                });
                                console.log(`LOG ${indexno}: `, lg);
                            }
                        }
                        else {
                            // Remove from Log
                            logs = logs === null || logs === void 0 ? void 0 : logs.filter((r) => r.indexno != indexno);
                            // const lg = await ais.graduateLog.create({ data: { indexno, graduateSession: `${year} GRADUATION`, reason: `STUDENT NOT FOUND - CHECK INDEXNO`  }});
                            const lg = yield ais.graduateLog.upsert({
                                where: { indexno_graduateSession: { indexno, graduateSession: `${year} GRADUATION` } },
                                create: { indexno, graduateSession: `${year} GRADUATION`, reason: `STUDENT NOT FOUND` },
                                update: { reason: `STUDENT NOT FOUND` }
                            });
                            console.log(`LOG ${indexno}: `, lg);
                        }
                    })));
                    // 
                    console.log("MAIN LOGS: ", logs === null || logs === void 0 ? void 0 : logs.length);
                    // Commit Skipped Logs
                    yield Promise.all(logs.map((row) => __awaiter(this, void 0, void 0, function* () {
                        const lg = yield ais.graduateLog.upsert({
                            where: { indexno_graduateSession: { indexno: row.indexno, graduateSession: row.graduateSession } },
                            create: { indexno: row.indexno, graduateSession: row.graduateSession, reason: 'STUDENT SKIPPED' },
                            update: { reason: 'STUDENT SKIPPED' }
                        });
                        console.log(`MAIN LOG ${row.indexno}: `, lg);
                    })));
                    resp = data === null || data === void 0 ? void 0 : data.length;
                }
                if (resp) {
                    console.log(resp);
                    res.status(200).json({ success: true, data: resp });
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log("Return Error", error.message);
                return res.status(202).json({ message: error.message });
            }
        });
    }
    uploadGraduateSupplement(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                let resp;
                console.log("Data: ", data === null || data === void 0 ? void 0 : data.length);
                if (data === null || data === void 0 ? void 0 : data.length) {
                    const certPrintedBy = req.userId;
                    let count = 0;
                    // for(let row of data){
                    yield Promise.all(data.map((row) => __awaiter(this, void 0, void 0, function* () {
                        let { indexno } = row;
                        const st = yield ais.student.updateMany({
                            where: { indexno: String(indexno) },
                            data: { graduateStatus: false }
                        });
                        if (st === null || st === void 0 ? void 0 : st.count)
                            count += 1;
                    })));
                    resp = count;
                }
                if (resp) {
                    return res.status(200).json({ success: true, data: resp });
                }
                else {
                    return res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log("Return Error", error.message);
                return res.status(202).json({ message: error.message });
            }
        });
    }
    excludeGraduate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log("body: ", req.body);
            try {
                const resp = yield ais.student.updateMany({
                    where: {
                        indexno: (0, paramStr_1.paramStr)((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id)
                    },
                    data: Object.assign({}, req.body)
                });
                console.log("resp: ", resp);
                if (resp) {
                    res.status(200).json({ success: true, data: resp });
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postGraduate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.graduate.create({
                    data: Object.assign({}, req.body),
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateGraduate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.graduate.update({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    data: Object.assign({}, req.body)
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteGraduate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.graduate.delete({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Academic Broadsheet */
    fetchBroadsheetOld(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Final Year Broadsheet');
                let students = [], courseData = new Map();
                // Get Final and Completing Student
                let finalStudents = yield ais.$queryRaw `select s.fname,s.mname,s.lname,s.indexno,p.longName as program,semesterNum,s.completeStatus,s.deferStatus from ais_student s left join ais_program p on s.programId = p.id where s.semesterNum = p.semesterTotal`;
                const indexnos = finalStudents.filter((r) => r.indexno).map((r) => r.indexno);
                let results = yield ais.assessment.findMany({
                    where: { indexno: { in: indexnos } },
                    include: { course: true }
                });
                results.map((row) => {
                    var _a, _b, _c, _d;
                    if (courseData.has(`${(_a = row.course) === null || _a === void 0 ? void 0 : _a.title} (${row.courseId})`)) {
                        let courseRecs = courseData.get(`${(_b = row.course) === null || _b === void 0 ? void 0 : _b.title} (${row.courseId})`);
                        if (courseRecs[row.indexno])
                            courseRecs[row.indexno].push(row);
                        else
                            courseRecs[row.indexno] = [row];
                        courseData.set(`${(_c = row.course) === null || _c === void 0 ? void 0 : _c.title} (${row.courseId})`, courseRecs);
                    }
                    else {
                        let courseRecs = { [row.indexno]: [row] };
                        courseData.set(`${(_d = row.course) === null || _d === void 0 ? void 0 : _d.title} (${row.courseId})`, courseRecs);
                    }
                });
                students = finalStudents.map((row) => {
                    let studentData = {
                        'INDEX NUMBER': row.indexno,
                        'NAME OF STUDENT': row.fname + ' ' + (row.mname ? row.mname + ' ' : '') + row.lname,
                        'PROGRAM OF STUDY': row.program,
                    };
                    const cs = Object.keys(Object.fromEntries(courseData));
                    for (const key of cs) {
                        // const hasData:any = Array.from(courseData).map(([key, data]: any) => { console.log(Object.values(data)); return Object.values(data) }).flat(1).filter((r: any) => r.indexno == row.indexno && r.courseId == key);
                        const hasData = Array.from(courseData).map(([key, data]) => { console.log(Object.values(data)); return Object.values(data); }).flat(2);
                        // studentData[key] = hasData.length > 1 ? hasData.join(',') : hasData.length == 1 ? (hasData[0].totalScore || ''):'';
                        // studentData[key] = hasData.length > 0 ?  hasData[0].totalScore:'';
                        console.log('hasData: ', hasData);
                    }
                    return studentData;
                });
                // Excel Column names
                const columnNames = Object.keys(students[0]);
                worksheet.columns = columnNames.map((column) => ({ header: column, key: column }));
                // Excel Data
                students.map((student) => worksheet.addRow(student));
                console.log("results: ", Array.from(courseData));
                if (students) {
                    // Excel File
                    //   const buffer = await workbook.xlsx.writeBuffer();
                    const filename = 'Final Year Broadsheet.xlsx';
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
                    // Write the workbook to the response stream
                    yield workbook.xlsx.write(res);
                    res.end();
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    // VIEW SCRIPT:  create view broadsheet as select x.*,o.title,o.semester,o.year,o.createdAt as sessionCreatedAt,m.gradeMeta,m.classMeta,c.title as courseTitle,upper(s.fname) as fname,upper(s.mname) as mname,upper(s.lname) as lname,p.longName as program,p.shortName as programShortName,j.longName as major,j.shortName as majorShortName,p.stype,p.category,s.semesterNum as curSemesterNum,s.completeStatus,s.deferStatus,s.graduateStatus,s.gender,s.entryDate,s.programId,s.majorId,g.cgpa,g.class,s.id as studentId from ais_assessment x left join ais_course c on x.courseId = c.id left join ais_student s on s.indexno = x.indexno left join ais_program p on s.programId = p.id left join ais_major j on s.majorId = j.id left join ais_session o on x.sessionId = o.id left join ais_scheme m on x.schemeId = m.id left join ais_graduate g on s.indexno = g.indexno left join ais_graduate_session n on g.graduateSessionId = n.id where x.indexno in (select s.indexno from ais_student s left join ais_program p on s.programId = p.id where s.semesterNum = 0 and s.completeStatus = 1 order by s.programId,s.indexno,x.semesterNum);
    fetchBroadsheet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { program } = req.body;
                let students = [], courseData = new Map(), finalStudents = new Map();
                let results = yield ais.broadsheet.findMany({
                    where: Object.assign({}, (program && program != 'all' && ({ programId: program }))),
                    orderBy: [
                        { program: 'asc' },
                        { majorId: 'asc' },
                        { lname: 'asc' }
                    ]
                });
                results.map((row) => {
                    // Set Final Year Student Bio
                    if (!finalStudents.has(row.indexno))
                        finalStudents.set(row.indexno, { fname: row.fname, mname: row.mname, lname: row.lname, indexno: row.indexno, semesterNum: row.curSemesterNum, program: row.program, major: row.major, fgpa: row.cgpa, class: row.class });
                    // Set Course & Assessment Data
                    if (courseData.has(`${row.courseTitle} (${row.courseId})`)) {
                        let courseRecs = courseData.get(`${row.courseTitle} (${row.courseId})`);
                        if (courseRecs[row.indexno])
                            courseRecs[row.indexno].push(row);
                        else
                            courseRecs[row.indexno] = [row];
                        courseData.set(`${row.courseTitle} (${row.courseId})`, courseRecs);
                    }
                    else {
                        let courseRecs = { [row.indexno]: [row] };
                        courseData.set(`${row.courseTitle} (${row.courseId})`, courseRecs);
                    }
                });
                // Populate Final Year Broadsheet
                students = Object.keys(Object.fromEntries(finalStudents)).map((rowKey) => {
                    var _a, _b, _c;
                    const studentBio = finalStudents.get(rowKey);
                    let studentData = {
                        'INDEX NUMBER': studentBio.indexno,
                        'STUDENT NAME': studentBio.lname + ', ' + studentBio.fname + ' ' + (studentBio.mname ? studentBio.mname + ' ' : ''),
                        // 'SURNAME': studentBio.lname,
                        // 'OTHERNAME(S)': studentBio.fname + ' ' + (studentBio.mname ? studentBio.mname + ' ' : ''),
                        'STUDY PROGRAM': studentBio.program,
                        'STUDY MAJOR ': studentBio.major,
                        'FGPA': studentBio.fgpa,
                        'CLASS': studentBio.class,
                    };
                    const cs = Object.keys(Object.fromEntries(courseData));
                    for (const cskey of cs) {
                        const hasData2 = (_c = (_b = (_a = Array.from(courseData)) === null || _a === void 0 ? void 0 : _a.filter(([key, _]) => key == cskey)) === null || _b === void 0 ? void 0 : _b.map(([_, data]) => data)[0][rowKey]) !== null && _c !== void 0 ? _c : null;
                        studentData[cskey] = (hasData2 === null || hasData2 === void 0 ? void 0 : hasData2.length) ? hasData2.map((m) => m.totalScore).join(" | ") : '';
                    }
                    return studentData;
                });
                if (students) {
                    res.status(200).json({ type: (_a = req.body) === null || _a === void 0 ? void 0 : _a.type, data: students });
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Circulars */
    fetchNotices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { reference: { contains: keyword } },
                                { title: { contains: keyword } },
                                { receiver: { contains: keyword } },
                            ],
                        }
                    };
                const resp = yield ais.$transaction([
                    ais.informer.count(Object.assign({}, (searchCondition))),
                    ais.informer.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize) }))
                ]);
                //if(resp && resp[1]?.length){
                res.status(200).json({
                    totalPages: (_a = Math.ceil(resp[0] / pageSize)) !== null && _a !== void 0 ? _a : 0,
                    totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                    data: resp[1],
                });
                //} else {
                //res.status(202).json({ message: `no records found` })
                //}
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    sendNotice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.informer.findUnique({
                    where: { id: req.body.noticeId }
                });
                if (resp) {
                    let receivers = [];
                    if (resp.receiver == 'APPLICANT') {
                        const rs = yield ais.applicant.findMany({
                            where: { session: { default: true }, profileId: { not: null } },
                            include: { profile: { select: { phone: true } } }
                        });
                        receivers = rs === null || rs === void 0 ? void 0 : rs.map((r) => { var _a; return (_a = r === null || r === void 0 ? void 0 : r.profile) === null || _a === void 0 ? void 0 : _a.phone; });
                    }
                    else if (resp.receiver == 'FRESHER') {
                        const rs = yield ais.student.findMany({
                            where: { completeStatus: false, deferStatus: false, phone: { not: null } },
                            select: { semesterNum: true, entrySemesterNum: true, phone: true },
                        });
                        receivers = rs === null || rs === void 0 ? void 0 : rs.filter((r) => ((r.semesterNum == r.entrySemesterNum) || (r.semesterNum == r.entrySemesterNum + 1))).map((r) => r === null || r === void 0 ? void 0 : r.phone);
                    }
                    else if (resp.receiver == 'FINAL') {
                        const rs = yield ais.student.findMany({
                            where: { completeStatus: false, deferStatus: false, phone: { not: null } },
                            select: { semesterNum: true, phone: true, program: { select: { semesterTotal: true } } },
                        });
                        receivers = rs === null || rs === void 0 ? void 0 : rs.filter((r) => ((r.semesterNum == r.program.semesterTotal) || (r.semesterNum == r.program.semesterTotal - 1))).map((r) => r === null || r === void 0 ? void 0 : r.phone);
                    }
                    else if (resp.receiver == 'STUDENT') {
                        const rs = yield ais.student.findMany({
                            where: { completeStatus: false, deferStatus: false, phone: { not: null } },
                            select: { phone: true },
                        });
                        receivers = rs === null || rs === void 0 ? void 0 : rs.map((r) => r === null || r === void 0 ? void 0 : r.phone);
                    }
                    else if (resp.receiver == 'UNDERGRAD') {
                        const rs = yield ais.student.findMany({
                            where: { completeStatus: false, deferStatus: false, program: { category: 'UG' }, phone: { not: null } },
                            select: { phone: true },
                        });
                        receivers = rs === null || rs === void 0 ? void 0 : rs.map((r) => r === null || r === void 0 ? void 0 : r.phone);
                    }
                    else if (resp.receiver == 'POSTGRAD') {
                        const rs = yield ais.student.findMany({
                            where: { completeStatus: false, deferStatus: false, program: { category: 'PG' }, phone: { not: null } },
                            select: { phone: true },
                        });
                        receivers = rs === null || rs === void 0 ? void 0 : rs.map((r) => r === null || r === void 0 ? void 0 : r.phone);
                    }
                    else if (resp.receiver == 'ALUMNI') {
                        const rs = yield ais.student.findMany({
                            where: { completeStatus: true, graduateStatus: true, phone: { not: null } },
                            select: { phone: true },
                        });
                        receivers = rs === null || rs === void 0 ? void 0 : rs.map((r) => r === null || r === void 0 ? void 0 : r.phone);
                    }
                    else if (resp.receiver == 'STAFF') {
                        const rs = yield ais.staff.findMany({
                            where: { status: true, phone: { not: null } },
                            select: { phone: true },
                        });
                        receivers = rs === null || rs === void 0 ? void 0 : rs.map((r) => r === null || r === void 0 ? void 0 : r.phone);
                    }
                    else if (resp.receiver == 'HOD') {
                        const rs = yield ais.unit.findMany({
                            where: { type: 'ACADEMIC', levelNum: 2 },
                            select: { phone: true, headStaffNo: true },
                        });
                        receivers = yield Promise.all(rs === null || rs === void 0 ? void 0 : rs.map((r) => __awaiter(this, void 0, void 0, function* () {
                            const st = yield ais.staff.findFirst({ where: { staffNo: r === null || r === void 0 ? void 0 : r.headStaffNo, phone: { not: null } } });
                            return st === null || st === void 0 ? void 0 : st.phone;
                        })));
                    }
                    else if (resp.receiver == 'DEAN') {
                        const rs = yield ais.unit.findMany({
                            where: { type: 'ACADEMIC', levelNum: 1 },
                            select: { phone: true, headStaffNo: true },
                        });
                        receivers = yield Promise.all(rs === null || rs === void 0 ? void 0 : rs.map((r) => __awaiter(this, void 0, void 0, function* () {
                            const st = yield ais.staff.findFirst({ where: { staffNo: r === null || r === void 0 ? void 0 : r.headStaffNo, phone: { not: null } } });
                            return st === null || st === void 0 ? void 0 : st.phone;
                        })));
                    }
                    else if (resp.receiver == 'ASSESSOR') {
                        const rs = yield ais.unit.findMany({
                            where: { type: 'ACADEMIC', levelNum: 1 },
                            select: { phone: true, headStaffNo: true },
                        });
                        receivers = yield Promise.all(rs === null || rs === void 0 ? void 0 : rs.map((r) => __awaiter(this, void 0, void 0, function* () {
                            const st = yield ais.staff.findFirst({ where: { staffNo: r === null || r === void 0 ? void 0 : r.headStaffNo, phone: { not: null } } });
                            return st === null || st === void 0 ? void 0 : st.phone;
                        })));
                    }
                    else if (resp.receiver == 'DEBTOR') {
                        const rs = yield ais.student.findMany({
                            where: { completeStatus: true, deferStatus: true, accountNet: { gt: 0 }, phone: { not: null } },
                            select: { phone: true },
                        });
                        receivers = rs === null || rs === void 0 ? void 0 : rs.map((r) => r === null || r === void 0 ? void 0 : r.phone);
                    }
                    // Clean Receivers phone numbers
                    const send = receivers === null || receivers === void 0 ? void 0 : receivers.map((phone) => __awaiter(this, void 0, void 0, function* () {
                        const mobile = phone.replace('-', '').replace(' ', '').replace('+233', '0').replace('.', '').replace('_', '');
                        console.log(mobile);
                        if ((mobile === null || mobile === void 0 ? void 0 : mobile.length) == 10 || (mobile === null || mobile === void 0 ? void 0 : mobile.length) == 11)
                            return yield sms(mobile, resp.smsContent);
                        return;
                    }));
                    // Return Response
                    res.status(200).json(send);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchNotice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.informer.findUnique({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postNotice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.informer.create({
                    data: Object.assign({}, req.body),
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateNotice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.informer.update({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    data: Object.assign({}, req.body)
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteNotice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.informer.delete({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Deferments */
    fetchDeferments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { student: { id: { contains: keyword } } },
                                { student: { indexno: { contains: keyword } } },
                                { student: { fname: { contains: keyword } } },
                                { student: { lname: { contains: keyword } } },
                                { session: { title: { contains: keyword } } },
                            ],
                        }
                    };
                const resp = yield ais.$transaction([
                    ais.activityDefer.count(Object.assign({}, (searchCondition))),
                    ais.activityDefer.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize), include: {
                            student: { include: { program: true } },
                            session: true
                        } }))
                ]);
                //if(resp && resp[1]?.length){
                res.status(200).json({
                    totalPages: (_a = Math.ceil(resp[0] / pageSize)) !== null && _a !== void 0 ? _a : 0,
                    totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                    data: resp[1],
                });
                //} else {
                //res.status(202).json({ message: `no records found` })
                //}
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchDefermentList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.activityDefer.findMany({
                    where: { status: true },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchDeferment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let resp = yield ais.activityDefer.findUnique({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    include: { student: { include: { program: true } }, session: true }
                });
                if (resp) {
                    // Calculate Resumption 
                    const year = Number((0, moment_1.default)(resp.letterDate).add(resp === null || resp === void 0 ? void 0 : resp.durationInYears, "years").format("YYYY"));
                    const academicYear = `${year}/${year + 1}`;
                    // Fetch Deferment Letter
                    const letter = yield ais.letter.findFirst({ where: { tag: resp.status == 'RESUMED' ? 'res' : 'def' } });
                    resp.letter = Object.assign(Object.assign({}, letter), { academicYear, student: resp === null || resp === void 0 ? void 0 : resp.student });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postDeferment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { indexno, sessionId, semesterNum, reason, durationInYears, start, end, letterDate } = req.body;
                const resp = yield ais.activityDefer.create({
                    data: Object.assign(Object.assign({ semesterNum: Number(semesterNum), reason, durationInYears: Number(durationInYears), start,
                        end,
                        letterDate }, indexno && ({ student: { connect: { indexno } } })), sessionId && ({ session: { connect: { id: sessionId } } })),
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateDeferment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { indexno, sessionId, semesterNum, reason, durationInYears, status, start, end, letterDate } = req.body;
                delete req.body.indexno;
                delete req.body.sessionId;
                let deferStatus = status == 'APPROVED' ? true : false;
                start = ['APPROVED', 'RESUMED'].includes(status) ? (start != null ? start : new Date()) : null;
                end = ['RESUMED'].includes(status) ? (end != null ? end : new Date()) : null;
                const resp = yield ais.activityDefer.update({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    data: Object.assign(Object.assign({ semesterNum: Number(semesterNum), reason, durationInYears: Number(durationInYears), status,
                        start,
                        end,
                        letterDate }, indexno && ({ student: { connect: { indexno } } })), sessionId && ({ session: { connect: { id: sessionId } } }))
                });
                if (resp) {
                    // Update Student Status
                    yield ais.student.update({ where: { indexno }, data: { deferStatus } });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    upgradeDeferment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { indexno, status } = req.body;
                let deferStatus = status == 'APPROVED' ? true : false;
                let start = ['APPROVED'].includes(status) ? new Date() : null;
                let end = ['RESUMED'].includes(status) ? new Date() : null;
                const resp = yield ais.activityDefer.update({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    data: Object.assign(Object.assign({ status }, end && ({ end })), start && ({ start }))
                });
                if (resp) {
                    // Update Student Status
                    yield ais.student.update({ where: { indexno }, data: { deferStatus } });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteDeferment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.activityDefer.delete({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Service Letters */
    fetchLetters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { tag: { contains: keyword } },
                                { title: { contains: keyword } },
                            ],
                        }
                    };
                const resp = yield ais.$transaction([
                    ais.letter.count(Object.assign({}, (searchCondition))),
                    ais.letter.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize) }))
                ]);
                //if(resp && resp[1]?.length){
                res.status(200).json({
                    totalPages: (_a = Math.ceil(resp[0] / pageSize)) !== null && _a !== void 0 ? _a : 0,
                    totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                    data: resp[1],
                });
                //} else {
                //res.status(202).json({ message: `no records found` })
                //}
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchLetterList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.letter.findMany({
                    where: { status: true },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchLetter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.letter.findFirst({
                    where: {
                        OR: [
                            { id: (0, paramStr_1.paramStr)(req.params.id) },
                            { tag: (0, paramStr_1.paramStr)(req.params.id) },
                        ]
                    }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postLetter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.letter.create({
                    data: Object.assign({}, req.body),
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateLetter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.letter.update({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    data: Object.assign({}, req.body)
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteLetter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.letter.delete({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Transwift  */
    fetchTranswifts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { student: { id: { contains: keyword } } },
                                { student: { indexno: { contains: keyword } } },
                                { student: { fname: { contains: keyword } } },
                                { student: { lname: { contains: keyword } } },
                                { issuer: { staffNo: { contains: keyword } } },
                                { transact: { transtag: { contains: keyword } } },
                                { transact: { transtype: { title: { contains: keyword } } } },
                            ],
                        }
                    };
                const resp = yield ais.$transaction([
                    ais.transwift.count(Object.assign({}, (searchCondition))),
                    ais.transwift.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize), orderBy: { 'createdAt': 'desc' }, include: {
                            student: { include: { program: true } },
                            issuer: true,
                            transact: { include: { transtype: true } }
                        } }))
                ]);
                //if(resp && resp[1]?.length){
                res.status(200).json({
                    totalPages: (_a = Math.ceil(resp[0] / pageSize)) !== null && _a !== void 0 ? _a : 0,
                    totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                    data: resp[1],
                });
                //} else {
                //res.status(202).json({ message: `no records found` })
                //}
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchTranswiftList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.transwift.findMany({
                    where: { status: true },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchTranswiftByStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.transwift.findMany({
                    where: { studentId: (0, paramStr_1.paramStr)(req.params.id) },
                    include: {
                        student: { include: { program: true } },
                        transact: { include: { transtype: true } }
                    },
                    orderBy: { 'createdAt': 'desc' }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchTranswift(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.transwift.findUnique({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    include: {
                        student: { include: { program: true } },
                        issuer: true,
                        transact: { include: { transtype: true } }
                    }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postTranswift(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.transwift.create({
                    data: Object.assign({}, req.body),
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    upgradeTranswift(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const {} = req.body;
                const resp = yield ais.transwift.update({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    data: Object.assign({}, req.body)
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateTranswift(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.transwift.update({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    data: Object.assign({}, req.body)
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteTranswift(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.transwift.delete({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Evaluations */
    fetchEvaluations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { page = 1, pageSize = 10, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            try {
                let searchCondition = {};
                if (keyword) {
                    searchCondition = {
                        where: {
                            session: { default: true },
                            OR: [
                                { student: { indexno: { contains: keyword } } },
                                { student: { fname: { contains: keyword } } },
                                { student: { lname: { contains: keyword } } },
                                { student: { id: { contains: keyword } } },
                            ]
                        }
                    };
                }
                const resp = yield ais.$transaction([
                    ais.courseEvaluation.groupBy(Object.assign({ by: ['sessionId', 'indexno'], _count: {
                            indexno: true
                        } }, (searchCondition))),
                    ais.courseEvaluation.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize), include: {
                            student: { include: { program: true } },
                            session: true,
                        }, distinct: ['sessionId', 'indexno'], orderBy: { createdAt: 'desc' } }))
                ]);
                console.log('Evals: ', resp[0].length);
                if (resp && ((_a = resp[1]) === null || _a === void 0 ? void 0 : _a.length)) {
                    console.log('Evals: ', resp);
                    res.status(200).json({
                        totalPages: Math.ceil(resp[0] / pageSize) || 0,
                        totalData: (_b = resp[1]) === null || _b === void 0 ? void 0 : _b.length,
                        data: resp[1]
                    });
                }
                else {
                    res.status(204).json({ message: "No evaluations found" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* App Roles */
    fetchARoleList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.appRole.findMany({
                    where: { status: true },
                    include: {
                        app: { select: { title: true } }
                    },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* User Roles */
    fetchURoleList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { staffId } = req.body;
                const resp = yield ais.userRole.findMany({
                    where: { user: { tag: staffId.toString() } },
                    include: { appRole: { select: { title: true, app: true } } }
                });
                if (resp === null || resp === void 0 ? void 0 : resp.length) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json(error);
            }
        });
    }
    fetchURoles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { page = 1, pageSize = 6, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { title: { contains: keyword } },
                                { id: { contains: keyword } },
                            ],
                        },
                        include: {
                            level1: { select: { title: true, code: true } }
                        },
                    };
                const resp = yield ais.$transaction([
                    ais.userRole.count(Object.assign({}, (searchCondition))),
                    ais.userRole.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize) }))
                ]);
                if (resp && ((_a = resp[1]) === null || _a === void 0 ? void 0 : _a.length)) {
                    res.status(200).json({
                        totalPages: (_b = Math.ceil(resp[0] / pageSize)) !== null && _b !== void 0 ? _b : 0,
                        totalData: (_c = resp[1]) === null || _c === void 0 ? void 0 : _c.length,
                        data: resp[1],
                    });
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchURole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.userRole.findUnique({
                    where: {
                        id: Number((0, paramStr_1.paramStr)(req.params.id))
                    },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postURole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { appRoleId, staffNo } = req.body;
                delete req.body.appRoleId;
                delete req.body.staffNo;
                let allowRole = true;
                let resp;
                const user = yield ais.user.findFirst({ where: { tag: staffNo.toString() } });
                const uroles = yield ais.userRole.findMany({ where: { userId: user === null || user === void 0 ? void 0 : user.id }, include: { appRole: { select: { app: true } } } });
                const urole = yield ais.appRole.findFirst({ where: { id: Number(appRoleId) }, include: { app: true } });
                if (uroles.length && uroles.find((r) => { var _a, _b, _c; return [(_a = urole === null || urole === void 0 ? void 0 : urole.app) === null || _a === void 0 ? void 0 : _a.tag].includes((_c = (_b = r === null || r === void 0 ? void 0 : r.appRole) === null || _b === void 0 ? void 0 : _b.app) === null || _c === void 0 ? void 0 : _c.tag); }))
                    allowRole = false;
                if (!allowRole)
                    throw (`Privilege exists for app`);
                resp = yield ais.userRole.create({
                    data: Object.assign(Object.assign(Object.assign({}, req.body), appRoleId && ({ appRole: { connect: { id: Number(appRoleId) } } })), user && ({ user: { connect: { id: user === null || user === void 0 ? void 0 : user.id } } })),
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateURole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.userRole.update({
                    where: {
                        id: Number((0, paramStr_1.paramStr)(req.params.id))
                    },
                    data: Object.assign({}, req.body)
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteURole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.userRole.delete({
                    where: { id: Number((0, paramStr_1.paramStr)(req.params.id)) }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    checkUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const resp = yield ais.user.findFirst({ where: { tag: userId === null || userId === void 0 ? void 0 : userId.toString() } });
                res.status(200).json(!!resp);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Staff */
    fetchStaffs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { page = 1, pageSize = 6, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { staffNo: { contains: keyword } },
                                { fname: { contains: keyword } },
                                { lname: { contains: keyword } },
                                { phone: { contains: keyword } },
                                { email: { contains: keyword } },
                            ],
                        }
                    };
                const resp = yield ais.$transaction([
                    ais.staff.count(Object.assign({}, (searchCondition))),
                    ais.staff.findMany(Object.assign(Object.assign({}, (searchCondition)), { skip: offset, take: Number(pageSize), include: {
                            title: { select: { label: true } },
                            country: { select: { longName: true } },
                            region: { select: { title: true } },
                            religion: { select: { title: true } },
                            marital: { select: { title: true } },
                            unit: { select: { title: true } },
                            job: { select: { title: true } },
                            //promotion:{ select: { job: { select: { title:true }}}},
                        } }))
                ]);
                if (resp && ((_a = resp[1]) === null || _a === void 0 ? void 0 : _a.length)) {
                    res.status(200).json({
                        totalPages: (_b = Math.ceil(resp[0] / pageSize)) !== null && _b !== void 0 ? _b : 0,
                        totalData: (_c = resp[1]) === null || _c === void 0 ? void 0 : _c.length,
                        data: resp[1],
                    });
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchStaff(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.staff.findUnique({
                    where: {
                        staffNo: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    include: {
                        title: { select: { label: true } },
                        country: { select: { longName: true } },
                        region: { select: { title: true } },
                        religion: { select: { title: true } },
                        marital: { select: { title: true } },
                        unit: { select: { title: true } },
                        job: { select: { title: true } },
                        //promotion:{ select: { job: { select: { title:true }}}},
                    }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    stageStaff(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { staffId } = req.body;
                const password = pwdgen();
                const st = yield ais.staff.findFirst({ where: { staffNo: staffId.toString() } });
                const isUser = yield ais.user.findFirst({ where: { tag: staffId.toString(), groupId: 2 } });
                if (isUser)
                    throw ("Staff User Account Exists!");
                const ssoData = { tag: staffId.toString(), username: (st === null || st === void 0 ? void 0 : st.instituteEmail) ? st === null || st === void 0 ? void 0 : st.instituteEmail.trim() : staffId.toString(), password: sha1(password) }; // Others
                // Populate SSO Account
                const resp = yield ais.user.create({
                    data: Object.assign(Object.assign({}, ssoData), { group: { connect: { id: 2 } } }),
                });
                if (resp) {
                    // Send Password By SMS
                    if (st === null || st === void 0 ? void 0 : st.phone)
                        yield sms(st === null || st === void 0 ? void 0 : st.phone, `Hi! Your new credentials are Username: ${(_a = st === null || st === void 0 ? void 0 : st.instituteEmail) !== null && _a !== void 0 ? _a : staffId}, Password: ${password}`);
                    // Send Password By Email
                    res.status(200).json(Object.assign(Object.assign({}, resp), { password }));
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json(error);
            }
        });
    }
    resetStaff(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { staffId } = req.body;
                const password = pwdgen();
                const st = yield ais.staff.findFirst({ where: { staffNo: staffId.toString() } });
                const resp = yield ais.user.updateMany({
                    where: { tag: staffId.toString(), groupId: 2 },
                    data: { password: sha1(password) },
                });
                if (resp === null || resp === void 0 ? void 0 : resp.count) {
                    if (st === null || st === void 0 ? void 0 : st.phone)
                        yield sms(st === null || st === void 0 ? void 0 : st.phone, `Hi! Your credentials are Username: ${(_a = st === null || st === void 0 ? void 0 : st.instituteEmail) !== null && _a !== void 0 ? _a : staffId}, Password: ${password}`);
                    res.status(200).json({ password });
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json(error);
            }
        });
    }
    staffRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { staffId } = req.body;
                const resp = yield ais.userRole.findMany({
                    where: { user: { tag: staffId.toString() } },
                    include: { appRole: { select: { title: true, app: true } } }
                });
                if (resp === null || resp === void 0 ? void 0 : resp.length) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json(error);
            }
        });
    }
    changeStaffPhoto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { staffId } = req.body;
                const password = pwdgen();
                const resp = yield ais.user.updateMany({
                    where: { tag: staffId },
                    data: { password: sha1(password) },
                });
                if (resp) {
                    res.status(200).json({ password });
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json(error);
            }
        });
    }
    postStaff(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const st = yield ais.staff.findFirst({ where: { staffNo: { notIn: ['16000', '15666'] } }, orderBy: { 'staffNo': 'desc' } });
                const { titleId, maritalId, countryId, regionId, religionId, unitId, jobId } = req.body;
                req.body.staffNo = req.body.staffNo ? (_a = req.body.staffNo) === null || _a === void 0 ? void 0 : _a.toString() : (parseInt(st.staffNo) + 1).toString();
                delete req.body.titleId;
                delete req.body.maritalId;
                delete req.body.countryId;
                delete req.body.regionId;
                delete req.body.religionId;
                delete req.body.unitId;
                delete req.body.jobId;
                req.body.exitDate = req.body.exitDate ? (0, moment_1.default)(req.body.exitDate).toDate() : null;
                req.body.phone = req.body.phone ? req.body.phone : null;
                req.body.email = req.body.email ? req.body.email : null;
                req.body.ssnitNo = req.body.ssnitNo ? req.body.ssnitNo : null;
                req.body.ghcardNo = req.body.ghcardNo ? req.body.ghcardNo : null;
                const resp = yield ais.staff.create({
                    data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), maritalId && ({ marital: { connect: { id: maritalId } } })), titleId && ({ title: { connect: { id: titleId } } })), countryId && ({ country: { connect: { id: countryId } } })), regionId && ({ region: { connect: { id: regionId } } })), religionId && ({ religion: { connect: { id: religionId } } })), unitId && ({ unit: { connect: { id: unitId } } })), jobId && ({ job: { connect: { id: jobId } } }))
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateStaff(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const st = yield ais.staff.findFirst({ where: { staffNo: { notIn: ['16000', '15666'] } }, orderBy: { 'staffNo': 'desc' } });
                const { titleId, maritalId, countryId, regionId, religionId, unitId, jobId, instituteEmail } = req.body;
                delete req.body.titleId;
                delete req.body.maritalId;
                delete req.body.countryId;
                delete req.body.regionId;
                delete req.body.religionId;
                delete req.body.unitId;
                delete req.body.jobId; //   
                req.body.staffNo = req.body.staffNo > 0 ? (_a = req.body.staffNo) === null || _a === void 0 ? void 0 : _a.toString() : (parseInt(st === null || st === void 0 ? void 0 : st.staffNo) + 1).toString();
                req.body.exitDate = req.body.exitDate ? (0, moment_1.default)(req.body.exitDate).toDate() : null;
                req.body.phone = req.body.phone ? req.body.phone : null;
                req.body.email = req.body.email ? req.body.email : null;
                req.body.ssnitNo = req.body.ssnitNo ? req.body.ssnitNo : null;
                req.body.ghcardNo = req.body.ghcardNo ? req.body.ghcardNo : null;
                const resp = yield ais.staff.update({
                    where: { staffNo: (0, paramStr_1.paramStr)(req.params.id) },
                    data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), maritalId && ({ marital: { connect: { id: maritalId } } })), titleId && ({ title: { connect: { id: titleId } } })), countryId && ({ country: { connect: { id: countryId } } })), regionId && ({ region: { connect: { id: regionId } } })), religionId && ({ religion: { connect: { id: religionId } } })), unitId && ({ unit: { connect: { id: unitId } } })), jobId && ({ job: { connect: { id: jobId } } }))
                });
                if (resp) {
                    if ((0, paramStr_1.paramStr)(req.params.id) != req.body.staffNo) {
                        // Update SSO User with New (Tag/Username)
                        yield ais.user.updateMany({ where: { tag: (0, paramStr_1.paramStr)(req.params.id), groupId: 2 }, data: { tag: req.body.staffNo, username: instituteEmail ? instituteEmail : (_b = req.body.staffNo) === null || _b === void 0 ? void 0 : _b.toString() } });
                        // Update Photo FileName
                        const tag = (_c = (0, paramStr_1.paramStr)(req.params.id)) === null || _c === void 0 ? void 0 : _c.toString().split("/").join("").trim().toLowerCase();
                        const dtag = req.body.staffNo.split("/").join("").trim().toLowerCase();
                        var file = path_1.default.join(__dirname, "/../../public/cdn/photo/staff/", tag + '.jpg');
                        var dfile = path_1.default.join(__dirname, "/../../public/cdn/photo/staff/", dtag + '.jpg');
                        var stats = fs_1.default.statSync(file);
                        if (stats)
                            fs_1.default.renameSync(file, dfile);
                    }
                    else {
                        // Update Email as tag in sso_user
                        if (instituteEmail)
                            yield ais.user.updateMany({ where: { tag: (0, paramStr_1.paramStr)(req.params.id) }, data: { username: instituteEmail } });
                    }
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteStaff(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Remove User Account
                yield ais.user.deleteMany({ where: { tag: (0, paramStr_1.paramStr)(req.params.id) } });
                // Hard Delete Staff Record
                const resp = yield ais.staff.delete({ where: { staffNo: (0, paramStr_1.paramStr)(req.params.id) } });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Helpers */
    fetchCountries(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.country.findMany({
                    where: { status: true },
                    orderBy: { createdAt: 'asc' }
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchRegions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.region.findMany({
                    where: { status: true },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchReligions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.religion.findMany({
                    where: { status: true },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchDisabilities(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.disability.findMany({
                    where: { status: true },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.category.findMany({
                    where: { status: true },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchRelations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.relation.findMany({
                    where: { status: true },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchMarital(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.marital.findMany({
                    where: { status: true },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchTitles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.title.findMany({
                    where: { status: true },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchVendors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.vendor.findMany({
                    where: { status: true },
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchCollectors(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.collector.findMany();
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchAppRoles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield ais.appRole.findMany();
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    runData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let resp;
                // const subjects:any = require('../../util/subjects.json');
                // const structure:any = require('../../util/structure.json');
                // const courses:any = require('../../util/courses2.json');
                //  const students = require('../../util/active_student.json');
                //   const staff = require('../../util/staff.json');
                //  const users = require('../../util/users.json');
                //  const jobs = require('../../util/job.json');
                //  const scores = require('../../util/_calendar.json');
                //const scores = require('../../util/_graduate.json');
                //  const scores = require('../../util/units.json');
                // const courses = require('../../util/aucc_courses.json');
                // const courses = require('../../util/courses.json');
                // if(courses.length){
                //   for(const course of courses){
                //      console.log(course)
                //      const ins = await ais.course.create({
                //          data: {
                //             id: course.course_code,
                //             title: course.title?.toUpperCase(),
                //             creditHour: Number(course.credit),
                //             remark:'ACTIVE'
                //          }
                //      })
                //   }
                // }
                //  if(jobs.length){
                //    for(const subj of jobs){
                //       console.log(subj)
                //       const ins = await ais.job.create({
                //           data: {
                //              title: subj?.title, 
                //              type: subj?.type, 
                //              staffCategory: subj?.staff_group, 
                //              status: true
                //           }
                //       })
                //       console.log(ins)
                //    }
                //  }
                // if(students.length){
                //   for(const student of students){
                //      console.log(student)
                //      const ins = await ais.student.create({
                //          data: {
                //             id: student?.refno,
                //             indexno: student.indexno,
                //             fname: student.fname?.toUpperCase(),
                //             mname: student.mname?.toUpperCase(),
                //             lname: student.lname?.toUpperCase(),
                //             ... student?.dob && ({ dob: moment(student?.dob,'YYYY-MM-DD').toDate() }),
                //             ... student?.doa && ({ entryDate: moment(student?.doa,'YYYY-MM-DD').toDate() }),
                //             ... student?.doc && ({ exitDate: moment(student?.doc,'YYYY-MM-DD').toDate() }),
                //             entryGroup: student.entry_group,
                //             semesterNum: Number(student?.semester),
                //             phone: student.phone?.replace("+233","0")?.substring(0,10),
                //             email: student.email,
                //             gender: student.gender,
                //             guardianName: student.guardian_name,
                //             guardianPhone: student.guardian_phone,
                //             instituteEmail: student.institute_email,
                //             completeStatus: student.complete_status == 1 ? true : false,
                //             deferStatus: student.defer_status == 1 ? true : false,
                //             graduateStatus: student.graduate_status == 1 ? true : false,
                //             studyMode: student.session,
                //             ... student?.transact_account && ({ accountNet: parseFloat(student.transact_account) }),
                //             ... student?.entry_semester && ({ entrySemesterNum: Number(student.entry_semester) }),
                //             ... student?.prog_id && ({ program: { connect: { id: student?.prog_id }} }),
                //             ... student?.major_id && ({ major: { connect: { id: student?.major_id }} }),
                //             ... student?.country_id && ({ country: { connect: { id: student?.country_id }} }),
                //             //country: { connect: { id: "96b0a1d5-7899-4b9a-bcbe-7a72eee6572c" } },
                //          }
                //      })
                //   }
                // }
                // if(staff.length){
                //    for(const st of staff){
                //       console.log(st)
                //       const ins = await ais.staff.create({
                //           data: {
                //              staffNo: st?.staff_no?.toString(),
                //              fname: st.fname?.toUpperCase(),
                //              mname: st.mname?.toUpperCase(),
                //              lname: st.lname?.toUpperCase(),
                //              dob: st?.dob && moment(st?.dob,'YYYY-MM-DD').toDate(),
                //              phone: st.phone,
                //              email: st.email,
                //              residentAddress: st.address,
                //              gender: st.gender,
                //              hometown: st.hometown,
                //              birthplace: st.birth_place,
                //              ssnitNo: st.ssnit,
                //              instituteEmail: st.inst_mail,
                //              qualification: st.position,
                //             //  religion: { connect: { id: st.religionId }},
                //             ... st.unit_id && ({ unit: { connect: { id: st.unit_id?.toString() }}}),
                //             ... st.job_id && ({ job: { connect: { id: st.job_id?.toString() }}}),
                //             // job: { connect: { id: st.job_id }},
                //             country: { connect: { id: "96b0a1d5-7899-4b9a-bcbe-7a72eee6572c" }},
                //           }
                //       })
                //    }
                // }
                // if(structure.length){
                //   for(const struct of structure){
                //      console.log(struct)
                //      const ins = await ais.structure.create({
                //          data: {
                //             course: { connect: { id: struct.courseId }},
                //             unit: { connect: { id: struct.unitId }},
                //             program: { connect: { id: struct.programId }},
                //             type: struct.type,
                //             semesterNum: Number(struct.semesterNum),
                //          }
                //      })
                //   }
                // }
                //  if(subjects.length){
                //   for(const subj of subjects){
                //      console.log(subj)
                //      const ins = await ais.subject.create({
                //          data: {
                //             title: subj?.title 
                //          }
                //      })
                //   }
                // }
                // if(scores.length){
                //    for(const st of scores){
                //       console.log(st)
                //       const ins = await ais.assessment.create({
                //           data: {
                //              //indexno: st?.indexno,
                //              credit: Number(st.credit),
                //              semesterNum: Number(st.semesterNum),
                //              classScore: parseFloat(st.classScore),
                //              examScore: parseFloat(st.examScore),
                //              totalScore: parseFloat(st.totalScore),
                //              type: 'N',
                //              session: {
                //                 connect: {
                //                    id: st.sessionId
                //                 }
                //              },
                //              scheme: {
                //                connect: {
                //                   id: st.schemeId
                //                }
                //             },
                //             course: {
                //                connect: {
                //                   id: st.courseId?.trim()
                //                }
                //             },
                //             student: {
                //                connect: {
                //                   indexno: st.indexno?.trim()
                //                }
                //             },
                //           }
                //       })
                //    }
                // }
                //  if(scores.length){
                //   for(const subj of scores){
                //      console.log(subj)
                //      const ins = await ais.unit.create({
                //          data: {
                //             code: subj?.code, 
                //             title: subj?.title, 
                //             type: subj?.type, 
                //             location: subj?.location, 
                //             levelNum: Number(subj?.level), 
                //          }
                //      })
                //   }
                // }
                // if(scores.length){
                //    for(const subj of scores){
                //       console.log(subj)
                //       const ins = await ais.major.create({
                //           data: {
                //              shortName: subj?.title, 
                //              longName: subj?.title, 
                //              status: true
                //           }
                //       })
                //    }
                //  }
                // if(scores.length){
                //    for(const subj of scores){
                //       console.log(subj)
                //       const ins = await ais.program.create({
                //           data: {
                //              code: subj?.code, 
                //              prefix: subj?.prefix, 
                //              shortName: subj?.short, 
                //              longName: subj?.long, 
                //              category: subj?.group_id, 
                //              semesterTotal: Number(subj?.semesters), 
                //              creditTotal: Number(subj?.credits), 
                //           }
                //       })
                //    }
                //  }
                // if(scores.length){
                //    for(const subj of scores){
                //       console.log(subj)
                //       const ins:any = await ais.student.create({
                //          data: {
                //             id: subj?.refno,
                //             indexno: subj.indexno,
                //             fname: subj.fname?.toUpperCase() || '',
                //             mname: subj.mname?.toUpperCase() || '',
                //             lname: subj.lname?.toUpperCase() || '',
                //             //dob: moment(subj?.dob,'DD/MM/YYYY').toDate(),
                //             semesterNum: Number(subj.semester) || 0,
                //             phone: subj.phone,
                //             email: subj.email,
                //             gender: subj.gender,
                //             completeStatus: !!subj.complete_status,
                //             deferStatus: !!subj.defer_status,
                //             graduateStatus: !!subj.graduate_status,
                //             // program: {
                //             //    connect: {
                //             //       id: subj.programId
                //             //    }
                //             // },
                //             country: {
                //                connect: {
                //                   id: "96b0a1d5-7899-4b9a-bcbe-7a72eee6572c"
                //                }
                //             },
                //          },
                //       })
                //    }
                //  }
                // if(scores.length){
                //    for(const subj of scores){
                //       console.log(subj)
                //       const ins:any = await ais.student.upsert({
                //          where: { id: subj?.refno },
                //          create: {
                //             id: subj?.refno,
                //             indexno: subj.indexno,
                //             fname: subj.fname?.toUpperCase() || '',
                //             mname: subj.mname?.toUpperCase() || '',
                //             lname: subj.lname?.toUpperCase() || '',
                //             //dob: moment(subj?.dob,'DD/MM/YYYY').toDate(),
                //             semesterNum: Number(subj.semester) || 0,
                //             phone: subj.phone?.substring(10),
                //             email: subj.email,
                //             gender: subj.gender,
                //             completeStatus: !!subj.complete_status,
                //             deferStatus: !!subj.defer_status,
                //             graduateStatus: !!subj.graduate_status,
                //             // program: {
                //             //    connect: {
                //             //       id: subj.programId
                //             //    }
                //             // },
                //             country: {
                //                connect: {
                //                   id: "96b0a1d5-7899-4b9a-bcbe-7a72eee6572c"
                //                }
                //             },
                //          },
                //          update: {
                //             indexno: subj.indexno,
                //             fname: subj.fname?.toUpperCase() || '',
                //             mname: subj.mname?.toUpperCase() || '',
                //             lname: subj.lname?.toUpperCase() || '',
                //             //dob: moment(subj?.dob,'DD/MM/YYYY').toDate(),
                //             semesterNum: Number(subj.semester) || 0,
                //             phone: subj?.phone?.substring(10),
                //             email: subj.email,
                //             gender: subj.gender,
                //             completeStatus: !!subj.complete_status,
                //             deferStatus: !!subj.defer_status,
                //             graduateStatus: !!subj.graduate_status,
                //             // program: {
                //             //    connect: {
                //             //       id: subj.programId
                //             //    }
                //             // },
                //             country: {
                //                connect: {
                //                   id: "96b0a1d5-7899-4b9a-bcbe-7a72eee6572c"
                //                }
                //             },
                //          },
                //       })
                //    }
                //  }
                //  if(users.length){
                //    for(const subj of users){
                //       console.log(subj)
                //       const ins = await ais.user.create({
                //           data: {
                //              groupId: Number(subj?.group_id), 
                //              tag: subj?.tag, 
                //              username: subj?.username, 
                //              password: subj?.password, 
                //          }
                //       })
                //    }
                //  }
                // if(scores.length){
                //    for(const subj of scores){
                //       console.log(subj)
                //       const ins = await ais.user.upsert({
                //           where: { tag: subj?.tag },
                //           create: {
                //              groupId: Number(subj?.group_id), 
                //              tag: subj?.tag, 
                //              username: subj?.username, 
                //              password: subj?.password, 
                //          },
                //          update: {
                //             username: subj?.username, 
                //             password: subj?.password, 
                //         }
                //       })
                //    }
                //  }
                //  // Calendar
                //  if(scores.length){
                //    for(const subj of scores){
                //       console.log(subj)
                //       const ins = await ais.session.create({
                //          data: {
                //             tag: subj?.tag, 
                //             title: subj?.title, 
                //             year: subj?.academic_year?.toString(), 
                //             semester: subj?.academic_sem == '1' ? 'SEM1':'SEM2', 
                //             default: !!subj?.default, 
                //             status: !!subj?.status
                //          }
                //       })
                //    }
                //  }
                //  // Schemes
                //  if(scores.length){
                //    for(const subj of scores){
                //       console.log(subj)
                //       const ins = await ais.scheme.create({
                //          data: {
                //             title: subj?.title, 
                //             gradeMeta: subj?.grade_meta || null, 
                //             classMeta: subj?.class_meta || null, 
                //             passMark: 0, 
                //          }
                //       })
                //    }
                //  }
                /* ADMISSION MIGRATIONS  */
                //const sessions = require('../../util/ams/session.json');
                //const letters = require('../../util/ams/letter.json');
                const vouchers = require('../../util/ams/voucher.json');
                //  if(vouchers.length){  // VOUCHERS
                //    for(const subj of vouchers){
                //       console.log(subj)
                //       const ins = await ais.voucher.create({
                //           data: {
                //              serial: subj?.serial?.toString(), 
                //              pin: subj?.pin, 
                //              applicantName: subj?.applicant_name, 
                //              applicantPhone: subj?.applicant_phone?.toString()?.substring(0,10), 
                //              sellType: subj?.sell_type, 
                //              status: subj?.status == 1 ? true: false, 
                //              ... subj?.sold_at && ({ soldAt: moment(subj?.sold_at,'YYYY-MM-DD').toDate() }),
                //              ... subj.session_id && ({ admission: { connect: { id: subj.session_id?.toString() }}}),
                //              ... subj.group_id && ({ category: { connect: { id: subj?.group_id }}}),
                //              ... subj.vendor_id && ({ vendor: { connect: { id: subj?.vendor_id }}}),
                //           }
                //       })
                //       console.log(ins)
                //    }
                //  }
                //  if(sessions.length){  // SESSIONS
                //    for(const subj of sessions){
                //       console.log(subj)
                //       const ins = await ais.admission.create({
                //           data: {
                //              title: subj?.title, 
                //              voucherIndex: subj?.voucher_index, 
                //              applyPause: subj?.apply_freeze == 1 ? true: false, 
                //              showAdmitted: subj?.admission_show == 1 ? true: false, 
                //              status: subj?.status == 1 ? true: false, 
                //              ... subj?.exam_start && ({ examStart: moment(subj?.exam_start,'YYYY-MM-DD').toDate() }),
                //              ... subj?.exam_end && ({ examStart: moment(subj?.exam_end,'YYYY-MM-DD').toDate() }),
                //              ... subj?.apply_start && ({ applyStart: moment(subj?.apply_start,'YYYY-MM-DD').toDate() }),
                //              ... subj?.apply_end && ({ applyEnd: moment(subj?.apply_end,'YYYY-MM-DD').toDate() }),
                //              ... subj?.admission_date && ({ admittedAt: moment(subj?.admission_date,'YYYY-MM-DD').toDate() }),
                //              ... subj.pg_letter && ({ pgletter: { connect: { id: subj.pg_letter }}}),
                //              ... subj.ug_letter && ({ ugletter: { connect: { id: subj.ug_letter }}}),
                //              ... subj.dp_letter && ({ dpletter: { connect: { id: subj.dp_letter }}}),
                //              ... subj.cp_letter && ({ cpletter: { connect: { id: subj.cp_letter }}}),
                //            }
                //       })
                //       console.log(ins)
                //    }
                //  }
                //  if(letters.length){
                //    for(const subj of letters){ // LETTERS
                //       console.log(subj)
                //       const ins = await ais.admissionLetter.create({
                //           data: {
                //              title: subj?.title, 
                //              signatory: subj?.signatory, 
                //              signature: subj?.signature, 
                //              template: subj?.template, 
                //              ... subj.tag && ({ category: { connect: { id: subj.tag }}}),
                //              status: subj?.status == 1 ? true: false
                //           }
                //       })
                //       console.log(ins)
                //    }
                //  }
                if (vouchers) {
                    res.status(200).json(vouchers);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    runAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let resp = [];
                const students = yield ais.student.findMany();
                // if(students.length){
                //   for(const student of students){
                //      const ins = await ais.user.create({
                //          data: {
                //             tag: student?.id,
                //             username: student?.id,
                //             password: sha1(student.fname?.toLowerCase()),
                //             unlockPin: '2024',
                //             locked: false,
                //             group: {
                //                connect: {
                //                   id: 1
                //                }
                //             },
                //          }
                //      })
                //      resp.push(ins)
                //   }
                // }
                // if(students){
                //   res.status(200).json(resp)
                // } else {
                //   res.status(202).json({ message: `no record found` })
                // }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    academicStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = (0, paramStr_1.paramStr)(req.params.id);
                // Get Student Info
                const student = yield ais.student.findUnique({ include: { program: { select: { schemeId: true, hasMajor: true } } }, where: { id } });
                const indexno = student === null || student === void 0 ? void 0 : student.indexno;
                // Get Active Sessions Info
                const sessions = yield ais.session.findMany({ where: { default: true } });
                const session = sessions.find((row) => {
                    var _a;
                    const streamTag = ((0, moment_1.default)(student === null || student === void 0 ? void 0 : student.entryDate).format("MM") == '01' && (((student === null || student === void 0 ? void 0 : student.entrySemesterNum) == 1 && ['1', '2'].includes(student === null || student === void 0 ? void 0 : student.semesterNum)) || ((student === null || student === void 0 ? void 0 : student.entrySemesterNum) == 3 && ['3', '4'].includes(student === null || student === void 0 ? void 0 : student.semesterNum)))) ? 'SUB' : 'MAIN';
                    return ((_a = row === null || row === void 0 ? void 0 : row.tag) === null || _a === void 0 ? void 0 : _a.toUpperCase()) == streamTag;
                });
                const assessment = yield ais.assessment.findFirst({ where: { sessionId: id, indexno } });
                const events = {
                    'medicals': { start: session.medicalStart, end: session.medicalEnd },
                    'orientation': { start: session.orientStart, end: session.orientEnd },
                    'matriculation': { start: session.matriculateStart, end: session.matriculateStart },
                    'registration': { start: session.registerStart, end: session.registerEndLate },
                    'examination': { start: session.examStart, end: session.examEnd },
                    'evaluation': { start: session.evaluationStart, end: session.evaluationEnd },
                };
                const event = Object.entries(events).find(([title, row]) => (0, moment_1.default)(new Date()).isBetween((0, moment_1.default)(row === null || row === void 0 ? void 0 : row.start), (0, moment_1.default)(row === null || row === void 0 ? void 0 : row.end)));
                return res.status(200).json({ success: true, data: { student, session, events, event, isRegistered: !!assessment } });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    nextClass(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let resp = [];
                const students = yield ais.student.findMany();
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.default = AisController;
