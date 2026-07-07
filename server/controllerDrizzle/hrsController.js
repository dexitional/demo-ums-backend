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
const hrsModel_1 = __importDefault(require("../model/hrsModel"));
const authModel_1 = __importDefault(require("../model/authModel"));
const moment_1 = __importDefault(require("moment"));
const paramStr_1 = require("../util/paramStr");
const hrs = new hrsModel_1.default();
const Auth = new authModel_1.default();
const sha1 = require('sha1');
class HrsController {
    /* NSS Module */
    // NSS
    fetchNSSAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, pageSize = 6, keyword = '' } = req.query;
            const offset = (page - 1) * pageSize;
            try {
                const resp = yield hrs.fetchNSSAll(keyword, offset, pageSize);
                if (resp) {
                    console.log(resp, page, offset, pageSize);
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
    fetchNSS(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield yield hrs.fetchNSS((0, paramStr_1.paramStr)(req.params.id));
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
    fetchNSSByPin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield hrs.fetchNSSByPin((0, paramStr_1.paramStr)(req.params.pin));
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
    postNSS(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                delete req.body.photo;
                delete req.body.password;
                delete req.body.repassword;
                delete req.body.nss_form;
                const resp = yield yield hrs.postNSS(req.body);
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
    postNSSRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const password = sha1(req.body.password);
                const nss = yield hrs.fetchNSSByPin(req.body.nss_no);
                console.log(nss);
                delete req.body.photo;
                delete req.body.password;
                delete req.body.repassword;
                delete req.body.nss_form;
                delete req.body.id;
                // req.body.start_date = moment().format('YYYY-11-01');
                // req.body.end_date = moment(moment().format('YYYY-11-01')).add(1,'year');
                // req.body.start_date = '2023-11-01';
                // req.body.end_date = '2024-10-31';
                req.body.start_date = (0, moment_1.default)('2023-11-01', 'YYYY-MM-DD').format('YYYY-MM-DD');
                req.body.end_date = (0, moment_1.default)('2024-10-31', 'YYYY-MM-DD').format('YYYY-MM-DD');
                if (!nss) {
                    const sso_data = { group_id: 3, tag: (_a = req.body.nss_no) === null || _a === void 0 ? void 0 : _a.toLowerCase(), username: (_b = req.body.nss_no) === null || _b === void 0 ? void 0 : _b.toLowerCase(), password };
                    const resp = yield hrs.postNSS(req.body);
                    if (resp) {
                        yield Auth.insertSSOUser(sso_data);
                        res.status(200).json(resp);
                    }
                    else {
                        res.status(204).json({ message: `No records found` });
                    }
                }
                else {
                    res.status(200).json(nss);
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    updateNSS(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                delete req.body.photo;
                delete req.body.password;
                delete req.body.repassword;
                delete req.body.nss_form;
                console.log((0, paramStr_1.paramStr)(req.params.id), req.body);
                const resp = yield hrs.updateNSS((0, paramStr_1.paramStr)(req.params.id), req.body);
                console.log(resp);
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
    deleteNSS(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield hrs.deleteNSS((0, paramStr_1.paramStr)(req.params.id));
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
    // NOTICES & CIRCULARS
    fetchNotices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield hrs.fetchNotices();
                if (resp.length > 0) {
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
    fetchNSSNotices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield hrs.fetchNSSNotices();
                if (resp.length > 0) {
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
    fetchNotice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield yield hrs.fetchNotice((0, paramStr_1.paramStr)(req.params.id));
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
    postNotice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.start_date = new Date();
                req.body.end_date = `${new Date().getFullYear() + 1}-10-01`;
                const resp = yield yield hrs.postNotice(req.body);
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
    updateNotice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield hrs.updateNotice((0, paramStr_1.paramStr)(req.params.id), req.body);
                console.log(resp);
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
    deleteNotice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield hrs.deleteNotice((0, paramStr_1.paramStr)(req.params.id));
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
    // NSS SERVICE REQUEST
    fetchServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield hrs.fetchServices();
                if (resp.length > 0) {
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
    fetchService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield yield hrs.fetchService((0, paramStr_1.paramStr)(req.params.id));
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
    postService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield yield hrs.postService(req.body);
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
                const resp = yield hrs.updateNotice((0, paramStr_1.paramStr)(req.params.id), req.body);
                console.log(resp);
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
    deleteService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield hrs.deleteService((0, paramStr_1.paramStr)(req.params.id));
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
    // NSS PASSWORD CHANGE
    postNSSPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oldp = req.body.oldpassword;
                const newp = req.body.newpassword;
                const rnewp = req.body.rnewpassword;
                const nss_no = req.body.nss_no;
                if (newp != rnewp)
                    res.status(204).json({ message: `new password mismatch` });
                const user = Auth.withCredential(nss_no, oldp);
                if (!user)
                    res.status(204).json({ message: `old password doesnt exist` });
                const resp = yield yield Auth.updateSSOPassword(nss_no, { password: sha1(rnewp) });
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
    // HR UNITS
    fetchUnits(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resp = yield hrs.fetchUnits();
                if (resp.length > 0) {
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
exports.default = HrsController;
