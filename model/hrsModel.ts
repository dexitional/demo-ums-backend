import { Request, Response } from "express";

const db = require('../config/mysql');

export default class HrsModel {
   
    // NSS Portal
    async fetchNSSAll(keyword: string, offset: number, pageSize: number) {
        // const sql = `select s.*,u.long_name as department from hr.nss s left join hr.unit u on s.unit_id = u.id where year(start_date) = year(curdate())`;
        let sql = "select s.*,u.long_name as department from hr.nss s left join hr.unit u on s.unit_id = u.id"; 
        let cql = "select count(s.nss_no) as total from hr.nss s left join hr.unit u on s.unit_id = u.id"; 
         console.log(keyword)
        if (keyword) {
           sql += ` where (s.nss_no like '%${keyword}%' or s.fname like '%${keyword}%' or s.mname like '%${keyword}%' or s.lname like '%${keyword}%' or s.mobile like '%${keyword}%')`;
           cql += ` where (s.nss_no like '%${keyword}%' or s.fname like '%${keyword}%' or s.mname like '%${keyword}%' or s.lname like '%${keyword}%' or s.mobile like '%${keyword}%')`;
        }

        sql += " order by year(start_date) desc";
        sql += ` limit ${offset}, ${pageSize}`;
        console.log(sql)
        const ces = await db.query(cql);
        const res = await db.query(sql);
        const count = Math.ceil(ces[0].total / pageSize);
        
        return {
           totalPages: count,
           totalData: ces[0].total,
           data: res,
        };
    }

    async fetchNSS(id: string) {
        let res;
        const sql = `select s.*,ifnull(u.long_name,unit_assigned) as department from hr.nss s left join hr.unit u on s.unit_id = u.id where s.id = ?`;
        res = await db.query(sql,[id]);
        return res && res[0];
    }

    async fetchNSSByPin(pin: string) {
        let res;
        const sql = `select s.*,ifnull(u.long_name,unit_assigned) as department from hr.nss s left join hr.unit u on s.unit_id = u.id where s.nss_no = ?`;
        res = await db.query(sql,[pin]);
        return res && res[0];
    }

    async postNSS(data: any) {
        let res;
        const sql = `insert into hr.nss set ?`;
        res = await db.query(sql,data);
        return res;
    }

    async updateNSS(id: string,data: any) {
        let res;
        const sql = `update hr.nss set ? where id = ?`;
        res = await db.query(sql,[ data, id ]);
        return res;
    }

    async deleteNSS(id: string) {
        let res;
        const sql = `delete from hr.nss where id = ?`;
        res = await db.query(sql,[id]);
        return res;
    }


    // Notices & Circulars 
    async fetchNotices() {
        let res;
        const sql = `select * from hr.circular order by id desc`;
        res = await db.query(sql);
        return res;
    }

    async fetchNSSNotices() {
        let res;
        const sql = `select * from hr.circular where cat_staff_group = 'NSS' order by id desc`;
        res = await db.query(sql);
        return res;
    }

    async fetchNotice(id: string) {
        let res;
        const sql = `select * from hr.circular where id = ?`;
        res = await db.query(sql,[id]);
        return res && res[0];
    }

    async postNotice(data: any) {
        let res;
        const sql = `insert into hr.circular set ?`;
        res = await db.query(sql,data);
        return res;
    }

    async updateNotice(id: string,data: any) {
        let res;
        const sql = `update hr.circular set ? where id = ?`;
        res = await db.query(sql,[ data, id ]);
        return res;
    }

    async deleteNotice(id: string) {
        let res;
        const sql = `delete from hr.circular where id = ?`;
        res = await db.query(sql,[id]);
        return res;
    }

    // NSS Services
    async fetchServices() {
        let res;
        const sql = `select * from hr.nss_service order by id desc`;
        res = await db.query(sql);
        return res;
    }

    async fetchNSSServices() {
        let res;
        const sql = `select * from hr.nss_service order by id desc`;
        res = await db.query(sql);
        return res;
    }

    async fetchService(id: string) {
        let res;
        const sql = `select * from hr.nss_service where id = ?`;
        res = await db.query(sql,[id]);
        return res && res[0];
    }

    async postService(data: any) {
        let res;
        const sql = `insert into hr.nss_service set ?`;
        res = await db.query(sql,data);
        return res;
    }

    async updateService(id: string,data: any) {
        let res;
        const sql = `update hr.nss_service set ? where id = ?`;
        res = await db.query(sql,[ data, id ]);
        return res;
    }

    async deleteService(id: string) {
        let res;
        const sql = `delete from hr.nss_service where id = ?`;
        res = await db.query(sql,[id]);
        return res;
    }

    // HR Units
    async fetchUnits() {
        let res;
        const sql = `select * from hr.unit order by long_name`;
        res = await db.query(sql);
        return res;
    }



    
}