import { Request, Response } from "express";

const db = require('../config/mysql');

export default class EvsModel {
   
    async fetchColleges() {
        let res;
        const sql = `select * from osis.colleges`;
        res = await db.query(sql);
        return res;
    }

    async fetchFaculties(collegeId: number) {
        let res;
        const sql = `select * from osis.faculty where collegeid = ? and type='ACADEMIC'`;
        res = await db.query(sql,[collegeId]);
        return res;
    }

    async fetchDepartments(facultyId: number) {
        let res;
        const sql = `select * from osis.departments where facultyid = ? and type='ACADEMIC'`;
        res = await db.query(sql,[ facultyId ]);
        return res;
    }
    
    async fetchCandidates(deptId: number) {
        let res;
        const sql = `select staff_no,concat(fname,' ',lname) as name,long_name as department from osisauth.users as t1 join osisauth.user_privileges as t2 on  t1.userid=t2.userid join osis.departments as t3 on t1.deptid=t3.deptid where t2.roleid=4 and t1.status='active' and t1.status not in ('Inactive','Disabled') and t3.deptid = ?`;
        res = await db.query(sql,[ deptId ]);
        return res;
    }

    async fetchCandidate(keyword: string) {
        let res;
        const sql = `select staff_no,concat(fname,' ',lname) as name,long_name as department from osisauth.users as t1 join osisauth.user_privileges as t2 on t1.userid=t2.userid join osis.departments as t3 on t1.deptid=t3.deptid where t2.roleid=4 and t1.status='active' and t1.status not in ('Inactive','Disabled') and (t1.fname like ? or t1.lname like ? or t1.staff_no = ?);`;
        res = await db.query(sql,[`%${keyword}%`,`%${keyword}%`,keyword]);
        return res;
    }

    async fetchVotesByCandidates() {
        let res;
        const sql = `select fname,lname,vote,count(vote) as votes,long_name as department from ehub_vote.las_vote v left join osisauth.users u on u.staff_no = v.vote left join osis.departments d on u.deptid = d.deptid group by vote order by count(vote) desc`;
        res = await db.query(sql);
        return res;
    }

    async fetchVotesByVoters() {
        let res;
        const sql = `select v.regno,concat(u.fname,ifnull(concat(' ',u.mname),''),' ',u.lname) as student,concat(x.fname,' ',x.lname) as lecturer,long_name as program,v.vote from ehub_vote.las_vote v left join osis.students_db u on u.regno = v.regno left join osis.prog_db p on u.progid = p.progid left join osisauth.users x on v.vote = x.staff_no`;
        res = await db.query(sql);
        return res;
    }

    async fetchVote(regno: string) {
        let res;
        const sql = `select v.regno,u.staff_no,concat(u.fname,' ',u.lname) as name,d.long_name as department,1 as voted from ehub_vote.las_vote v join ehub_vote.las_setting s on s.id = v.setting_id join osisauth.users u on u.staff_no = v.vote join osis.departments d on u.deptid = d.deptid where s.default = 1 and regno = ?`;
        res = await db.query(sql,[regno]);
        return res;
    }

    async postVote(data: any) {
        let res;
        const sql = `insert into ehub_vote.las_vote set ?`;
        res = await db.query(sql,data);
        return res;
    }

    async updateVote(regno: string,data: any) {
        let res;
        const sql = `update ehub_vote.las_vote set ? where regno = ?`;
        res = await db.query(sql,[ data, regno ]);
        return res;
    }

    async fetchActiveSetting() {
        let res;
        const sql = "select * from ehub_vote.las_setting where `default` = 1 limit 1";
        res = await db.query(sql);
        return res && res[0];
    }



    /* ELECTA MODELS */

    
}