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
const paramStr_1 = require("../util/paramStr");
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const path_1 = __importDefault(require("path"));
const evs = client_1.prisma;
class EvsController {
    // Elections
    fetchAdminElections(req, res) {
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
                                //{ id: { contains: keyword } },
                            ],
                        },
                    };
                const resp = yield evs.$transaction([
                    evs.election.count(Object.assign({}, (searchCondition))),
                    evs.election.findMany(Object.assign(Object.assign({}, (searchCondition)), { include: {
                            group: true,
                        }, skip: offset, take: Number(pageSize) }))
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
    fetchElections(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield evs.election.findMany({ where: { status: true }, orderBy: { createdAt: 'desc' } });
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
    fetchMyElections(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tag = (0, paramStr_1.paramStr)(req.params.tag);
                //const tag = '24010001';
                const en = yield evs.election.findMany({
                    where: {
                        status: true,
                        OR: [
                            { voterData: { path: '$[*].tag', array_contains: tag } },
                            { admins: { path: '$[*]', array_contains: tag } },
                        ]
                    },
                });
                if (en === null || en === void 0 ? void 0 : en.length) {
                    const resp = yield Promise.all(en === null || en === void 0 ? void 0 : en.map((r) => __awaiter(this, void 0, void 0, function* () {
                        const ts = yield evs.elector.findMany({ where: { electionId: r.id } });
                        const rs = yield evs.elector.findFirst({ where: { electionId: r.id, tag } });
                        return Object.assign(Object.assign({}, r), { turnout: ts.length, voters: ts, voteStatus: !!rs });
                    })));
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
    fetchElection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const resp = yield evs.election.findUnique({
                    where: { id: Number((0, paramStr_1.paramStr)(req.params.id)) },
                    include: { group: true },
                });
                if (resp) {
                    const ts = yield evs.elector.count({ where: { electionId: Number((0, paramStr_1.paramStr)(req.params.id)) } });
                    const tm = (resp === null || resp === void 0 ? void 0 : resp.voterData) && (yield Promise.all((_a = resp === null || resp === void 0 ? void 0 : resp.voterData) === null || _a === void 0 ? void 0 : _a.map((r) => __awaiter(this, void 0, void 0, function* () {
                        const ts = yield evs.elector.findFirst({ where: { electionId: Number((0, paramStr_1.paramStr)(req.params.id)), tag: r === null || r === void 0 ? void 0 : r.tag } });
                        return Object.assign(Object.assign({}, r), { voteStatus: !!ts });
                    }))));
                    res.status(200).json(Object.assign(Object.assign({}, resp), { voterData: tm, turnout: ts }));
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
    postElection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const data = req.body;
                data === null || data === void 0 ? true : delete data.logo;
                if (data === null || data === void 0 ? void 0 : data.startAt)
                    data.startAt = new Date(data.startAt);
                if (data === null || data === void 0 ? void 0 : data.endAt)
                    data.endAt = new Date(data === null || data === void 0 ? void 0 : data.endAt);
                if (data === null || data === void 0 ? void 0 : data.groupId)
                    data.groupId = Number(data === null || data === void 0 ? void 0 : data.groupId);
                if (data === null || data === void 0 ? void 0 : data.voterList)
                    data.voterList = JSON.parse(data === null || data === void 0 ? void 0 : data.voterList);
                if (data === null || data === void 0 ? void 0 : data.status)
                    data.status = !!(data === null || data === void 0 ? void 0 : data.status);
                if (data === null || data === void 0 ? void 0 : data.allowMonitor)
                    data.allowMonitor = !!(data === null || data === void 0 ? void 0 : data.allowMonitor);
                if (data === null || data === void 0 ? void 0 : data.allowVip)
                    data.allowVip = !!(data === null || data === void 0 ? void 0 : data.allowVip);
                if (data === null || data === void 0 ? void 0 : data.allowResult)
                    data.allowResult = !!(data === null || data === void 0 ? void 0 : data.allowResult);
                if (data === null || data === void 0 ? void 0 : data.allowMask)
                    data.allowMask = !!(data === null || data === void 0 ? void 0 : data.allowMask);
                if (data === null || data === void 0 ? void 0 : data.allowEcMonitor)
                    data.allowEcMonitor = !!(data === null || data === void 0 ? void 0 : data.allowEcMonitor);
                if (data === null || data === void 0 ? void 0 : data.allowEcVip)
                    data.allowEcVip = !!(data === null || data === void 0 ? void 0 : data.allowEcVip);
                if (data === null || data === void 0 ? void 0 : data.allowEcResult)
                    data.allowEcResult = !!(data === null || data === void 0 ? void 0 : data.allowEcResult);
                if (data === null || data === void 0 ? void 0 : data.autoStop)
                    data.autoStop = !!(data === null || data === void 0 ? void 0 : data.autoStop);
                const logo = (_a = req === null || req === void 0 ? void 0 : req.files) === null || _a === void 0 ? void 0 : _a.logo;
                const resp = yield evs.election.create({ data: data });
                if (resp) {
                    // Create Upload Folder
                    fs_1.default.mkdirSync(path_1.default.join(__dirname, "/../../public/cdn/evs") + `/${resp.id}`);
                    // Upload Logo
                    const eid = resp === null || resp === void 0 ? void 0 : resp.id;
                    const dest = path_1.default.join(__dirname, "/../../public/cdn/photo/evs/", ((_c = (_b = eid === null || eid === void 0 ? void 0 : eid.toString()) === null || _b === void 0 ? void 0 : _b.trim()) === null || _c === void 0 ? void 0 : _c.toLowerCase()) + ".png");
                    if (logo)
                        logo.mv(dest, function (err) {
                            if (err)
                                console.log(err);
                        });
                    // Return Response Data
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
    updateElection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                let data = req.body;
                data === null || data === void 0 ? true : delete data.logo;
                if (data === null || data === void 0 ? void 0 : data.startAt)
                    data.startAt = new Date(data.startAt);
                if (data === null || data === void 0 ? void 0 : data.endAt)
                    data.endAt = new Date(data === null || data === void 0 ? void 0 : data.endAt);
                if (data === null || data === void 0 ? void 0 : data.groupId)
                    data.groupId = Number(data === null || data === void 0 ? void 0 : data.groupId);
                if (data === null || data === void 0 ? void 0 : data.voterList)
                    data.voterList = JSON.parse(data === null || data === void 0 ? void 0 : data.voterList);
                if (data === null || data === void 0 ? void 0 : data.status)
                    data.status = Boolean(Number(data === null || data === void 0 ? void 0 : data.status));
                if (data === null || data === void 0 ? void 0 : data.allowMonitor)
                    data.allowMonitor = Boolean(Number(data === null || data === void 0 ? void 0 : data.allowMonitor));
                if (data === null || data === void 0 ? void 0 : data.allowVip)
                    data.allowVip = Boolean(Number(data === null || data === void 0 ? void 0 : data.allowVip));
                if (data === null || data === void 0 ? void 0 : data.allowResult)
                    data.allowResult = Boolean(Number(data === null || data === void 0 ? void 0 : data.allowResult));
                if ((data === null || data === void 0 ? void 0 : data.allowMask) !== undefined)
                    data.allowMask = Boolean(Number(data === null || data === void 0 ? void 0 : data.allowMask));
                if (data === null || data === void 0 ? void 0 : data.allowEcMonitor)
                    data.allowEcMonitor = Boolean(Number(data === null || data === void 0 ? void 0 : data.allowEcMonitor));
                if (data === null || data === void 0 ? void 0 : data.allowEcVip)
                    data.allowEcVip = Boolean(Number(data === null || data === void 0 ? void 0 : data.allowEcVip));
                if (data === null || data === void 0 ? void 0 : data.allowEcResult)
                    data.allowEcResult = Boolean(Number(data === null || data === void 0 ? void 0 : data.allowEcResult));
                if (data === null || data === void 0 ? void 0 : data.autoStop)
                    data.autoStop = Boolean(Number(data === null || data === void 0 ? void 0 : data.autoStop));
                const logo = (_a = req === null || req === void 0 ? void 0 : req.files) === null || _a === void 0 ? void 0 : _a.logo;
                const resp = yield evs.election.update({
                    where: { id: Number((0, paramStr_1.paramStr)(req.params.id)) },
                    data: data
                });
                if (resp) {
                    // Upload Logo
                    const eid = resp === null || resp === void 0 ? void 0 : resp.id;
                    const dest = path_1.default.join(__dirname, "/../../public/cdn/photo/evs/", ((_c = (_b = eid === null || eid === void 0 ? void 0 : eid.toString()) === null || _b === void 0 ? void 0 : _b.trim()) === null || _c === void 0 ? void 0 : _c.toLowerCase()) + ".png");
                    if (logo)
                        logo.mv(dest, function (err) {
                            if (err)
                                console.log(err);
                        });
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
    deleteElection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield evs.election.delete({
                    where: { id: Number((0, paramStr_1.paramStr)(req.params.id)) }
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
    // Action
    actionReset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { electionId } = req.body;
                // Reset Candidates votes
                yield evs.candidate.updateMany({
                    where: { portfolio: { electionId: Number(electionId) } },
                    data: { votes: 0 }
                });
                // Delete Voted Users
                const resp = yield evs.elector.deleteMany({
                    where: { electionId: Number(electionId) }
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
    actionAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tag, electionId } = req.body;
                const election = yield evs.election.findUnique({ where: { id: Number(electionId) } });
                if (election) {
                    const { admins } = election;
                    const vt = admins.find((r) => (r === null || r === void 0 ? void 0 : r.toLowerCase()) == (tag === null || tag === void 0 ? void 0 : tag.toLowerCase()));
                    let newAdmins;
                    if (vt) {
                        newAdmins = admins.filter((r) => (r === null || r === void 0 ? void 0 : r.toLowerCase()) != (tag === null || tag === void 0 ? void 0 : tag.toLowerCase()));
                    }
                    else {
                        newAdmins = [...admins, tag];
                    }
                    const resp = yield evs.election.update({
                        where: { id: Number(electionId) },
                        data: {
                            admins: newAdmins
                        }
                    });
                    if (resp) {
                        return res.status(200).json(resp);
                    }
                    else {
                        return res.status(202).json({ message: `No record found!` });
                    }
                }
                else
                    return res.status(202).json({ message: `Election not staged!` });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    actionVoters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield evs.election.create({ data: req.body });
                if (resp) {
                    // Create Upload Folder
                    fs_1.default.mkdirSync(path_1.default.join(__dirname, "/../../public/cdn/evs") + `/${resp.id}`);
                    // Return Response Data
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
    // Voters & Votes
    postVotes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield evs.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    let { id, tag, votes } = req.body;
                    const ip = req.ip;
                    if (!tag)
                        throw new Error(`Request user not found`);
                    if (!id)
                        throw new Error(`Request ID not found`);
                    const en = yield tx.election.findFirst({
                        where: { id: Number(id), status: true, voterData: { path: '$[*].tag', array_contains: tag } },
                    });
                    if (en) {
                        // Check Vote Status
                        const ev = yield tx.elector.findFirst({ where: { electionId: Number(id), tag } });
                        if (ev)
                            throw new Error(`Elector already voted`);
                        // Check IF Election is still Opened for Grace Period
                        if ((en === null || en === void 0 ? void 0 : en.status) && ((en === null || en === void 0 ? void 0 : en.action) == 'STARTED' || ((en === null || en === void 0 ? void 0 : en.action) == 'ENDED' && (0, moment_1.default)().diff((0, moment_1.default)(en === null || en === void 0 ? void 0 : en.endAt), 'seconds') <= 120))) {
                            // Record Vote ( If not voted )
                            //const sels = votes.split(",");
                            if (votes.length) {
                                const resp = yield Promise.all(votes === null || votes === void 0 ? void 0 : votes.map((cid) => __awaiter(this, void 0, void 0, function* () {
                                    return yield tx.candidate.updateMany({
                                        where: { id: Number(cid) },
                                        data: { votes: { increment: 1 } }
                                    });
                                })));
                                // Check Number of Recorded Votes
                                if ((resp === null || resp === void 0 ? void 0 : resp.length) != votes.length)
                                    throw new Error(`Vote Submission Disallowed`);
                                // Record Voter
                                const vs = (_a = en === null || en === void 0 ? void 0 : en.voterData) === null || _a === void 0 ? void 0 : _a.find((r) => r.tag == tag);
                                yield tx.elector.create({
                                    data: {
                                        voteStatus: true,
                                        voteSum: Object.values(votes).join(","),
                                        voteTime: new Date(),
                                        voteIp: ip,
                                        name: vs === null || vs === void 0 ? void 0 : vs.name,
                                        tag,
                                        election: { connect: { id: Number(id) } }
                                    }
                                });
                                // Load New Data Set Broadcast
                                let portfolios = yield evs.portfolio.findMany({ where: { electionId: Number(id) } });
                                const election = yield evs.election.findUnique({ where: { id: Number(id) } });
                                const electors = yield evs.elector.findMany({ where: { electionId: Number(id) } });
                                if (election && portfolios) {
                                    portfolios = yield Promise.all(portfolios === null || portfolios === void 0 ? void 0 : portfolios.map((r) => __awaiter(this, void 0, void 0, function* () {
                                        const candidates = yield evs.candidate.findMany({ where: { status: true, portfolioId: r.id }, include: { portfolio: { select: { electionId: true } } }, orderBy: [{ votes: 'desc' }, { orderNo: 'asc' }] });
                                        return Object.assign(Object.assign({}, r), { candidates });
                                    })));
                                    if (req.app && req.app.locals && typeof req.app.locals.broadcastElection === "function") {
                                        req.app.locals.broadcastElection(Number(id), { election, portfolios, electors });
                                    }
                                }
                                // Return Success Status
                                res.status(200).json(resp);
                            }
                            else
                                throw new Error(`Votes invalid!`);
                        }
                        else
                            throw new Error(`Election is closed!`);
                    }
                    else
                        throw new Error(`Elector not qualified!`);
                }), {
                    maxWait: 5000, // 5 seconds
                    timeout: 10000, // 10 seconds
                });
            }
            catch (error) {
                return res.status(203).json({ message: error.message });
            }
        });
    }
    fetchVotes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = (0, paramStr_1.paramStr)(req.params.id);
                let portfolios = yield evs.portfolio.findMany({ where: { electionId: Number(id) } });
                const election = yield evs.election.findUnique({ where: { id: Number(id) } });
                const electors = yield evs.elector.findMany({ where: { electionId: Number(id) } });
                if (election && portfolios) {
                    portfolios = yield Promise.all(portfolios === null || portfolios === void 0 ? void 0 : portfolios.map((r) => __awaiter(this, void 0, void 0, function* () {
                        const candidates = yield evs.candidate.findMany({ where: { status: true, portfolioId: r.id }, include: { portfolio: { select: { electionId: true } } }, orderBy: [{ votes: 'desc' }, { orderNo: 'asc' }] });
                        return Object.assign(Object.assign({}, r), { candidates });
                    })));
                    res.status(200).json({ election, portfolios, electors });
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
    fetchVoters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield evs.election.findUnique({
                    where: { id: Number((0, paramStr_1.paramStr)(req.params.id)) },
                    select: { voterData: true }
                });
                if (resp) {
                    // Check Mask on vote Status
                    res.status(200).json(resp === null || resp === void 0 ? void 0 : resp.voterData);
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
    fetchVoter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tag = (0, paramStr_1.paramStr)(req.params.tag);
                const resp = yield evs.election.findUnique({
                    where: { id: Number((0, paramStr_1.paramStr)(req.params.id)) },
                });
                if (resp) {
                    const voterData = resp === null || resp === void 0 ? void 0 : resp.voterData;
                    const voter = voterData === null || voterData === void 0 ? void 0 : voterData.find((r) => r.tag == tag);
                    // Check Vote Status
                    const vs = yield evs.elector.findFirst({ where: { electionId: Number((0, paramStr_1.paramStr)(req.params.id)), tag } });
                    // Return Response
                    res.status(200).json(Object.assign(Object.assign({}, resp), { voter, voteStatus: !!vs }));
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
    setupVoters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const en = yield evs.election.findUnique({ select: { voterList: true, groupId: true }, where: { id: Number(req.body.electionId) } });
                if (en) {
                    const list = en === null || en === void 0 ? void 0 : en.voterList;
                    if (list === null || list === void 0 ? void 0 : list.length) {
                        const voters = yield Promise.all(list === null || list === void 0 ? void 0 : list.map((r) => __awaiter(this, void 0, void 0, function* () {
                            const ts = en.groupId == 1
                                ? yield evs.student.findFirst({ select: { fname: true, mname: true, lname: true, id: true, phone: true }, where: { id: r } })
                                : yield evs.staff.findFirst({ select: { fname: true, mname: true, lname: true, staffNo: true, phone: true }, where: { staffNo: r } });
                            const us = yield evs.user.findFirst({ where: { tag: r } });
                            return ({ tag: (ts === null || ts === void 0 ? void 0 : ts.id) || (ts === null || ts === void 0 ? void 0 : ts.staffNo), name: `${ts === null || ts === void 0 ? void 0 : ts.fname} ${(ts === null || ts === void 0 ? void 0 : ts.mname) && (ts === null || ts === void 0 ? void 0 : ts.mname) + ' '}${ts === null || ts === void 0 ? void 0 : ts.lname}`, username: us === null || us === void 0 ? void 0 : us.username, pin: us === null || us === void 0 ? void 0 : us.unlockPin, phone: ts === null || ts === void 0 ? void 0 : ts.phone });
                        })));
                        const resp = yield evs.election.update({
                            where: { id: Number(req.body.electionId) },
                            data: { voterData: voters }
                        });
                        // Return Response
                        return res.status(200).json(resp);
                    }
                }
                return res.status(202).json({ message: `Voter register not populated` });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    postVoter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tag, name } = req.body;
                const resp = yield evs.election.update({
                    where: { id: Number((0, paramStr_1.paramStr)(req.params.id)) },
                    data: {
                        voterData: {
                            // jsonb_build_object: { tag, name } 
                            jsonb_set: {
                                path: '$',
                                value: { tag, name },
                                append: true
                            }
                        }
                    }
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
    deleteVoter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tag = (0, paramStr_1.paramStr)(req.params.tag);
                const resp = yield evs.election.update({
                    where: {
                        id: Number((0, paramStr_1.paramStr)(req.params.id)),
                        voterData: { path: '$.tag', array_contains: tag }
                    },
                    data: {
                        voterData: { jsonb_remove: { path: '$[*]' } }
                    }
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
    // Receipt or Transcript
    fetchReceipt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tag = (0, paramStr_1.paramStr)(req.params.tag);
                const id = (0, paramStr_1.paramStr)(req.params.id);
                const resp = yield evs.elector.findFirst({
                    where: { tag, electionId: Number(id) },
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
    // Portfolios
    fetchPortfolios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield evs.portfolio.findMany({
                    where: { electionId: Number((0, paramStr_1.paramStr)(req.params.id)) },
                    include: {
                        _count: { select: { candidate: true } },
                        election: true
                    }
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
    fetchPortfolioList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield evs.portfolio.findMany({
                    where: { status: true, electionId: Number(req.query.electionId) }
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
                const resp = yield evs.portfolio.findUnique({
                    where: { id: Number((0, paramStr_1.paramStr)(req.params.id)) },
                    include: { _count: { select: { candidate: true } } }
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
    postPortfolio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield evs.portfolio.create({ data: req.body });
                if (resp) {
                    // Auto-Create Skip/No Candidate
                    yield evs.candidate.create({ data: {
                            tag: 'Skip',
                            name: 'No / Skip',
                            votes: 0,
                            orderNo: 0,
                            status: true,
                            portfolioId: resp === null || resp === void 0 ? void 0 : resp.id
                        } });
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
    updatePortfolio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield evs.portfolio.update({
                    where: { id: Number((0, paramStr_1.paramStr)(req.params.id)) },
                    data: req.body
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
    deletePortfolio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`delete ID: ${(0, paramStr_1.paramStr)(req.params.id)}`);
                // Delete Candidates
                // await evs.portfolio.$executeRaw`DELETE FROM evs_candidate where portfolioId = ${(Number(paramStr(req.params.id))}`
                // Delete Portfolio
                const resp = yield evs.portfolio.delete({
                    where: { id: Number((0, paramStr_1.paramStr)(req.params.id)) }
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
    // Candidates
    fetchCandidates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield evs.candidate.findMany({ where: { portfolioId: Number((0, paramStr_1.paramStr)(req.params.id)) } });
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
    fetchCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield evs.candidate.findUnique({
                    where: { id: Number((0, paramStr_1.paramStr)(req.params.id)) },
                    include: { portfolio: { select: { electionId: true } } }
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
    postCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            try {
                const { portfolioId } = req.body;
                const lastCandidate = yield evs.candidate.findFirst({ where: { portfolioId: Number(portfolioId) }, orderBy: { 'orderNo': 'desc' } });
                let data = req.body;
                delete data.photo;
                delete data.portfolioId;
                data.orderNo = data.orderNo > 0 ? Number(data.orderNo) : ((lastCandidate === null || lastCandidate === void 0 ? void 0 : lastCandidate.orderNo) + 1);
                data.tag = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.name) === null || _a === void 0 ? void 0 : _a.split(" ")[0]) === null || _b === void 0 ? void 0 : _b.trim()) === null || _c === void 0 ? void 0 : _c.toLowerCase();
                data.status = !!data.status;
                const photo = (_d = req === null || req === void 0 ? void 0 : req.files) === null || _d === void 0 ? void 0 : _d.photo;
                const resp = yield evs.candidate.create({
                    data: Object.assign(Object.assign({}, data), portfolioId && ({ portfolio: { connect: { id: Number(portfolioId) } } })),
                    include: { portfolio: true }
                });
                if (resp) {
                    // Upload Photo
                    const tag = resp === null || resp === void 0 ? void 0 : resp.id;
                    const eid = (_e = resp === null || resp === void 0 ? void 0 : resp.portfolio) === null || _e === void 0 ? void 0 : _e.electionId;
                    const dest = path_1.default.join(__dirname, "/../../public/cdn/photo/evs/" + eid, ((_g = (_f = tag === null || tag === void 0 ? void 0 : tag.toString()) === null || _f === void 0 ? void 0 : _f.trim()) === null || _g === void 0 ? void 0 : _g.toLowerCase()) + ".jpg");
                    if (photo)
                        photo.mv(dest, function (err) {
                            if (err)
                                console.log(err);
                        });
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
    updateCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            try {
                const { portfolioId } = req.body;
                const lastCandidate = yield evs.candidate.findFirst({ where: { portfolioId: Number(portfolioId) }, orderBy: { 'orderNo': 'desc' } });
                let data = req.body;
                delete data.photo;
                delete data.portfolioId;
                data.orderNo = (data === null || data === void 0 ? void 0 : data.orderNo) > 0 ? Number(data.orderNo) : ((lastCandidate === null || lastCandidate === void 0 ? void 0 : lastCandidate.orderNo) + 1);
                data.tag = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.name) === null || _a === void 0 ? void 0 : _a.split(" ")[0]) === null || _b === void 0 ? void 0 : _b.trim()) === null || _c === void 0 ? void 0 : _c.toLowerCase();
                data.status = !!data.status;
                const photo = (_d = req === null || req === void 0 ? void 0 : req.files) === null || _d === void 0 ? void 0 : _d.photo;
                const resp = yield evs.candidate.update({
                    where: { id: Number((0, paramStr_1.paramStr)(req.params.id)) },
                    data: Object.assign(Object.assign({}, data), portfolioId && ({ portfolio: { connect: { id: Number(portfolioId) } } })),
                    include: { portfolio: true }
                });
                if (resp) {
                    // Upload Photo
                    const tag = resp === null || resp === void 0 ? void 0 : resp.id;
                    const eid = (_e = resp === null || resp === void 0 ? void 0 : resp.portfolio) === null || _e === void 0 ? void 0 : _e.electionId;
                    const dest = path_1.default.join(__dirname, "/../../public/cdn/photo/evs/" + eid, ((_g = (_f = tag === null || tag === void 0 ? void 0 : tag.toString()) === null || _f === void 0 ? void 0 : _f.trim()) === null || _g === void 0 ? void 0 : _g.toLowerCase()) + ".jpg");
                    if (photo)
                        photo.mv(dest, function (err) {
                            if (err)
                                console.log(err);
                        });
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
    deleteCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield evs.candidate.delete({
                    where: { id: Number((0, paramStr_1.paramStr)(req.params.id)) }
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
    postEvsData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield evs.session.findMany({ where: { status: true }, orderBy: { title: 'asc' } });
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
    fetchEvsMonitor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield evs.session.findMany({ where: { status: true }, orderBy: { title: 'asc' } });
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
    fetchEvsData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield evs.session.findMany({ where: { status: true }, orderBy: { title: 'asc' } });
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
}
exports.default = EvsController;
