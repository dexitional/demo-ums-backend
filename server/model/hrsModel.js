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
Object.defineProperty(exports, "__esModule", { value: true });
const db = require('../config/mysql');
class HrsModel {
    // NSS Portal
    fetchNSSAll(keyword, offset, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            // const sql = `select s.*,u.long_name as department from hr.nss s left join hr.unit u on s.unit_id = u.id where year(start_date) = year(curdate())`;
            let sql = "select s.*,u.long_name as department from hr.nss s left join hr.unit u on s.unit_id = u.id";
            let cql = "select count(s.nss_no) as total from hr.nss s left join hr.unit u on s.unit_id = u.id";
            console.log(keyword);
            if (keyword) {
                sql += ` where (s.nss_no like '%${keyword}%' or s.fname like '%${keyword}%' or s.mname like '%${keyword}%' or s.lname like '%${keyword}%' or s.mobile like '%${keyword}%')`;
                cql += ` where (s.nss_no like '%${keyword}%' or s.fname like '%${keyword}%' or s.mname like '%${keyword}%' or s.lname like '%${keyword}%' or s.mobile like '%${keyword}%')`;
            }
            sql += " order by year(start_date) desc";
            sql += ` limit ${offset}, ${pageSize}`;
            console.log(sql);
            const ces = yield db.query(cql);
            const res = yield db.query(sql);
            const count = Math.ceil(ces[0].total / pageSize);
            return {
                totalPages: count,
                totalData: ces[0].total,
                data: res,
            };
        });
    }
    fetchNSS(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            const sql = `select s.*,ifnull(u.long_name,unit_assigned) as department from hr.nss s left join hr.unit u on s.unit_id = u.id where s.id = ?`;
            res = yield db.query(sql, [id]);
            return res && res[0];
        });
    }
    fetchNSSByPin(pin) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            const sql = `select s.*,ifnull(u.long_name,unit_assigned) as department from hr.nss s left join hr.unit u on s.unit_id = u.id where s.nss_no = ?`;
            res = yield db.query(sql, [pin]);
            return res && res[0];
        });
    }
    postNSS(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            const sql = `insert into hr.nss set ?`;
            res = yield db.query(sql, data);
            return res;
        });
    }
    updateNSS(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            const sql = `update hr.nss set ? where id = ?`;
            res = yield db.query(sql, [data, id]);
            return res;
        });
    }
    deleteNSS(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            const sql = `delete from hr.nss where id = ?`;
            res = yield db.query(sql, [id]);
            return res;
        });
    }
    // Notices & Circulars 
    fetchNotices() {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            const sql = `select * from hr.circular order by id desc`;
            res = yield db.query(sql);
            return res;
        });
    }
    fetchNSSNotices() {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            const sql = `select * from hr.circular where cat_staff_group = 'NSS' order by id desc`;
            res = yield db.query(sql);
            return res;
        });
    }
    fetchNotice(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            const sql = `select * from hr.circular where id = ?`;
            res = yield db.query(sql, [id]);
            return res && res[0];
        });
    }
    postNotice(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            const sql = `insert into hr.circular set ?`;
            res = yield db.query(sql, data);
            return res;
        });
    }
    updateNotice(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            const sql = `update hr.circular set ? where id = ?`;
            res = yield db.query(sql, [data, id]);
            return res;
        });
    }
    deleteNotice(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            const sql = `delete from hr.circular where id = ?`;
            res = yield db.query(sql, [id]);
            return res;
        });
    }
    // NSS Services
    fetchServices() {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            const sql = `select * from hr.nss_service order by id desc`;
            res = yield db.query(sql);
            return res;
        });
    }
    fetchNSSServices() {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            const sql = `select * from hr.nss_service order by id desc`;
            res = yield db.query(sql);
            return res;
        });
    }
    fetchService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            const sql = `select * from hr.nss_service where id = ?`;
            res = yield db.query(sql, [id]);
            return res && res[0];
        });
    }
    postService(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            const sql = `insert into hr.nss_service set ?`;
            res = yield db.query(sql, data);
            return res;
        });
    }
    updateService(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            const sql = `update hr.nss_service set ? where id = ?`;
            res = yield db.query(sql, [data, id]);
            return res;
        });
    }
    deleteService(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            const sql = `delete from hr.nss_service where id = ?`;
            res = yield db.query(sql, [id]);
            return res;
        });
    }
    // HR Units
    fetchUnits() {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            const sql = `select * from hr.unit order by long_name`;
            res = yield db.query(sql);
            return res;
        });
    }
}
exports.default = HrsModel;
