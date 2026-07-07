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
const client_1 = require("../prisma/client");
const moment_1 = __importDefault(require("moment"));
const helper_1 = require("../util/helper");
const paramStr_1 = require("../util/paramStr");
const sms = require('../config/sms');
const fms = client_1.prisma;
class FmsController {
    /* Reports */
    loadReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { type, program, major, year, mode, session, service, start, end } = req.body;
                let resp = { type };
                if (type == 'payments') {
                    let regs = yield fms.$queryRaw `select s.id,s.fname,s.lname,s.mname,s.indexno,s.gender,s.semesterNum,s.studyMode,t.amount,t.currency,t.transtag,t.createdAt,r.title as transtitle from fms_transaction t left join ais_student s on t.studentId = s.id left join fms_transtype r on t.transtypeId = r.id where t.transtypeId = ${service} and (date(t.createdAt) between date(${start}) and date(${end})) order by t.createdAt ASC`;
                    if (regs.length) {
                        regs = regs.map((r) => ({
                            'SERVICE TYPE': r === null || r === void 0 ? void 0 : r.transtitle,
                            'LAST NAME': r === null || r === void 0 ? void 0 : r.lname,
                            'FIRST NAME': r === null || r === void 0 ? void 0 : r.fname,
                            'MIDDLE NAME(S)': r === null || r === void 0 ? void 0 : r.mname,
                            'INDEX NUMBER': r === null || r === void 0 ? void 0 : r.indexno,
                            'STUDENT ID': r === null || r === void 0 ? void 0 : r.id,
                            'GENDER': r === null || r === void 0 ? void 0 : r.gender,
                            'YEAR': Math.ceil(r.semesterNum / 2),
                            'AMOUNT': r === null || r === void 0 ? void 0 : r.amount,
                            'CURRENCY': r === null || r === void 0 ? void 0 : r.currency,
                            'PAID ON': r.createdAt
                        }));
                        resp = Object.assign(Object.assign({}, resp), { data: regs });
                    }
                }
                else if (type == 'bills') {
                    let regs = yield fms.$queryRaw `select s.id,s.fname,s.lname,s.mname,s.indexno,s.gender,s.semesterNum,s.studyMode,s.entryGroup,t.amount,t.currency,t.createdAt,r.narrative as billtitle from fms_studaccount t left join ais_student s on t.studentId = s.id left join ais_program p on s.programId = p.id left join fms_bill r on t.billId = r.id where s.programId = ${program} and r.sessionId = ${session} order by t.createdAt asc`;
                    // let regs:any = await fms.studentAccount.findMany({ 
                    //    where: {
                    //       billId: { not: null },
                    //       studentId: { not: null },
                    //       ... program && ({ student: { programId: program }}),
                    //       ... major && ({ student: { majorId: major }}),
                    //       ... mode && ({ student: { studyMode: mode }}),
                    //       ... year && ({ student: { semesterNum: { in : [ (Number(year)*2), (Number(year)*2)-1 ] }}}),
                    //    },
                    //    include: { bill: true, student: { include: { program: true, major: true }} },
                    //    // orderBy: [
                    //    //    { student: { programId: 'asc' }},
                    //    //    { student: { majorId: 'asc' }},
                    //    //    { student: { semesterNum: 'asc' }},
                    //    //    { student: { studyMode: 'asc' }},
                    //    //    { student: { lname: 'asc' }},
                    //    // ]
                    // })
                    if (regs.length) {
                        // regs = regs.map((r:any) => ({
                        //    'LAST NAME': r.student?.lname,
                        //    'FIRST NAME': r.student?.fname,
                        //    'MIDDLE NAME(S)': r.student?.mname,
                        //    'INDEX NUMBER': r.student?.indexno,
                        //    'STUDENT ID': r.student?.id,
                        //    'STUDY MODE': r.student?.studyMode,
                        //    'GENDER': r.student?.gender,
                        //    'YEAR': Math.ceil(r.student?.semesterNum/2),
                        //    'PROGRAM': r.student?.program?.shortName,
                        //    'MAJOR': r.student?.major?.shortName,
                        //    'BILL NAME': r.bill?.title,
                        //    'BILL AMOUNT': r.bill?.amount,
                        //    'BILL CURRENCY': r.bill?.currency,
                        //    'STUDENT CATEGORY': r.student?.entryGroup
                        // }))
                        regs = regs.map((r) => {
                            var _a, _b;
                            return ({
                                'LAST NAME': r === null || r === void 0 ? void 0 : r.lname,
                                'FIRST NAME': r === null || r === void 0 ? void 0 : r.fname,
                                'MIDDLE NAME(S)': r === null || r === void 0 ? void 0 : r.mname,
                                'INDEX NUMBER': r === null || r === void 0 ? void 0 : r.indexno,
                                'STUDENT ID': r === null || r === void 0 ? void 0 : r.id,
                                'STUDY MODE': r === null || r === void 0 ? void 0 : r.studyMode,
                                'GENDER': (_a = r.student) === null || _a === void 0 ? void 0 : _a.gender,
                                'YEAR': Math.ceil((r === null || r === void 0 ? void 0 : r.semesterNum) / 2),
                                'PROGRAM': (_b = r === null || r === void 0 ? void 0 : r.program) === null || _b === void 0 ? void 0 : _b.shortName,
                                'BILL NAME': r.billtitle,
                                'BILL AMOUNT': r === null || r === void 0 ? void 0 : r.amount,
                                'BILL CURRENCY': r === null || r === void 0 ? void 0 : r.currency,
                                'STUDENT CATEGORY': r === null || r === void 0 ? void 0 : r.entryGroup
                            });
                        });
                        resp = Object.assign(Object.assign({}, resp), { data: regs });
                    }
                }
                else if (type == 'charges') {
                    let regs = yield fms.$queryRaw `select s.id,s.fname,s.lname,s.mname,s.indexno,s.gender,s.semesterNum,s.studyMode,t.amount,t.currency,t.createdAt,t.title as chargetitle from fms_charge t left join ais_student s on t.studentId = s.id left join ais_program p on p.id = s.id where (date(t.createdAt) between date(${start}) and date(${end})) order by t.createdAt ASC`;
                    // let regs:any = await fms.charge.findMany({ 
                    //    where: {
                    //       ... program && ({ student: { programId: program }}),
                    //       ... major && ({ student: { majorId: major }}),
                    //       ... mode && ({ student: { studyMode: mode }}),
                    //       ... year && ({ semesterNum: { in : [ (Number(year)*2), (Number(year)*2)-1 ] }}),
                    //    },
                    //    include: { student: { include: { program: true, major: true }} },
                    //    orderBy: [
                    //       { student: { programId: 'asc' }},
                    //       { student: { majorId: 'asc' }},
                    //       { student: { semesterNum: 'asc' }},
                    //       { student: { studyMode: 'asc' }},
                    //       { student: { lname: 'asc' }},
                    //    ]
                    // })
                    if (regs.length) {
                        regs = regs.map((r) => ({
                            'LAST NAME': r === null || r === void 0 ? void 0 : r.lname,
                            'FIRST NAME': r === null || r === void 0 ? void 0 : r.fname,
                            'MIDDLE NAME(S)': r === null || r === void 0 ? void 0 : r.mname,
                            'INDEX NUMBER': r === null || r === void 0 ? void 0 : r.indexno,
                            'STUDENT ID': r === null || r === void 0 ? void 0 : r.id,
                            'YEAR': Math.ceil((r === null || r === void 0 ? void 0 : r.semesterNum) / 2),
                            'PROGRAM': r === null || r === void 0 ? void 0 : r.shortName,
                            'CHARGE NAME': r.chargetitle,
                            'CHARGE AMOUNT': r === null || r === void 0 ? void 0 : r.amount,
                            'CHARGE CURRENCY': r === null || r === void 0 ? void 0 : r.currency,
                            'CHARGE DATE': r === null || r === void 0 ? void 0 : r.createdAt,
                        }));
                        resp = Object.assign(Object.assign({}, resp), { data: regs });
                    }
                }
                else if (type == 'debtors') {
                    let regs = yield fms.student.findMany({
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
                            var _a, _b;
                            return ({
                                'LAST NAME': r.lname,
                                'FIRST NAME': r.fname,
                                'MIDDLE NAME(S)': r.mname,
                                'INDEX NUMBER': r.indexno,
                                'STUDENT ID': r.id,
                                'STUDY MODE': r.studyMode,
                                'GENDER': r.gender,
                                'YEAR': Math.ceil(r.semesterNum / 2),
                                'PROGRAM': (_a = r.program) === null || _a === void 0 ? void 0 : _a.shortName,
                                'MAJOR': (_b = r.major) === null || _b === void 0 ? void 0 : _b.shortName,
                                'STUDENT ACCOUNT NET': r.accountNet,
                            });
                        });
                        resp = Object.assign(Object.assign({}, resp), { data: regs });
                    }
                }
                else if (type == 'eligible') {
                    let regs = yield fms.student.findMany({
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
                            var _a, _b;
                            return ({
                                'LAST NAME': r.lname,
                                'FIRST NAME': r.fname,
                                'MIDDLE NAME(S)': r.mname,
                                'INDEX NUMBER': r.indexno,
                                'STUDENT ID': r.id,
                                'STUDY MODE': r.studyMode,
                                'GENDER': r.gender,
                                'YEAR': Math.ceil(r.semesterNum / 2),
                                'PROGRAM': (_a = r.program) === null || _a === void 0 ? void 0 : _a.shortName,
                                'MAJOR': (_b = r.major) === null || _b === void 0 ? void 0 : _b.shortName,
                                'STATUS': r.deferStatus == 1 ? 'Deferred' : 'Active',
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
                // Academics fees
                const ac_today = yield fms.$queryRaw `select ifnull(sum(amount),0) as total from fms_transaction t where transtypeId = 2 and date(createdAt) = date(now())`;
                const ac_week = yield fms.$queryRaw `select ifnull(sum(amount),0) as total from fms_transaction t where transtypeId = 2 and yearweek(createdAt) = yearweek(now())`;
                const ac_month = yield fms.$queryRaw `select ifnull(sum(amount),0) as total from fms_transaction t where transtypeId = 2 and (month(createdAt) = month(now()) and year(createdAt) = year(now()))`;
                const ac_year = yield fms.$queryRaw `select ifnull(sum(amount),0) as total from fms_transaction t where transtypeId = 2 and year(createdAt) = year(now())`;
                // Academic Session Statistics
                const types = yield fms.transtype.findMany({ where: { id: { notIn: [2] } } }); // Transaction Types
                const trans = yield Promise.all(types.map((s) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c;
                    const label = ((_c = (_b = ((_a = s.title) === null || _a === void 0 ? void 0 : _a.replaceAll('FEES', '').replaceAll('FEE', ''))) === null || _b === void 0 ? void 0 : _b.trim()) === null || _c === void 0 ? void 0 : _c.toLowerCase()) + ' payments';
                    const today = yield fms.$queryRaw `select ifnull(sum(amount),0) as total from fms_transaction t where transtypeId = ${s === null || s === void 0 ? void 0 : s.id} and date(createdAt) = date(now())`;
                    const week = yield fms.$queryRaw `select ifnull(sum(amount),0) as total from fms_transaction t where transtypeId = ${s === null || s === void 0 ? void 0 : s.id} and yearweek(createdAt) = yearweek(now())`;
                    const month = yield fms.$queryRaw `select ifnull(sum(amount),0) as total from fms_transaction t where transtypeId = ${s === null || s === void 0 ? void 0 : s.id} and (month(createdAt) = month(now()) and year(createdAt) = year(now()))`;
                    const year = yield fms.$queryRaw `select ifnull(sum(amount),0) as total from fms_transaction t where transtypeId = ${s === null || s === void 0 ? void 0 : s.id} and year(createdAt) = year(now())`;
                    return ({
                        label,
                        today: today[0].total,
                        week: week[0].total,
                        month: month[0].total,
                        year: year[0].total
                    });
                })));
                let data = {
                    feesPayment: {
                        today: ac_today[0].total,
                        week: ac_week[0].total,
                        month: ac_month[0].total,
                        year: ac_year[0].total
                    },
                    otherPayment: trans
                };
                if (data)
                    res.status(200).json(data);
                else
                    res.status(204).json({ message: `no record found` });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Bills */
    fetchBillList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield fms.bill.findMany({
                    where: { status: true },
                    include: { session: true, program: true, bankacc: true },
                    orderBy: { createdAt: 'desc' }
                });
                if (resp) {
                    res.status(200).json(resp);
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
    fetchBills(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { id: { contains: keyword } },
                                { narrative: { contains: keyword } },
                                { session: { title: { contains: keyword } } },
                                { program: { shortName: { contains: keyword } } },
                            ],
                        }
                    };
                const resp = yield fms.$transaction([
                    fms.bill.count(Object.assign({}, (searchCondition))),
                    fms.bill.findMany(Object.assign(Object.assign({}, (searchCondition)), { include: { session: true, program: true, bankacc: true }, skip: offset, take: Number(pageSize), orderBy: { createdAt: 'desc' } }))
                ]);
                if (resp && ((_a = resp[1]) === null || _a === void 0 ? void 0 : _a.length)) {
                    res.status(200).json({
                        totalPages: (_b = Math.ceil(resp[0] / pageSize)) !== null && _b !== void 0 ? _b : 0,
                        totalData: (_c = resp[1]) === null || _c === void 0 ? void 0 : _c.length,
                        data: resp[1],
                    });
                }
                else {
                    res.status(204).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchBill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield fms.bill.findUnique({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    include: { session: true, program: true, bankacc: true },
                });
                if (resp) {
                    res.status(200).json(resp);
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
    includeBill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { tag, action } = req.body;
                let resp;
                const bs = yield fms.bill.findUnique({ where: { id: (0, paramStr_1.paramStr)(req.params.id) } });
                if (action == 'create') {
                    const stdata = { studentId: tag, sessionId: bs === null || bs === void 0 ? void 0 : bs.sessionId, billId: bs === null || bs === void 0 ? void 0 : bs.id, type: 'BILL', narrative: bs === null || bs === void 0 ? void 0 : bs.narrative, currency: bs === null || bs === void 0 ? void 0 : bs.currency, amount: bs === null || bs === void 0 ? void 0 : bs.amount };
                    // Save into Student Account
                    const st = yield fms.studentAccount.findFirst({ where: { studentId: tag, billId: bs === null || bs === void 0 ? void 0 : bs.id } });
                    if (st)
                        yield fms.studentAccount.updateMany({ where: { studentId: tag, billId: bs === null || bs === void 0 ? void 0 : bs.id }, data: stdata });
                    else
                        yield fms.studentAccount.create({ data: stdata });
                    // Update Bill IncludeStudentIds Records
                    const includeStudentIds = (bs === null || bs === void 0 ? void 0 : bs.includeStudentIds) ? [tag, ...bs === null || bs === void 0 ? void 0 : bs.includeStudentIds] : [tag];
                    resp = yield fms.bill.update({ where: { id: (0, paramStr_1.paramStr)(req.params.id) }, data: { includeStudentIds } });
                }
                else {
                    // Delete Bill from Student Account
                    yield fms.studentAccount.deleteMany({ where: { studentId: tag, billId: bs === null || bs === void 0 ? void 0 : bs.id } });
                    // Update Bill IncludeStudentIds Records
                    const includeStudentIds = (_a = bs === null || bs === void 0 ? void 0 : bs.includeStudentIds) === null || _a === void 0 ? void 0 : _a.filter((r) => r != tag);
                    resp = yield fms.bill.update({ where: { id: (0, paramStr_1.paramStr)(req.params.id) }, data: { includeStudentIds } });
                }
                if (resp) {
                    res.status(200).json(resp);
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
    excludeBill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tag, action } = req.body;
                let resp;
                if (action == 'create')
                    resp = yield fms.bill.update({
                        where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                        data: { excludeStudentIds: { jsonb_set: { path: '$', value: { tag }, append: true } } }
                    });
                else
                    resp = yield fms.bill.update({
                        where: { id: (0, paramStr_1.paramStr)(req.params.id), excludeStudentIds: { path: '$', array_contains: tag } },
                        data: {
                            excludeStudentIds: { jsonb_remove: { path: '$' } }
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
                return res.status(202).json({ message: error.message });
            }
        });
    }
    billReceivers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield fms.studentAccount.findMany({
                    where: {
                        billId: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    include: { student: true }
                });
                console.log(resp);
                if (resp === null || resp === void 0 ? void 0 : resp.length) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(202).json({ message: `no record found` });
                }
            }
            catch (error) {
                //console.log(error)
                //return res.status(500).json({ message: error.message }) 
                return res.status(202).json({ message: error.message });
            }
        });
    }
    billActivity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield fms.activityBill.findMany({
                    where: { billId: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp === null || resp === void 0 ? void 0 : resp.length) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `no record found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(204).json({ message: error.message });
            }
        });
    }
    activateBill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const bs = yield fms.bill.findUnique({ where: { id: (0, paramStr_1.paramStr)(req.params.id) }, include: { session: true } });
                if (bs) {
                    let students = [];
                    // Locate Students that Bill should Apply
                    const semesters = yield (0, helper_1.getSemesterFromCode)((_a = bs.session) === null || _a === void 0 ? void 0 : _a.semester, bs.mainGroupCode);
                    const st = (bs === null || bs === void 0 ? void 0 : bs.tag) == 'sub'
                        ? yield fms.$queryRaw `select id from ais_student where programId = ${bs === null || bs === void 0 ? void 0 : bs.programId} and ((date_format(entryDate,'%m') = '01' and semesterNum <= 2) or (date_format(entryDate,'%m') = '01' and semesterNum <= 4 and entrySemesterNum in (3))) and entryGroup = ${bs === null || bs === void 0 ? void 0 : bs.type} and semesterNum in (${semesters}) and deferStatus = 0 and completeStatus = 0`
                        : yield fms.$queryRaw `select id from ais_student where programId = ${bs === null || bs === void 0 ? void 0 : bs.programId} and ((date_format(entryDate,'%m') = '01' and semesterNum > 2) or (date_format(entryDate,'%m') = '01' and semesterNum <= 4 and entrySemesterNum not in (1,3)) or (date_format(entryDate,'%m') <> '01')) and entryGroup = ${bs === null || bs === void 0 ? void 0 : bs.type} and semesterNum in (${semesters}) and deferStatus = 0 and completeStatus = 0`;
                    if (st === null || st === void 0 ? void 0 : st.length)
                        students = [...st.map((r) => r.id)];
                    // Locate Included Students
                    if ((_b = bs === null || bs === void 0 ? void 0 : bs.includeStudentIds) === null || _b === void 0 ? void 0 : _b.length)
                        students = [...students, ...bs === null || bs === void 0 ? void 0 : bs.includeStudentIds];
                    // Remove Excluded Students
                    if ((_c = bs === null || bs === void 0 ? void 0 : bs.excludeStudentIds) === null || _c === void 0 ? void 0 : _c.length)
                        students = students === null || students === void 0 ? void 0 : students.filter((r) => { var _a; return !((_a = bs === null || bs === void 0 ? void 0 : bs.excludeStudentIds) === null || _a === void 0 ? void 0 : _a.includes(r)); });
                    // Insert bills in student accounts
                    if (students === null || students === void 0 ? void 0 : students.length) {
                        // @ts-ignore
                        students = Array.from(new Set(students.map(JSON.stringify))).map(JSON.parse);
                        const stdata = yield Promise.all(students === null || students === void 0 ? void 0 : students.map((r) => __awaiter(this, void 0, void 0, function* () {
                            const ss = yield fms.student.findFirst({ where: { OR: [{ id: r }, { indexno: r }] } });
                            const studentId = ss === null || ss === void 0 ? void 0 : ss.id;
                            // Sanitize Bill
                            //const bi = await fms.studentAccount.findFirst({ where: { studentId, billId: bs?.id }});
                            //if(bi) return null;
                            return ({
                                studentId,
                                sessionId: bs === null || bs === void 0 ? void 0 : bs.sessionId,
                                billId: bs === null || bs === void 0 ? void 0 : bs.id,
                                type: 'BILL',
                                narrative: bs === null || bs === void 0 ? void 0 : bs.narrative,
                                currency: bs === null || bs === void 0 ? void 0 : bs.currency,
                                amount: bs === null || bs === void 0 ? void 0 : bs.amount
                            });
                        })));
                        const ups = yield fms.studentAccount.createMany({ data: stdata });
                        if (ups === null || ups === void 0 ? void 0 : ups.count) {
                            // Retire Student Accounts
                            yield Promise.all(students === null || students === void 0 ? void 0 : students.map((studentId) => __awaiter(this, void 0, void 0, function* () {
                                var _a;
                                const bal = yield fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId } });
                                yield fms.student.update({ where: { id: studentId }, data: { accountNet: (_a = bal === null || bal === void 0 ? void 0 : bal._sum) === null || _a === void 0 ? void 0 : _a.amount } });
                            })));
                        }
                    }
                    // Update bill Status
                    const ds = yield fms.bill.update({ where: { id: (0, paramStr_1.paramStr)(req.params.id) }, data: { posted: true } });
                    if (ds) {
                        // Log Publish Activity & Receipients
                        yield fms.activityBill.create({ data: { billId: bs === null || bs === void 0 ? void 0 : bs.id, amount: bs === null || bs === void 0 ? void 0 : bs.amount, discount: bs === null || bs === void 0 ? void 0 : bs.discount, receivers: students } });
                        // Return Response
                        res.status(200).json(bs);
                    }
                    else {
                        res.status(204).json({ message: `something happened, No bill created` });
                    }
                }
                else {
                    res.status(204).json({ message: `no bill found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    revokeBill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sts = yield fms.studentAccount.findMany({ where: { billId: (0, paramStr_1.paramStr)(req.params.id) } });
                // Update Bill status
                const resp = yield fms.bill.update({ where: { id: (0, paramStr_1.paramStr)(req.params.id) }, data: { posted: false } });
                if ((sts === null || sts === void 0 ? void 0 : sts.length) && resp) {
                    // Remove Bill from student accounts
                    yield fms.studentAccount.deleteMany({ where: { billId: (0, paramStr_1.paramStr)(req.params.id) } });
                    // Retire Student Accounts
                    yield Promise.all(sts === null || sts === void 0 ? void 0 : sts.map((account) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        const { studentId } = account;
                        const bal = yield fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId } });
                        yield fms.student.update({ where: { id: studentId }, data: { accountNet: (_a = bal === null || bal === void 0 ? void 0 : bal._sum) === null || _a === void 0 ? void 0 : _a.amount } });
                    })));
                    // Return Response
                    res.status(200).json(resp);
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
    postBill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { programId, bankaccId, sessionId } = req.body;
                delete req.body.sessionId;
                delete req.body.bankaccId;
                delete req.body.programId;
                const resp = yield fms.bill.create({
                    data: Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), sessionId && ({ session: { connect: { id: sessionId } } })), bankaccId && ({ bankacc: { connect: { id: bankaccId } } })), programId && ({ program: { connect: { id: programId } } }))
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateBill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { programId, bankaccId, sessionId } = req.body;
                delete req.body.sessionId;
                delete req.body.bankaccId;
                delete req.body.programId;
                const resp = yield fms.bill.update({
                    where: {
                        id: (0, paramStr_1.paramStr)(req.params.id)
                    },
                    data: Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), sessionId && ({ session: { connect: { id: sessionId } } })), bankaccId && ({ bankacc: { connect: { id: bankaccId } } })), programId && ({ program: { connect: { id: programId } } }))
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteBill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bs = yield fms.bill.update({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    data: {
                        studentAccount: { deleteMany: { billId: (0, paramStr_1.paramStr)(req.params.id) } }
                    }
                });
                if (bs) {
                    const resp = yield fms.bill.delete({ where: { id: (0, paramStr_1.paramStr)(req.params.id) } });
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `No records deleted` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Charges */
    fetchCharges(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { id: { contains: keyword } },
                                { title: { contains: keyword } },
                                { student: { id: { contains: keyword } } },
                                { student: { indexno: { contains: keyword } } },
                                { student: { fname: { contains: keyword } } },
                                { student: { lname: { contains: keyword } } },
                            ],
                        }
                    };
                const resp = yield fms.$transaction([
                    fms.charge.count(Object.assign({}, (searchCondition))),
                    fms.charge.findMany(Object.assign(Object.assign({}, (searchCondition)), { include: { student: { include: { program: true } } }, skip: offset, take: Number(pageSize), orderBy: { createdAt: 'desc' } }))
                ]);
                if (resp && ((_a = resp[1]) === null || _a === void 0 ? void 0 : _a.length)) {
                    res.status(200).json({
                        totalPages: (_b = Math.ceil(resp[0] / pageSize)) !== null && _b !== void 0 ? _b : 0,
                        totalData: (_c = resp[1]) === null || _c === void 0 ? void 0 : _c.length,
                        data: resp[1],
                    });
                }
                else {
                    res.status(204).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchCharge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield fms.charge.findUnique({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    res.status(200).json(resp);
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
    lateCharge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { studentId } = req.body;
                const st = yield fms.student.findUnique({ where: { id: studentId } });
                const charge = yield fms.transtype.findFirst({ where: { id: 8 } });
                if (st && charge) {
                    const fine = (st === null || st === void 0 ? void 0 : st.entryGroup) == 'GH' ? charge === null || charge === void 0 ? void 0 : charge.amountInGhc : charge === null || charge === void 0 ? void 0 : charge.amountInUsd;
                    const resp = yield fms.charge.create({
                        data: Object.assign(Object.assign({ title: `LATE REGISTRATION FINE`, type: 'FINE', currency: st.entryGroup == 'GH' ? 'GHC' : 'USD', amount: parseFloat(fine), posted: true }, studentId && ({ student: { connect: { id: studentId } } })), { studentAccount: {
                                createMany: {
                                    data: { studentId: st === null || st === void 0 ? void 0 : st.id, currency: st.entryGroup == 'GH' ? 'GHC' : 'USD', amount: parseFloat(fine), type: 'CHARGE', narrative: `LATE REGISTRATION FINE` }
                                }
                            } })
                    });
                    // Retire Accounts
                    const bal = yield fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId } });
                    yield fms.student.update({ where: { id: studentId }, data: { accountNet: (_a = bal === null || bal === void 0 ? void 0 : bal._sum) === null || _a === void 0 ? void 0 : _a.amount } });
                    // Return Response
                    res.status(200).json(resp);
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
    postCharge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const { studentId } = req.body;
                delete req.body.studentId;
                console.log(req.body);
                const resp = yield fms.charge.create({
                    data: Object.assign(Object.assign(Object.assign({}, req.body), studentId && ({ student: { connect: { id: studentId } } })), { studentAccount: {
                            createMany: {
                                data: [{
                                        studentId,
                                        narrative: "test",
                                        amount: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.amount,
                                        type: 'CHARGE',
                                        currency: (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.currency,
                                    }]
                            }
                        } })
                });
                if (resp) {
                    // Retire Account
                    const bal = yield fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId } });
                    yield fms.student.update({ where: { id: studentId }, data: { accountNet: (_c = bal === null || bal === void 0 ? void 0 : bal._sum) === null || _c === void 0 ? void 0 : _c.amount } });
                    // Create record in student account
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateCharge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const { studentId } = req.body;
                delete req.body.studentId;
                const resp = yield fms.charge.update({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    data: Object.assign(Object.assign(Object.assign({}, req.body), studentId && ({ student: { connect: { id: studentId } } })), { studentAccount: {
                            updateMany: {
                                where: { studentId },
                                data: {
                                    studentId,
                                    narrative: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.title,
                                    amount: (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.amount,
                                    type: 'CHARGE',
                                    currency: (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.currency,
                                }
                            }
                        } })
                });
                if (resp) {
                    // Retire Accounts
                    const bal = yield fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId } });
                    yield fms.student.update({ where: { id: studentId }, data: { accountNet: (_d = bal === null || bal === void 0 ? void 0 : bal._sum) === null || _d === void 0 ? void 0 : _d.amount } });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteCharge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const bs = yield fms.charge.update({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    data: { studentAccount: { deleteMany: { chargeId: (0, paramStr_1.paramStr)(req.params.id) } } }
                });
                if (bs) {
                    const { studentId } = bs;
                    const resp = yield fms.charge.delete({ where: { id: (0, paramStr_1.paramStr)(req.params.id) } });
                    // Retire Account
                    const bal = yield fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId } });
                    yield fms.student.update({ where: { id: studentId }, data: { accountNet: (_a = bal === null || bal === void 0 ? void 0 : bal._sum) === null || _a === void 0 ? void 0 : _a.amount } });
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `No records deleted` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Payments */
    fetchPayments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = { where: { transtypeId: { in: [2] } } };
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { id: { contains: keyword } },
                                { transtag: { contains: keyword } },
                                { student: { id: { contains: keyword } } },
                                { student: { indexno: { contains: keyword } } },
                                { student: { fname: { contains: keyword } } },
                                { student: { lname: { contains: keyword } } },
                            ],
                            AND: [
                                { transtypeId: { in: [2] } }
                            ]
                        }
                    };
                const resp = yield fms.$transaction([
                    fms.transaction.count(Object.assign({}, (searchCondition))),
                    fms.transaction.findMany(Object.assign(Object.assign({}, (searchCondition)), { include: { student: { include: { program: true } }, transtype: true }, skip: offset, take: Number(pageSize), orderBy: { createdAt: 'desc' } }))
                ]);
                if (resp && ((_a = resp[1]) === null || _a === void 0 ? void 0 : _a.length)) {
                    res.status(200).json({
                        totalPages: (_b = Math.ceil(resp[0] / pageSize)) !== null && _b !== void 0 ? _b : 0,
                        totalData: (_c = resp[1]) === null || _c === void 0 ? void 0 : _c.length,
                        data: resp[1],
                    });
                }
                else {
                    res.status(204).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchPaymentOthers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = { where: { transtypeId: { notIn: [1, 2] } } };
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { id: { contains: keyword } },
                                { transtag: { contains: keyword } },
                                { student: { id: { contains: keyword } } },
                                { student: { indexno: { contains: keyword } } },
                                { student: { fname: { contains: keyword } } },
                                { student: { lname: { contains: keyword } } },
                                { transtype: { title: { contains: keyword } } },
                            ],
                            AND: [
                                { transtypeId: { notIn: [1, 2] } }
                            ]
                        }
                    };
                const resp = yield fms.$transaction([
                    fms.transaction.count(Object.assign({}, (searchCondition))),
                    fms.transaction.findMany(Object.assign(Object.assign({}, (searchCondition)), { include: { student: { include: { program: true } }, transtype: true }, skip: offset, take: Number(pageSize), orderBy: { createdAt: 'desc' } }))
                ]);
                if (resp && ((_a = resp[1]) === null || _a === void 0 ? void 0 : _a.length)) {
                    res.status(200).json({
                        totalPages: (_b = Math.ceil(resp[0] / pageSize)) !== null && _b !== void 0 ? _b : 0,
                        totalData: (_c = resp[1]) === null || _c === void 0 ? void 0 : _c.length,
                        data: resp[1],
                    });
                }
                else {
                    res.status(204).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchPaymentVouchers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = { where: { transtypeId: { in: [1] } } };
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { transtag: { contains: keyword } },
                                { student: { id: { contains: keyword } } },
                                { student: { indexno: { contains: keyword } } },
                                { student: { fname: { contains: keyword } } },
                                { student: { lname: { contains: keyword } } },
                            ],
                            AND: [
                                { transtypeId: { in: [1] } }
                            ]
                        }
                    };
                const resp = yield fms.$transaction([
                    fms.transaction.count(Object.assign({}, (searchCondition))),
                    fms.transaction.findMany(Object.assign(Object.assign({}, (searchCondition)), { include: { transtype: true, activityFinanceVoucher: true }, skip: offset, take: Number(pageSize), orderBy: { createdAt: 'desc' } }))
                ]);
                if (resp && ((_a = resp[1]) === null || _a === void 0 ? void 0 : _a.length)) {
                    res.status(200).json({
                        totalPages: (_b = Math.ceil(resp[0] / pageSize)) !== null && _b !== void 0 ? _b : 0,
                        totalData: (_c = resp[1]) === null || _c === void 0 ? void 0 : _c.length,
                        data: resp[1],
                    });
                }
                else {
                    res.status(204).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield fms.transaction.findUnique({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    include: { student: { include: { program: true } }, transtype: true },
                });
                if (resp) {
                    res.status(200).json(resp);
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
    convertPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { transactId, transtypeId } = req.body;
                delete req.body.transactId;
                delete req.body.transactId;
                const narrative = `Payment of ${transtypeId == 8 ? 'Graduation' : transtypeId == 3 ? 'Resit' : transtypeId == 8 ? 'Late Registration' : 'Academic'} Fees`;
                const resp = yield fms.transaction.update({
                    where: { id: transactId },
                    data: Object.assign(Object.assign({}, transtypeId && ({ transtype: { connect: { id: transtypeId } } })), transtypeId && [2, 3, 4, 8].includes(Number(transtypeId)) && ({ studentAccount: { updateMany: { data: { narrative } } } }))
                });
                if (resp) {
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const { studentId, transtypeId, bankaccId, collectorId, amount } = req.body;
                delete req.body.studentId;
                delete req.body.transtypeId;
                delete req.body.bankaccId;
                delete req.body.collectorId;
                const narrative = `Payment of ${transtypeId == 8 ? 'Graduation' : transtypeId == 3 ? 'Resit' : transtypeId == 8 ? 'Late Registration' : 'Academic'} Fees`;
                const st = yield fms.student.findUnique({ where: { id: studentId }, select: { entryGroup: true, indexno: true } });
                const resp = yield fms.transaction.create({
                    data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), collectorId && ({ collector: { connect: { id: collectorId } } })), bankaccId && ({ bankacc: { connect: { id: bankaccId } } })), studentId && ({ student: { connect: { id: studentId } } })), transtypeId && ({ transtype: { connect: { id: transtypeId } } })), transtypeId && [2, 3, 4, 8].includes(Number(transtypeId)) && ({ studentAccount: { createMany: { data: [{ studentId, narrative, amount: (-1 * ((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.amount)), type: 'PAYMENT', currency: (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.currency }] } } }))
                });
                if (resp) {
                    // Retire Student Account Balance after Fees,Late,Resit,Graduation transaction
                    if ([2, 3, 4, 8].includes(Number(transtypeId))) {
                        const bal = yield fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId } });
                        yield fms.student.update({ where: { id: studentId }, data: { accountNet: (_c = bal === null || bal === void 0 ? void 0 : bal._sum) === null || _c === void 0 ? void 0 : _c.amount } });
                    }
                    // If Resit - Run Resit operations
                    if (transtypeId == 3) {
                        // Retire Number of Resit Papers
                        const resit_charge = yield fms.transtype.findUnique({ where: { id: Number(transtypeId) } });
                        const pay_count = amount / Math.floor(((st === null || st === void 0 ? void 0 : st.entryGroup) == 'INT' ? resit_charge === null || resit_charge === void 0 ? void 0 : resit_charge.amountInUsd : resit_charge === null || resit_charge === void 0 ? void 0 : resit_charge.amountInGhc));
                        const resits = yield fms.resit.findMany({ where: { indexno: st === null || st === void 0 ? void 0 : st.indexno, paid: false }, take: pay_count });
                        const filters = resits === null || resits === void 0 ? void 0 : resits.map((r) => ({ indexno: r.indexno }));
                        // Update Paid Status of resit_data or papers
                        const ups = yield fms.resit.updateMany({ where: { OR: filters, AND: [{ paid: false }] }, data: { paid: true } });
                        // Get Paid Balance for Extra Resit
                        const unsorted_courses = pay_count - (ups === null || ups === void 0 ? void 0 : ups.count);
                        const resit_balance = pay_count - (ups === null || ups === void 0 ? void 0 : ups.count);
                    }
                    // If Transwift Transtypes - Run Transwift( Attestation, Proficiency, Introductory, Transcript) operations
                    if ([5, 6, 9, 10].includes(Number(transtypeId))) {
                        // Retire Number of Resit Papers
                        const charge = yield fms.transtype.findUnique({ where: { id: Number(transtypeId) } });
                        const count = amount / Math.floor(((st === null || st === void 0 ? void 0 : st.entryGroup) == 'INT' ? charge === null || charge === void 0 ? void 0 : charge.amountInUsd : charge === null || charge === void 0 ? void 0 : charge.amountInGhc));
                        // Create Transwift Requests for Payment
                        const tw = yield fms.transwift.upsert({
                            where: { transactId: resp === null || resp === void 0 ? void 0 : resp.id },
                            create: {
                                studentId,
                                transactId: resp === null || resp === void 0 ? void 0 : resp.id,
                                quantity: count
                            },
                            update: {}
                        });
                    }
                    // If Late fine - Run Late fine operations
                    // Return Response
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updatePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const { studentId, transtypeId, bankaccId, collectorId } = req.body;
                delete req.body.studentId;
                delete req.body.transtypeId;
                delete req.body.bankaccId;
                delete req.body.collectorId;
                let voucher;
                const narrative = `Payment of ${transtypeId == 8 ? 'Graduation' : transtypeId == 3 ? 'Resit' : transtypeId == 8 ? 'Late Registration' : 'Academic'} Fees`;
                if (transtypeId == '1')
                    voucher = yield fms.voucher.findFirst({ where: {}, include: { admission: true } });
                const resp = yield fms.transaction.update({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), collectorId && ({ collector: { connect: { id: collectorId } } })), bankaccId && ({ bankacc: { connect: { id: bankaccId } } })), studentId && ({ student: { connect: { id: studentId } } })), transtypeId && ({ transtype: { connect: { id: transtypeId } } })), transtypeId && ['2', '3', '4', '8'].includes(transtypeId) && ({ studentAccount: { updateMany: { data: { studentId, narrative, amount: (-1 * ((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.amount)), type: 'PAYMENT', currency: (_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.currency } } } }))
                });
                if (resp) {
                    // Retire Student Account Balance after Fees,Late,Resit,Graduation transaction
                    if (['2', '3', '4', '8'].includes(transtypeId)) {
                        const bal = yield fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId } });
                        yield fms.student.update({ where: { id: studentId }, data: { accountNet: (_c = bal === null || bal === void 0 ? void 0 : bal._sum) === null || _c === void 0 ? void 0 : _c.amount } });
                    }
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deletePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bs = yield fms.transaction.update({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    data: {
                        studentAccount: { deleteMany: { transactId: (0, paramStr_1.paramStr)(req.params.id) } },
                        activityFinanceVoucher: { deleteMany: { transactId: (0, paramStr_1.paramStr)(req.params.id) } }
                    }
                });
                if (bs) {
                    const resp = yield fms.transaction.delete({ where: { id: (0, paramStr_1.paramStr)(req.params.id) } });
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `No records deleted` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Bank API Transactions  */
    loadPayServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // LOAD_API_SERVICES
            try {
                const resp = yield fms.transtype.findMany({
                    where: { status: true, visibility: 'PUBLIC' },
                    include: { bankacc: true }
                });
                if (resp === null || resp === void 0 ? void 0 : resp.length) {
                    const data = resp === null || resp === void 0 ? void 0 : resp.map((row) => {
                        return ({ serviceId: row.id, serviceName: row.title, serviceChargeInGHC: row.amountInGhc || 0, serviceChargeInUSD: row.amountInUsd || 0, bankAccount: row.bankacc ? row.bankacc.bankAccount : row.bankaccMeta || 'NONE' });
                    });
                    res.status(200).json({ success: true, data });
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
    loadPayService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const type = (0, paramStr_1.paramStr)(req.params.type);
                const refno = (0, paramStr_1.paramStr)(req.params.refno);
                if (refno && type != 1) {
                    var dt, ft = 0;
                    const st = yield fms.student.findFirst({
                        where: { OR: [{ id: refno }, { indexno: refno }] },
                        include: { program: { select: { shortName: true, category: true } } }
                    });
                    if (st) {
                        let bankAccount = "NONE";
                        const sv = yield fms.transtype.findFirst({ where: { id: 2 } });
                        if (sv) {
                            bankAccount = ((_b = (_a = sv === null || sv === void 0 ? void 0 : sv.bankaccMeta) === null || _a === void 0 ? void 0 : _a.find((r) => { var _a; return r.category == ((_a = st === null || st === void 0 ? void 0 : st.program) === null || _a === void 0 ? void 0 : _a.category); })) === null || _b === void 0 ? void 0 : _b.bankAccount) || 'NONE';
                        }
                        dt = {
                            studentId: st.id,
                            indexno: st.indexno,
                            name: `${st.fname} ${st.mname && st.mname + ' '}${st.lname}`,
                            program: (_c = st === null || st === void 0 ? void 0 : st.program) === null || _c === void 0 ? void 0 : _c.shortName,
                            year: st.semesterNum ? Math.ceil(st.semesterNum / 2) : 'none',
                            serviceId: type,
                            bankAccount
                        };
                        if (type == 2) { /* Student Account Balance */
                            ft = st === null || st === void 0 ? void 0 : st.accountNet;
                        }
                        else if ([4, 8].includes(type)) { /* Graduation, Late Fine  Charges */
                            const ac = yield fms.transtype.findUnique({ where: { id: Number(type) } });
                            if (ac)
                                ft = (st === null || st === void 0 ? void 0 : st.entryGroup) == 'INT' ? ((ac === null || ac === void 0 ? void 0 : ac.amountInUsd) || 0) : ((ac === null || ac === void 0 ? void 0 : ac.amountInGhc) || 0);
                        }
                        else if (type == 3) { /* Resit Charges */
                            const rs = yield fms.resit.count({ where: { paid: false, indexno: st === null || st === void 0 ? void 0 : st.indexno } });
                            const ac = yield fms.transtype.findUnique({ where: { id: Number(type) } });
                            if (ac && rs)
                                ft = st.entryGroup == 'INT' ? (rs === null || rs === void 0 ? void 0 : rs.count) * (ac.amountInUsd || 0) : (rs === null || rs === void 0 ? void 0 : rs.count) * (ac.amountInGhc || 0);
                        }
                        // Return Information
                        return res.status(200).json({ success: true, data: Object.assign(Object.assign({}, dt), { serviceCharge: ft }) });
                    }
                    else {
                        return res.status(200).json({ success: false, data: null, msg: "Invalid Student ID or Index Number" });
                    }
                }
                else if (type == 1) {
                    // LOAD_VOUCHER_FORMS
                    const pr = yield fms.amsPrice.findMany({ where: { status: true } });
                    const sm = yield fms.admission.findFirst({ where: { default: true } });
                    if (pr && sm) {
                        const forms = pr === null || pr === void 0 ? void 0 : pr.map((r) => ({ formId: r.id, formName: r.title, currency: r.currency, serviceCharge: r.amount }));
                        return res.status(200).json({ success: true, data: { serviceId: type, sessionId: sm === null || sm === void 0 ? void 0 : sm.id, title: sm === null || sm === void 0 ? void 0 : sm.title, forms } });
                    }
                    return res.status(403).json({ success: false, data: null, msg: "Invalid request" });
                }
                else {
                    return res.status(403).json({ success: false, data: null, msg: "Invalid request" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    payService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            try {
                const api = req.query.api;
                const cl = yield fms.vendor.findFirst();
                let { serviceId, amountPaid, currency, studentId, refNote, transRef, buyerName, buyerPhone, formId, sessionId } = req.body;
                serviceId = Number(serviceId);
                amountPaid = parseFloat((_a = amountPaid === null || amountPaid === void 0 ? void 0 : amountPaid.toString()) === null || _a === void 0 ? void 0 : _a.replace(",", ""));
                const tr = yield fms.transaction.findFirst({ where: { transtag: transRef } });
                let data = {
                    collectorId: cl.id,
                    transtypeId: serviceId,
                    currency,
                    amount: amountPaid,
                    reference: refNote,
                    studentId: studentId,
                    transtag: transRef,
                };
                /* BUY VOUCHER */
                if (serviceId == 1) {
                    if (!sessionId || sessionId == "")
                        return res.status(200).json({ success: false, data: null, msg: `No Admission Session indicated!` }); // Check for Required but Empty field and return error
                    // Create Transaction
                    console.log("TR: ", tr);
                    if (!tr) {
                        const pr = yield fms.amsPrice.findUnique({ where: { id: formId } });
                        if (!pr)
                            return res.status(200).json({ success: false, data: null, msg: `No Form Category indicated!` });
                        // const vc: any = await fms.voucher.findFirst({ where: { admissionId: sessionId, vendorId: cl?.id, categoryId: pr?.categoryId, sellType: pr?.sellType, soldAt: null, sold: false } });
                        // if (!vc) return res.status(200).json({ success: false, data: null, msg: `Voucher quota exhausted` });
                        const vs = yield fms.$queryRaw `SELECT * FROM ams_voucher WHERE admissionId = ${sessionId} AND vendorId = ${cl === null || cl === void 0 ? void 0 : cl.id} AND categoryId = ${pr === null || pr === void 0 ? void 0 : pr.categoryId} AND sellType = ${pr === null || pr === void 0 ? void 0 : pr.sellType} AND soldAt IS NULL AND sold = 0 order by createdAt asc LIMIT 1`;
                        console.log("Bank API Key: ", api);
                        console.log("VS: ", vs);
                        if (!(vs === null || vs === void 0 ? void 0 : vs.length))
                            return res.status(200).json({ success: false, data: null, msg: `Voucher quota exhausted` });
                        const vc = vs[0] || null;
                        // Send SMS to Buyer
                        const msg = `Hi! Your AUCB Applicant Voucher info are SERIAL: ${vc === null || vc === void 0 ? void 0 : vc.serial}, PIN: ${vc === null || vc === void 0 ? void 0 : vc.pin} Goto https://portal.aucb.edu.gh to apply!`;
                        const send = yield sms(buyerPhone, msg);
                        console.log("Send: ", send);
                        // let send = { code: 1001 };
                        const ins = yield fms.transaction.create({
                            data: Object.assign(Object.assign({}, data), { activityFinanceVoucher: {
                                    createMany: {
                                        data: { serial: vc.serial, pin: vc === null || vc === void 0 ? void 0 : vc.pin, buyerName, buyerPhone, admissionId: sessionId, smsCode: (send === null || send === void 0 ? void 0 : send.code) ? Number(send === null || send === void 0 ? void 0 : send.code) : 0 }
                                    }
                                } })
                        });
                        console.log("Voucher Transaction Created: ", ins);
                        if (ins) {
                            // Update Voucher with details
                            const vs = yield fms.$queryRaw `UPDATE ams_voucher SET applicantName = ${buyerName}, applicantPhone = ${buyerPhone}, soldAt = now(), sold = 1, soldBy = ${'API'} WHERE serial = ${vc === null || vc === void 0 ? void 0 : vc.serial}`;
                            // Send Response
                            return res.status(200).json({ success: true, data: { voucherSerial: vc === null || vc === void 0 ? void 0 : vc.serial, voucherPin: vc === null || vc === void 0 ? void 0 : vc.pin, buyerName, buyerPhone, transId: ins === null || ins === void 0 ? void 0 : ins.id, serviceId } });
                        }
                    }
                    else {
                        const vc = yield fms.activityFinanceVoucher.findFirst({ where: { transactId: tr.id } });
                        if (vc) {
                            // Delete same serials not belonging to same transactId
                            yield fms.$executeRaw `DELETE FROM fms_activity_voucher WHERE serial = ${vc === null || vc === void 0 ? void 0 : vc.serial} AND transactId <> ${tr === null || tr === void 0 ? void 0 : tr.id}`;
                            // Resend Already Generated Voucher
                            const msg = `Hi! AUCB Voucher info are, Serial: ${vc === null || vc === void 0 ? void 0 : vc.serial}, Pin: ${vc === null || vc === void 0 ? void 0 : vc.pin} Goto https://portal.aucb.edu.gh to apply!`;
                            const send = yield sms(buyerPhone, msg);
                            //let send = { code: 1001 };
                            yield fms.activityFinanceVoucher.update({ where: { id: vc.id }, data: { smsCode: (send === null || send === void 0 ? void 0 : send.code) ? Number(send === null || send === void 0 ? void 0 : send.code) : 0 } });
                            return res.status(200).json({
                                success: true,
                                data: {
                                    voucherSerial: vc === null || vc === void 0 ? void 0 : vc.serial,
                                    voucherPin: vc === null || vc === void 0 ? void 0 : vc.pin,
                                    buyerName,
                                    buyerPhone,
                                    transId: tr === null || tr === void 0 ? void 0 : tr.id,
                                    serviceId,
                                },
                            });
                        }
                        return res.status(200).json({ success: false, data: null, msg: `Transaction failed` });
                    }
                    /* OTHER PAYMENT SERVICE (ACADEMIC FEES, RESIT, GRADUATION, ATTESTATION, PROFICIENCY, TRANSCRIPT, LATE FINE ) */
                }
                else {
                    /* PAY FOR SERVICES */
                    const st = yield fms.student.findFirst({ where: { OR: [{ id: studentId }, { indexno: studentId }] }, include: { program: { select: { prefix: true } } } });
                    if (!tr) {
                        const narrative = `Payment of ${serviceId == 8 ? 'Graduation' : serviceId == 3 ? 'Resit' : serviceId == 8 ? 'Late Registration' : 'Academic'} Fees`;
                        data = Object.assign(Object.assign({}, data), { studentId: st === null || st === void 0 ? void 0 : st.id });
                        studentId = st === null || st === void 0 ? void 0 : st.id;
                        const ins = yield fms.transaction.create({
                            data: Object.assign(Object.assign({}, data), serviceId && [2, 3, 4, 8].includes(serviceId) && ({ studentAccount: { createMany: { data: { studentId, narrative, currency, amount: (-1 * amountPaid), type: 'PAYMENT' } } } }))
                        });
                        if (ins) {
                            if ([2, 3, 4, 8].includes(serviceId)) {
                                const bal = yield fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId } });
                                yield fms.student.update({ where: { id: studentId }, data: { accountNet: ((_b = bal === null || bal === void 0 ? void 0 : bal._sum) === null || _b === void 0 ? void 0 : _b.amount) || 0 } });
                            }
                            /* For Resit Payments */
                            if (serviceId == 3) {
                                // Retire Number of Resit Papers
                                const resit_charge = yield fms.transtype.findUnique({ where: { id: Number(serviceId) } });
                                const pay_count = Math.floor(amountPaid / ((st === null || st === void 0 ? void 0 : st.entryGroup) == 'INT' ? resit_charge === null || resit_charge === void 0 ? void 0 : resit_charge.amountInUsd : resit_charge === null || resit_charge === void 0 ? void 0 : resit_charge.amountInGhc));
                                const resits = yield fms.resit.findMany({ where: { indexno: st === null || st === void 0 ? void 0 : st.indexno, paid: false }, take: pay_count });
                                const filters = resits === null || resits === void 0 ? void 0 : resits.map((r) => ({ indexno: r.indexno }));
                                // Update Paid Status of resit_data or papers
                                const ups = yield fms.resit.updateMany({ where: { OR: filters, AND: [{ paid: false }] }, data: { paid: true } });
                            }
                            /* If Transwift Transtypes - Run Transwift( Attestation, Proficiency, Introductory, Transcript) operations */
                            if ([5, 6, 9, 10].includes(Number(serviceId))) {
                                // Retire Number of Documents
                                const charge = yield fms.transtype.findUnique({ where: { id: Number(serviceId) } });
                                const count = amountPaid / Math.floor(((st === null || st === void 0 ? void 0 : st.entryGroup) == 'INT' ? charge === null || charge === void 0 ? void 0 : charge.amountInUsd : charge === null || charge === void 0 ? void 0 : charge.amountInGhc));
                                // Create Transwift Requests for Payment
                                const tw = yield fms.transwift.upsert({
                                    where: { transactId: ins === null || ins === void 0 ? void 0 : ins.id },
                                    create: { studentId, transactId: ins === null || ins === void 0 ? void 0 : ins.id, quantity: count },
                                    update: {}
                                });
                                // Send Follow-up SMS to Student
                                const msg = `Hi! Your document request has been processed, Please go into your portal [https://portal.aucb.edu.gh] to update receipient and required information. Thank you.`;
                                const send = yield sms(st === null || st === void 0 ? void 0 : st.phone, msg);
                            }
                            /* Index Number Generation For Freshers  */
                            if (serviceId == 2 && (st.semesterNum == st.entrySemesterNum)) {
                                // Get student account transaction & Bill + Quota
                                const cx = yield fms.studentAccount.findFirst({ where: { studentId, type: 'BILL' }, include: { bill: { select: { quota: true } } } });
                                const px = yield fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId, type: 'PAYMENT' } });
                                // Compare All Payments to Bill Quota
                                const isPassedIndex = (((_c = px === null || px === void 0 ? void 0 : px._sum) === null || _c === void 0 ? void 0 : _c.amount) >= (((_d = cx === null || cx === void 0 ? void 0 : cx.bill) === null || _d === void 0 ? void 0 : _d.quota) || 0) * (cx === null || cx === void 0 ? void 0 : cx.amount));
                                // Generate Index 
                                if (!(st === null || st === void 0 ? void 0 : st.indexno) && isPassedIndex) {
                                    let indexno;
                                    // const students:any = await fms.$queryRaw`select * from fms_student where date_format(entryDate,'%m%y') = ${moment(st?.entryDate).format("mmyyyy")} and programId = ${st?.programId}`;
                                    const students = yield fms.$queryRaw `select * from ais_student where date_format(entryDate,'%m%y') = ${(0, moment_1.default)(st === null || st === void 0 ? void 0 : st.entryDate).format("MMYY")} and programId = ${st === null || st === void 0 ? void 0 : st.programId} and indexno is not null and (semesterNum = entrySemesterNum)`;
                                    let studentCount = (students === null || students === void 0 ? void 0 : students.length) + 1;
                                    let loop = true;
                                    while (loop) {
                                        // Compute Index Number
                                        const count = studentCount.toString().length == 1 ? `000${studentCount}` : studentCount.toString().length == 2 ? `00${studentCount}` : studentCount.toString().length == 3 ? `0${studentCount}` : studentCount;
                                        indexno = `${(_e = st === null || st === void 0 ? void 0 : st.program) === null || _e === void 0 ? void 0 : _e.prefix}${(0, moment_1.default)((st === null || st === void 0 ? void 0 : st.entryDate) || new Date()).format("MMYY")}${count}`;
                                        // Check If Index Number Exists
                                        const ck = yield fms.student.findFirst({ where: { indexno } });
                                        if (ck) {
                                            studentCount = studentCount + 1;
                                        }
                                        else {
                                            loop = false;
                                        }
                                    }
                                    yield fms.student.update({ where: { id: studentId }, data: { indexno } });
                                    // Send Notfication
                                    const msg = `Hi ${st.fname}! Your AUCB Index number has been generated: ${indexno}, Thank you!`;
                                    yield sms(st === null || st === void 0 ? void 0 : st.phone, msg);
                                }
                            }
                            // Retire Account
                            // Return Response
                            return res.status(200).json({ success: true, data: { transId: ins === null || ins === void 0 ? void 0 : ins.id, studentId, serviceId } });
                        }
                        else {
                            return res.status(200).json({ success: false, data: null, msg: `Transaction failed` });
                        }
                    }
                    else {
                        return res.status(200).json({ success: true, data: { transId: tr === null || tr === void 0 ? void 0 : tr.id, studentId: st === null || st === void 0 ? void 0 : st.id, serviceId } });
                    }
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Student Accounts & Debtors */
    fetchAccounts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { id: { contains: keyword } },
                                { indexno: { contains: keyword } },
                                { fname: { contains: keyword } },
                                { lname: { contains: keyword } },
                            ]
                        }
                    };
                const resp = yield fms.$transaction([
                    fms.student.count(Object.assign({}, (searchCondition))),
                    fms.student.findMany(Object.assign(Object.assign({}, (searchCondition)), { include: { program: true }, skip: offset, take: Number(pageSize) }))
                ]);
                if (resp && ((_a = resp[1]) === null || _a === void 0 ? void 0 : _a.length)) {
                    res.status(200).json({
                        totalPages: (_b = Math.ceil(resp[0] / pageSize)) !== null && _b !== void 0 ? _b : 0,
                        totalData: (_c = resp[1]) === null || _c === void 0 ? void 0 : _c.length,
                        data: resp[1],
                    });
                }
                else {
                    res.status(204).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield fms.studentAccount.findMany({
                    where: { studentId: (0, paramStr_1.paramStr)(req.params.id) },
                    include: {
                        student: { select: { fname: true, mname: true, lname: true, indexno: true, program: { select: { longName: true } } } },
                        bill: { select: { narrative: true } },
                        charge: { select: { title: true } },
                        session: { select: { title: true } },
                        transaction: { select: { transtag: true } },
                    },
                    orderBy: { createdAt: 'asc' }
                });
                if (resp.length) {
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
    fetchDebts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            console.log("Depts");
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = { where: { accountNet: { gt: 0 } } };
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { id: { contains: keyword } },
                                { indexno: { contains: keyword } },
                                { fname: { contains: keyword } },
                                { lname: { contains: keyword } },
                            ],
                            AND: [{ accountNet: { gt: 0 } }]
                        }
                    };
                const resp = yield fms.$transaction([
                    fms.student.count(Object.assign({}, (searchCondition))),
                    fms.student.findMany(Object.assign(Object.assign({}, (searchCondition)), { include: { program: true }, skip: offset, take: Number(pageSize) }))
                ]);
                console.log(resp);
                if (resp && ((_a = resp[1]) === null || _a === void 0 ? void 0 : _a.length)) {
                    res.status(200).json({
                        totalPages: (_b = Math.ceil(resp[0] / pageSize)) !== null && _b !== void 0 ? _b : 0,
                        totalData: (_c = resp[1]) === null || _c === void 0 ? void 0 : _c.length,
                        data: resp[1],
                    });
                }
                else {
                    res.status(204).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    retireAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const st = yield fms.student.findFirst({ where: { OR: [{ id: (0, paramStr_1.paramStr)(req.params.tag) }, { indexno: (0, paramStr_1.paramStr)(req.params.tag) }] } });
                if (st) {
                    // const pays = await fms.transaction.findMany({ where: { studentId: st?.id } });
                    const mt = yield fms.$queryRaw `select sum(amount) as amount from fms_studaccount where studentId = ${st === null || st === void 0 ? void 0 : st.id}`;
                    console.log("Accounts: ", mt);
                    /* Clean Student Account Payments & Repopulate */
                    // Delete Any Transaction Payment in Student Account
                    //  await fms.studentAccount.deleteMany({ where: { 
                    //    studentId: st?.id , transactId: { not: null }
                    //  }})
                    const del = (st === null || st === void 0 ? void 0 : st.indexno)
                        ? yield fms.studentAccount.deleteMany({
                            where: {
                                OR: [{ studentId: st === null || st === void 0 ? void 0 : st.id }, { studentId: st === null || st === void 0 ? void 0 : st.indexno }],
                                AND: [{ transactId: { not: null } }]
                            }
                        })
                        : yield fms.studentAccount.deleteMany({
                            where: {
                                studentId: st === null || st === void 0 ? void 0 : st.id, transactId: { not: null }
                            }
                        });
                    // const pays = st?.indexno 
                    //    ? await fms.transaction.findMany({ where: { 
                    //        OR: [ { studentId: st?.id }, { studentId: st?.indexno } ],
                    //        AND: [ { transtypeId: { in: [2,3,4,8] } } ]
                    //      },
                    //    }) 
                    //    : await fms.transaction.findMany({ where: {  studentId: st?.id, transtypeId: { in: [2,3,4,8] }} });
                    const pays = (st === null || st === void 0 ? void 0 : st.indexno)
                        ? yield fms.$queryRaw `select t.* from fms_transaction t left join ais_student s on ( s.id = t.studentId or s.indexno = t.studentId ) where (t.studentId = ${st === null || st === void 0 ? void 0 : st.id} or t.studentId = ${st === null || st === void 0 ? void 0 : st.indexno}) and t.transtypeId in (2,3,4,8)`
                        : yield fms.transaction.findMany({ where: { studentId: st === null || st === void 0 ? void 0 : st.id, transtypeId: { in: [2, 3, 4, 8] } } });
                    if (pays === null || pays === void 0 ? void 0 : pays.length) {
                        const response = yield Promise.all(pays === null || pays === void 0 ? void 0 : pays.map((r, i) => __awaiter(this, void 0, void 0, function* () {
                            // Check If in Student Account
                            const narrative = `Payment of ${r.transtypeId == 8 ? 'Graduation' : r.transtypeId == 3 ? 'Resit' : r.transtypeId == 8 ? 'Late Registration' : 'Academic'} Fees - ${r.transtag}`;
                            const isExist = yield fms.studentAccount.findFirst({ where: { transactId: r === null || r === void 0 ? void 0 : r.id } });
                            if (!isExist && [2, 3, 4, 8].includes(r.transtypeId)) {
                                const ins = yield fms.studentAccount.create({ data: { studentId: st === null || st === void 0 ? void 0 : st.id, narrative, currency: r.currency, amount: (-1 * r.amount), type: 'PAYMENT', transactId: r.id, createdAt: r.createdAt } });
                            }
                        })));
                        if (response) {
                            const bal = yield fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId: st === null || st === void 0 ? void 0 : st.id } });
                            const ups = yield fms.student.update({ where: { id: st === null || st === void 0 ? void 0 : st.id }, data: { accountNet: (_a = bal === null || bal === void 0 ? void 0 : bal._sum) === null || _a === void 0 ? void 0 : _a.amount } });
                        }
                    }
                    // Return New Balance
                    res.status(200).json(pays === null || pays === void 0 ? void 0 : pays.length);
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
    /* Service charges */
    fetchServiceList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield fms.transtype.findMany({
                    where: { status: true },
                    orderBy: { createdAt: 'desc' }
                });
                if (resp) {
                    res.status(200).json(resp);
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
    fetchServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {
                where: { id: { notIn: [1, 2, 7] } },
                // select: { bankacc: { bankAccount: true } }
            };
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { title: { contains: keyword } },
                            ],
                            AND: [
                                { id: { notIn: [1, 2, 7] } }
                            ]
                        },
                        // select: { bankacc: { bankAccount: true } }
                    };
                const resp = yield fms.$transaction([
                    fms.transtype.count(Object.assign({}, (searchCondition))),
                    fms.transtype.findMany(Object.assign(Object.assign({}, (searchCondition)), { include: { bankacc: true }, skip: offset, take: Number(pageSize) }))
                ]);
                if (resp && ((_a = resp[1]) === null || _a === void 0 ? void 0 : _a.length)) {
                    res.status(200).json({
                        totalPages: (_b = Math.ceil(resp[0] / pageSize)) !== null && _b !== void 0 ? _b : 0,
                        totalData: (_c = resp[1]) === null || _c === void 0 ? void 0 : _c.length,
                        data: resp[1],
                    });
                }
                else {
                    res.status(204).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield fms.transtype.findUnique({
                    where: { id: Number((0, paramStr_1.paramStr)(req.params.id)) }
                });
                if (resp) {
                    res.status(200).json(resp);
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
    postService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                delete req.body.transtypeId;
                const resp = yield fms.transtype.create({
                    data: Object.assign({}, req.body)
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                delete req.body.transtypeId;
                const resp = yield fms.transtype.update({
                    where: {
                        id: Number((0, paramStr_1.paramStr)(req.params.id))
                    },
                    data: Object.assign({}, req.body)
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield fms.transtype.delete({ where: { id: Number((0, paramStr_1.paramStr)(req.params.id)) } });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `No records deleted` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    /* Voucher Costs */
    fetchVsales(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const { page = 1, pageSize = 9, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            let searchCondition = {};
            try {
                if (keyword)
                    searchCondition = {
                        where: {
                            OR: [
                                { title: { contains: keyword } },
                                { category: { title: { contains: keyword } } },
                            ],
                        }
                    };
                const resp = yield fms.$transaction([
                    fms.amsPrice.count(Object.assign({}, (searchCondition))),
                    fms.amsPrice.findMany(Object.assign(Object.assign({}, (searchCondition)), { include: { category: true }, skip: offset, take: Number(pageSize), orderBy: { createdAt: 'desc' } }))
                ]);
                if (resp && ((_a = resp[1]) === null || _a === void 0 ? void 0 : _a.length)) {
                    res.status(200).json({
                        totalPages: (_b = Math.ceil(resp[0] / pageSize)) !== null && _b !== void 0 ? _b : 0,
                        totalData: (_c = resp[1]) === null || _c === void 0 ? void 0 : _c.length,
                        data: resp[1],
                    });
                }
                else {
                    res.status(204).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchVsale(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield fms.amsPrice.findUnique({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) }
                });
                if (resp) {
                    res.status(200).json(resp);
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
    postVsale(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.body;
                delete req.body.categoryId;
                const resp = yield fms.amsPrice.create({
                    data: Object.assign(Object.assign({}, req.body), categoryId && ({ category: { connect: { id: categoryId } } }))
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateVsale(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.body;
                delete req.body.categoryId;
                const resp = yield fms.amsPrice.update({
                    where: { id: (0, paramStr_1.paramStr)(req.params.id) },
                    data: Object.assign(Object.assign({}, req.body), categoryId && ({ category: { connect: { id: categoryId } } }))
                });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `No records found` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteVsale(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield fms.amsPrice.delete({ where: { id: (0, paramStr_1.paramStr)(req.params.id) } });
                if (resp) {
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `No records deleted` });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchBanks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield fms.bankacc.findMany({
                    where: { status: true },
                    orderBy: { createdAt: 'desc' }
                });
                if (resp === null || resp === void 0 ? void 0 : resp.length) {
                    res.status(200).json(resp);
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
}
exports.default = FmsController;
