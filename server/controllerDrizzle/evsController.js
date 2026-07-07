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
const drizzle_orm_1 = require("drizzle-orm");
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const path_1 = __importDefault(require("path"));
const mysqlAdapter_1 = require("../drizzle/mysqlAdapter");
const schema_1 = require("../drizzle/schema"); // Your schema definitions
const paramStr_1 = require("../util/paramStr");
class EvsController {
    // Elections
    fetchAdminElections(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, pageSize = 6, keyword = '' } = req.query;
            const limit = Number(pageSize);
            const offset = (Number(page) - 1) * limit;
            try {
                const searchFilter = keyword ? (0, drizzle_orm_1.or)((0, drizzle_orm_1.like)(schema_1.election.title, `%${keyword}%`)) : undefined;
                const [totalCount, data] = yield mysqlAdapter_1.db.transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    // const countResult = await tx.select({ value: count() }).from(election).where(searchFilter);
                    const countResult = yield tx.$count(schema_1.election, searchFilter);
                    const items = yield tx.query.election.findMany({
                        where: searchFilter,
                        with: { group: true },
                        limit: limit,
                        offset: offset,
                        orderBy: [(0, drizzle_orm_1.desc)(schema_1.election.createdAt)]
                    });
                    // return [countResult[0].value, items];
                    return [countResult, items];
                }));
                if (data.length) {
                    res.status(200).json({
                        totalPages: Math.ceil(totalCount / limit),
                        totalData: data.length,
                        data: data,
                    });
                }
                else {
                    res.status(204).json({ message: `no records found` });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchElections(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield mysqlAdapter_1.db.query.election.findMany({
                    where: (0, drizzle_orm_1.eq)(schema_1.election.status, 1),
                    orderBy: [(0, drizzle_orm_1.desc)(schema_1.election.createdAt)]
                });
                resp.length ? res.status(200).json(resp) : res.status(204).json({ message: `no record found` });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchMyElections(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tag = (0, paramStr_1.paramStr)(req.params.tag);
                const en = yield mysqlAdapter_1.db.select().from(schema_1.election).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.election.status, 1), (0, drizzle_orm_1.or)((0, drizzle_orm_1.sql) `JSON_CONTAINS(${schema_1.election.voterData}, JSON_OBJECT('tag', ${tag}))`, (0, drizzle_orm_1.sql) `JSON_CONTAINS(${schema_1.election.admins}, JSON_QUOTE(${tag}))`)));
                if (en.length) {
                    const resp = yield Promise.all(en.map((r) => __awaiter(this, void 0, void 0, function* () {
                        const ts = yield mysqlAdapter_1.db.select().from(schema_1.elector).where((0, drizzle_orm_1.eq)(schema_1.elector.electionId, r.id));
                        const rs = yield mysqlAdapter_1.db.query.elector.findFirst({
                            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.elector.electionId, r.id), (0, drizzle_orm_1.eq)(schema_1.elector.tag, tag))
                        });
                        return Object.assign(Object.assign({}, r), { turnout: ts.length, voters: ts, voteStatus: !!rs });
                    })));
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `no record found` });
                }
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchElection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number((0, paramStr_1.paramStr)(req.params.id));
                const resp = yield mysqlAdapter_1.db.query.election.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.election.id, id),
                    with: { group: true },
                });
                if (resp) {
                    const tsResult = yield mysqlAdapter_1.db.select({ value: (0, drizzle_orm_1.count)() }).from(schema_1.elector).where((0, drizzle_orm_1.eq)(schema_1.elector.electionId, id));
                    const turnout = tsResult[0].value;
                    const voterData = resp.voterData;
                    const tm = voterData && (yield Promise.all(voterData.map((r) => __awaiter(this, void 0, void 0, function* () {
                        const ts = yield mysqlAdapter_1.db.query.elector.findFirst({
                            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.elector.electionId, id), (0, drizzle_orm_1.eq)(schema_1.elector.tag, r === null || r === void 0 ? void 0 : r.tag))
                        });
                        return Object.assign(Object.assign({}, r), { voteStatus: !!ts });
                    }))));
                    res.status(200).json(Object.assign(Object.assign({}, resp), { voterData: tm, turnout }));
                }
                else {
                    res.status(204).json({ message: `no record found` });
                }
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postElection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let data = Object.assign({}, req.body);
                delete data.logo;
                if (data.startAt)
                    data.startAt = new Date(data.startAt);
                if (data.endAt)
                    data.endAt = new Date(data.endAt);
                if (data.groupId)
                    data.groupId = Number(data.groupId);
                if (data.voterList)
                    data.voterList = JSON.parse(data.voterList);
                const booleanFields = ['status', 'allowMonitor', 'allowVip', 'allowResult', 'allowMask', 'allowEcMonitor', 'allowEcVip', 'allowEcResult', 'autoStop'];
                booleanFields.forEach(field => {
                    if (data[field] !== undefined)
                        data[field] = Boolean(Number(data[field]));
                });
                const logo = (_a = req === null || req === void 0 ? void 0 : req.files) === null || _a === void 0 ? void 0 : _a.logo;
                const [newElection] = yield mysqlAdapter_1.db.insert(schema_1.election).values(data);
                if (newElection) {
                    const folderPath = path_1.default.join(__dirname, "/../../public/cdn/evs", String(newElection.insertId));
                    if (!fs_1.default.existsSync(folderPath))
                        fs_1.default.mkdirSync(folderPath, { recursive: true });
                    if (logo) {
                        const dest = path_1.default.join(__dirname, "/../../public/cdn/photo/evs/", `${newElection.insertId}.png`);
                        logo.mv(dest, (err) => err && console.log(err));
                    }
                    res.status(200).json(newElection);
                }
            }
            catch (error) {
                console.log(error);
                // return res.status(500).json({ message: error.message });
            }
        });
    }
    updateElection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = Number((0, paramStr_1.paramStr)(req.params.id));
                let data = Object.assign({}, req.body);
                delete data.logo;
                if (data.startAt)
                    data.startAt = new Date(data.startAt);
                if (data.endAt)
                    data.endAt = new Date(data.endAt);
                if (data.groupId)
                    data.groupId = Number(data.groupId);
                if (data.voterList)
                    data.voterList = JSON.parse(data.voterList);
                const booleanFields = ['status', 'allowMonitor', 'allowVip', 'allowResult', 'allowMask', 'allowEcMonitor', 'allowEcVip', 'allowEcResult', 'autoStop'];
                booleanFields.forEach(field => {
                    if (data[field] !== undefined)
                        data[field] = Boolean(Number(data[field]));
                });
                const logo = (_a = req === null || req === void 0 ? void 0 : req.files) === null || _a === void 0 ? void 0 : _a.logo;
                yield mysqlAdapter_1.db.update(schema_1.election).set(data).where((0, drizzle_orm_1.eq)(schema_1.election.id, id));
                const updated = yield mysqlAdapter_1.db.query.election.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.election.id, id) });
                if (updated) {
                    if (logo) {
                        const dest = path_1.default.join(__dirname, "/../../public/cdn/photo/evs/", `${id}.png`);
                        logo.mv(dest, (err) => err && console.log(err));
                    }
                    res.status(200).json(updated);
                }
                else {
                    res.status(204).json({ message: `No records found` });
                }
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteElection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number((0, paramStr_1.paramStr)(req.params.id));
                const [resp] = yield mysqlAdapter_1.db.delete(schema_1.election).where((0, drizzle_orm_1.eq)(schema_1.election.id, id));
                resp ? res.status(200).json(resp) : res.status(204).json({ message: `No records found` });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    actionReset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { electionId } = req.body;
                const eid = Number(electionId);
                yield mysqlAdapter_1.db.transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    yield tx.update(schema_1.candidate)
                        .set({ votes: 0 })
                        .where((0, drizzle_orm_1.inArray)(schema_1.candidate.portfolioId, tx.select({ id: schema_1.portfolio.id }).from(schema_1.portfolio).where((0, drizzle_orm_1.eq)(schema_1.portfolio.electionId, eid))));
                    // Delete Electors
                    yield tx.delete(schema_1.elector).where((0, drizzle_orm_1.eq)(schema_1.elector.electionId, eid));
                }));
                res.status(200).json({ success: true });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    actionAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tag, electionId } = req.body;
                const eid = Number(electionId);
                const electionRes = yield mysqlAdapter_1.db.query.election.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.election.id, eid) });
                if (electionRes) {
                    const admins = electionRes.admins || [];
                    const exists = admins.find((r) => (r === null || r === void 0 ? void 0 : r.toLowerCase()) === (tag === null || tag === void 0 ? void 0 : tag.toLowerCase()));
                    const newAdmins = exists
                        ? admins.filter((r) => (r === null || r === void 0 ? void 0 : r.toLowerCase()) !== (tag === null || tag === void 0 ? void 0 : tag.toLowerCase()))
                        : [...admins, tag];
                    const [resp] = yield mysqlAdapter_1.db.update(schema_1.election)
                        .set({ admins: newAdmins })
                        .where((0, drizzle_orm_1.eq)(schema_1.election.id, eid));
                    return resp ? res.status(200).json(resp) : res.status(202).json({ message: `No record found!` });
                }
                return res.status(202).json({ message: `Election not staged!` });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    // Voters & Votes
    postVotes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield mysqlAdapter_1.db.transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c;
                    let { id, tag, votes } = req.body;
                    const ip = req.headers['x-forwarded-for'] ? Array.isArray(req.headers['x-forwarded-for']) ? req.headers['x-forwarded-for'][0] : req.headers['x-forwarded-for'].split(',')[0] : req.socket.remoteAddress;
                    const eid = Number(id);
                    if (!tag || !id)
                        throw new Error(`Request user or ID not found`);
                    // Check if elector is in voterData JSON array
                    const [en] = yield tx.select().from(schema_1.election).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.election.id, eid), (0, drizzle_orm_1.eq)(schema_1.election.status, 1), (0, drizzle_orm_1.sql) `JSON_CONTAINS(${schema_1.election.voterData}, JSON_OBJECT('tag', ${tag}))`));
                    if (!en)
                        throw new Error(`Elector not qualified!`);
                    const ev = yield tx.query.elector.findFirst({
                        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.elector.electionId, eid), (0, drizzle_orm_1.eq)(schema_1.elector.tag, tag))
                    });
                    if (ev)
                        throw new Error(`Elector already voted`);
                    const isGracePeriod = en.action === 'ENDED' && (0, moment_1.default)().diff((0, moment_1.default)(en.endAt), 'seconds') <= 120;
                    if (en.status && (en.action === 'STARTED' || isGracePeriod)) {
                        if (!(votes === null || votes === void 0 ? void 0 : votes.length))
                            throw new Error(`Votes invalid!`);
                        //# Increment candidate votes
                        // for (const cid of votes) {
                        //    await tx.update(candidate)
                        //       .set({ votes: sql`${candidate.votes} + 1` })
                        //       .where(eq(candidate.id, Number(cid)));
                        // }
                        const cs = yield tx.update(schema_1.candidate).set({ votes: (0, drizzle_orm_1.sql) `${schema_1.candidate.votes} + 1` }).where((0, drizzle_orm_1.inArray)(schema_1.candidate.id, votes.map((cid) => Number(cid))));
                        console.log('cs: ', cs);
                        const vs = (_a = en.voterData) === null || _a === void 0 ? void 0 : _a.find((r) => r.tag === tag);
                        const data = {
                            voteStatus: true,
                            voteSum: votes.join(","),
                            voteTime: (0, moment_1.default)().format("YYYY-MM-DD HH:mm:ss"),
                            voteIp: ip,
                            name: vs === null || vs === void 0 ? void 0 : vs.name,
                            tag,
                            electionId: eid
                        };
                        const [electorRes] = yield tx.insert(schema_1.elector).values(data);
                        const newElector = yield tx.query.elector.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.elector.id, Number(electorRes.insertId)) });
                        // Handle Socket Broadcast
                        const allPortfolios = yield mysqlAdapter_1.db.query.portfolio.findMany({
                            where: (0, drizzle_orm_1.eq)(schema_1.portfolio.electionId, eid),
                            with: {
                                candidate: {
                                    where: (0, drizzle_orm_1.eq)(schema_1.candidate.status, 1),
                                    with: { portfolio: true },
                                    orderBy: [(0, drizzle_orm_1.desc)(schema_1.candidate.votes), (0, drizzle_orm_1.asc)(schema_1.candidate.orderNo)]
                                }
                            }
                        });
                        const allElectors = yield mysqlAdapter_1.db.select().from(schema_1.elector).where((0, drizzle_orm_1.eq)(schema_1.elector.electionId, eid));
                        if ((_c = (_b = req.app) === null || _b === void 0 ? void 0 : _b.locals) === null || _c === void 0 ? void 0 : _c.broadcastElection) {
                            req.app.locals.broadcastElection(eid, { election: en, portfolio: allPortfolios, elector: allElectors });
                        }
                        return newElector;
                    }
                    else {
                        throw new Error(`Election is closed!`);
                    }
                }));
                res.status(200).json(result);
            }
            catch (error) {
                console.log(error);
                return res.status(203).json({ message: error.message });
            }
        });
    }
    fetchVotes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const eid = Number((0, paramStr_1.paramStr)(req.params.id));
                const electionRes = yield mysqlAdapter_1.db.query.election.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.election.id, eid) });
                const electors = yield mysqlAdapter_1.db.select().from(schema_1.elector).where((0, drizzle_orm_1.eq)(schema_1.elector.electionId, eid));
                let portfolios = yield mysqlAdapter_1.db.query.portfolio.findMany({
                    where: (0, drizzle_orm_1.eq)(schema_1.portfolio.electionId, eid),
                    with: {
                        candidate: {
                            where: (0, drizzle_orm_1.eq)(schema_1.candidate.status, 1),
                            with: { portfolio: true },
                            orderBy: [(0, drizzle_orm_1.desc)(schema_1.candidate.votes), (0, drizzle_orm_1.asc)(schema_1.candidate.orderNo)]
                        }
                    }
                });
                portfolios = portfolios.map((r) => (Object.assign(Object.assign({}, r), { candidates: r.candidate })));
                if (electionRes && portfolios) {
                    res.status(200).json({
                        election: electionRes,
                        portfolios,
                        electors
                    });
                }
                else {
                    res.status(204).json({ message: `no records found` });
                }
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchVoters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield mysqlAdapter_1.db.query.election.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.election.id, Number((0, paramStr_1.paramStr)(req.params.id))),
                    columns: { voterData: true }
                });
                resp ? res.status(200).json(resp.voterData) : res.status(204).json({ message: `no record found` });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchVoter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tag = (0, paramStr_1.paramStr)(req.params.tag);
                const id = Number((0, paramStr_1.paramStr)(req.params.id));
                const resp = yield mysqlAdapter_1.db.query.election.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.election.id, id),
                });
                if (resp) {
                    const voterData = resp.voterData || [];
                    const voter = voterData.find((r) => r.tag == tag);
                    // Check Vote Status
                    const vs = yield mysqlAdapter_1.db.query.elector.findFirst({
                        where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.elector.electionId, id), (0, drizzle_orm_1.eq)(schema_1.elector.tag, tag))
                    });
                    res.status(200).json(Object.assign(Object.assign({}, resp), { voter, voteStatus: !!vs }));
                }
                else {
                    res.status(204).json({ message: `no record found` });
                }
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    setupVoters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const eid = Number(req.body.electionId);
                const en = yield mysqlAdapter_1.db.query.election.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.election.id, eid),
                    columns: { voterList: true, groupId: true }
                });
                if (en && ((_a = en.voterList) === null || _a === void 0 ? void 0 : _a.length)) {
                    const list = en.voterList;
                    const voters = yield Promise.all(list.map((r) => __awaiter(this, void 0, void 0, function* () {
                        let ts;
                        if (en.groupId === 1) {
                            ts = yield mysqlAdapter_1.db.query.student.findFirst({
                                where: (0, drizzle_orm_1.eq)(schema_1.student.id, r),
                                columns: { fname: true, mname: true, lname: true, id: true, phone: true }
                            });
                        }
                        else {
                            ts = yield mysqlAdapter_1.db.query.staff.findFirst({
                                where: (0, drizzle_orm_1.eq)(schema_1.staff.staffNo, r),
                                columns: { fname: true, mname: true, lname: true, staffNo: true, phone: true }
                            });
                        }
                        const us = yield mysqlAdapter_1.db.query.user.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.user.tag, r) });
                        return {
                            tag: (ts === null || ts === void 0 ? void 0 : ts.id) || (ts === null || ts === void 0 ? void 0 : ts.staffNo),
                            name: `${ts === null || ts === void 0 ? void 0 : ts.fname} ${(ts === null || ts === void 0 ? void 0 : ts.mname) ? (ts === null || ts === void 0 ? void 0 : ts.mname) + ' ' : ''}${ts === null || ts === void 0 ? void 0 : ts.lname}`,
                            username: us === null || us === void 0 ? void 0 : us.username,
                            pin: us === null || us === void 0 ? void 0 : us.unlockPin,
                            phone: ts === null || ts === void 0 ? void 0 : ts.phone
                        };
                    })));
                    const [updated] = yield mysqlAdapter_1.db.update(schema_1.election)
                        .set({ voterData: voters })
                        .where((0, drizzle_orm_1.eq)(schema_1.election.id, eid));
                    return res.status(200).json(updated);
                }
                return res.status(202).json({ message: `Voter register not populated` });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postVoter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tag, name } = req.body;
                const id = Number((0, paramStr_1.paramStr)(req.params.id));
                const [resp] = yield mysqlAdapter_1.db.update(schema_1.election)
                    .set({
                    voterData: (0, drizzle_orm_1.sql) `JSON_ARRAY_APPEND(COALESCE(${schema_1.election.voterData}, '[]'), '$', CAST(${JSON.stringify({ tag, name })} AS JSON))`
                })
                    .where((0, drizzle_orm_1.eq)(schema_1.election.id, id));
                resp ? res.status(200).json(resp) : res.status(204).json({ message: `no record found` });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteVoter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tag = (0, paramStr_1.paramStr)(req.params.tag);
                const id = Number((0, paramStr_1.paramStr)(req.params.id));
                const en = yield mysqlAdapter_1.db.query.election.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.election.id, id) });
                if (en) {
                    const currentVoters = en.voterData || [];
                    const newVoters = currentVoters.filter((v) => v.tag !== tag);
                    const [resp] = yield mysqlAdapter_1.db.update(schema_1.election)
                        .set({ voterData: newVoters })
                        .where((0, drizzle_orm_1.eq)(schema_1.election.id, id));
                    res.status(200).json(resp);
                }
                else {
                    res.status(204).json({ message: `no record found` });
                }
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchReceipt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tag = (0, paramStr_1.paramStr)(req.params.tag);
                const id = (0, paramStr_1.paramStr)(req.params.id);
                const resp = yield mysqlAdapter_1.db.query.elector.findFirst({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.elector.tag, tag), (0, drizzle_orm_1.eq)(schema_1.elector.electionId, Number(id)))
                });
                resp ? res.status(200).json(resp) : res.status(204).json({ message: `no record found` });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchPortfolios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield mysqlAdapter_1.db.query.portfolio.findMany({
                    where: (0, drizzle_orm_1.eq)(schema_1.portfolio.electionId, Number((0, paramStr_1.paramStr)(req.params.id))),
                    with: {
                        election: true,
                        candidate: true,
                    }
                });
                if (resp === null || resp === void 0 ? void 0 : resp.length) {
                    const formatted = resp === null || resp === void 0 ? void 0 : resp.map(p => {
                        var _a;
                        return (Object.assign(Object.assign({}, p), { _count: { candidate: (_a = p === null || p === void 0 ? void 0 : p.candidate) === null || _a === void 0 ? void 0 : _a.length } }));
                    });
                    res.status(200).json(formatted);
                }
                else {
                    res.status(204).json({ message: `no records found` });
                }
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchPortfolioList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield mysqlAdapter_1.db.query.portfolio.findMany({
                    where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.portfolio.status, true), (0, drizzle_orm_1.eq)(schema_1.portfolio.electionId, Number(req.query.electionId)))
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
    fetchPortfolio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield mysqlAdapter_1.db.query.portfolio.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.portfolio.id, Number((0, paramStr_1.paramStr)(req.params.id))),
                    extras: {
                        // Replicates Prisma's _count: { candidate: true }
                        candidateCount: (0, drizzle_orm_1.sql) `(
                  SELECT count(*) FROM ${schema_1.candidate} 
                  WHERE ${schema_1.candidate.portfolioId} = ${schema_1.portfolio.id}
               )`.as('candidate_count'),
                    },
                });
                resp ? res.status(200).json(resp) : res.status(204).json({ message: `no record found` });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postPortfolio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield mysqlAdapter_1.db.insert(schema_1.portfolio).values(req.body);
                const insertId = result.insertId;
                if (insertId) {
                    yield mysqlAdapter_1.db.insert(schema_1.candidate).values({
                        tag: 'Skip',
                        name: 'No / Skip',
                        votes: 0,
                        orderNo: 0,
                        status: true,
                        portfolioId: insertId
                    });
                    res.status(200).json(insertId);
                }
                else {
                    res.status(204).json({ message: `no records found` });
                }
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updatePortfolio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number((0, paramStr_1.paramStr)(req.params.id));
                const [resp] = yield mysqlAdapter_1.db.update(schema_1.portfolio)
                    .set(req.body)
                    .where((0, drizzle_orm_1.eq)(schema_1.portfolio.id, id));
                resp ? res.status(200).json(resp) : res.status(204).json({ message: `No records found` });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deletePortfolio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number((0, paramStr_1.paramStr)(req.params.id));
                yield mysqlAdapter_1.db.delete(schema_1.candidate).where((0, drizzle_orm_1.eq)(schema_1.candidate.portfolioId, id));
                const [resp] = yield mysqlAdapter_1.db.delete(schema_1.portfolio).where((0, drizzle_orm_1.eq)(schema_1.portfolio.id, id));
                resp ? res.status(200).json(resp) : res.status(204).json({ message: `No records found` });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    // Candidates
    fetchCandidates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pid = Number((0, paramStr_1.paramStr)(req.params.id));
                const resp = yield mysqlAdapter_1.db.query.candidate.findMany({
                    where: (0, drizzle_orm_1.eq)(schema_1.candidate.portfolioId, pid),
                    with: { portfolio: true },
                    orderBy: [(0, drizzle_orm_1.asc)(schema_1.candidate.orderNo)]
                });
                resp.length ? res.status(200).json(resp) : res.status(204).json({ message: `no records found` });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    fetchCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield mysqlAdapter_1.db.query.candidate.findFirst({
                    where: (0, drizzle_orm_1.eq)(schema_1.candidate.id, Number((0, paramStr_1.paramStr)(req.params.id))),
                    with: { portfolio: true }
                });
                resp ? res.status(200).json(resp) : res.status(204).json({ message: `no record found` });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = Object.assign({}, req.body);
                if (data.portfolioId)
                    data.portfolioId = Number(data.portfolioId);
                if (data.orderNo)
                    data.orderNo = Number(data.orderNo);
                const [resp] = yield mysqlAdapter_1.db.insert(schema_1.candidate).values(data);
                (resp === null || resp === void 0 ? void 0 : resp.insertId) ? res.status(200).json(resp) : res.status(204).json({ message: `could not create candidate` });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number((0, paramStr_1.paramStr)(req.params.id));
                const [resp] = yield mysqlAdapter_1.db.update(schema_1.candidate)
                    .set(req.body)
                    .where((0, drizzle_orm_1.eq)(schema_1.candidate.id, id));
                resp ? res.status(200).json(resp) : res.status(204).json({ message: `No records found` });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    deleteCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [resp] = yield mysqlAdapter_1.db.delete(schema_1.candidate)
                    .where((0, drizzle_orm_1.eq)(schema_1.candidate.id, Number((0, paramStr_1.paramStr)(req.params.id))));
                resp ? res.status(200).json(resp) : res.status(204).json({ message: `No records found` });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.default = EvsController;
