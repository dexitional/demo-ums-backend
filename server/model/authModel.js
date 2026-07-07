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
class AuthModel {
    withCredential(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            const sql = `
          select u.* from ehub_identity.user u where u.username = ? and password = sha1(?);
          select 0 as uid,'STUDENT' as group_name,1 as group_id,s.regno as tag,concat(s.fname,ifnull(concat(' ',s.mname),''),' ',s.lname) as name,s.fname,s.mname,s.lname, s.level,(s.level/100) as year,s.hallid as hall,s.inst_email as mail,p.short_name as descriptor,d.short_name as unitname from osisextra.useraccount u left join osis.students_db s on u.regno = s.regno left join osis.prog_db p on s.progid = p.progid left join osis.departments d on p.deptid = d.deptid  where u.regno = ? and u.password = md5(?);
        `;
            const [user, student] = yield db.query(sql, [username, password, username, password]);
            if (user.length)
                res = user[0];
            if (student.length)
                res = student[0];
            return res;
        });
    }
    withKey() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    fetchRoles(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = "select u.arole_id,a.role_name,a.role_desc,x.app_name,x.app_tag from ehub_identity.user_role u left join ehub_identity.app_role a on u.arole_id = a.arole_id left join ehub_identity.app x on a.app_id = x.app_id where u.uid = ?";
            const res = yield db.query(sql, [uid]);
            return res;
        });
    }
    fetchEvsRoles(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            let roles = [];
            // Electoral Roles
            const sql = "select e.*,v.vote_time,v.vote_status,v.vote_sum,JSON_SEARCH(e.voters_whitelist, 'all', ?) as voter,find_in_set(?,e.ec_admins) as ec,find_in_set(?,e.ec_agents) as agent from ehub_vote.election e left join ehub_vote.elector v on (e.id = v.election_id and v.tag = ?) where ((json_search(e.voters_whitelist, 'one', ?) is not null or find_in_set(?,ec_admins) > 0 or find_in_set(?,ec_agents) > 0)) and e.live_status = 1";
            const res = yield db.query(sql, [tag, tag, tag, tag, tag, tag, tag]);
            if (res && res.length > 0) {
                for (var r of res) {
                    if (r.ec)
                        roles.push({
                            role_id: 9,
                            role_name: "ELECTORAL ADMIN",
                            role_desc: "Electa Administrator",
                            app_name: "Electa Voting System",
                            app_desc: "Electa Voting System for the University",
                            app_tag: "evs",
                            eid: r.id
                            //...r,
                            //data: res,
                        });
                    else if (r.agent)
                        roles.push({
                            role_id: 10,
                            role_name: "ELECTORAL AGENT",
                            role_desc: "Electa Agent",
                            app_name: "Electa Voting System",
                            app_desc: "Electa Voting System for the University",
                            app_tag: "evs",
                            eid: r.id
                            //...r,
                            //data: res,
                        });
                    else if (r.voter)
                        roles.push({
                            role_id: 11,
                            role_name: "ELECTORAL VOTER",
                            role_desc: "Electa Voter",
                            app_name: "Electa Voting System",
                            app_desc: "Electa Voting System for the University",
                            app_tag: "evs",
                            eid: r.id
                            //...r,
                            //data: res,
                        });
                }
            }
            else {
                roles.push({
                    role_id: 11,
                    role_name: "ELECTORAL VOTER",
                    role_desc: "Electa Voter",
                    app_name: "Electa Voting System",
                    app_desc: "Electa Voting System for the University",
                    app_tag: "evs",
                    eid: 0
                    //...r,
                    //data: [],
                });
            }
            return roles;
        });
    }
    fetchUser(uid, gid) {
        return __awaiter(this, void 0, void 0, function* () {
            let sql;
            switch (parseInt(gid)) {
                case 1: // Student
                    sql = "select s.*,concat(s.fname,ifnull(concat(' ',mname),''),' ',s.lname) as name,s.inst_email as mail,s.regno as tag,s.cellphone as phone,'01' as gid,g.group_name,p.short_name as program_name,d.short_name as unitname from ehub_identity.user u left join ehub_identity.group g on u.group_id = g.group_id left join osis.students_db s on u.tag = s.regno left join osis.prog_db p on s.progid = p.progid left join osis.departments d on d.deptid = p.deptid where u.uid = ?";
                    break;
                case 2: // Staff
                    sql = "select s.*,j.title as designation,x.long_name as unitname,concat(s.fname,ifnull(concat(' ',mname),''),' ',s.lname) as name,s.staff_no as tag,u.uid,g.group_name from ehub_identity.user u left join ehub_identity.group g on u.group_id = g.group_id left join hr.staff s on u.tag = s.staff_no left join hr.promotion p on s.promo_id = p.id left join hr.job j on j.id = p.job_id left join hr.unit x on p.unit_id = x.id where u.uid = ?";
                    break;
                case 3: // NSS
                    sql = "select s.*,'NSS Personel' as descriptor,ifnull(x.long_name,s.unit_assigned) as unitname,concat(s.fname,ifnull(concat(' ',mname),''),' ',s.lname) as name,s.email as mail,s.mobile as phone,s.nss_no as tag,u.uid,g.group_name from ehub_identity.user u left join ehub_identity.group g on u.group_id = g.group_id left join hr.nss s on u.tag = s.nss_no left join hr.unit x on s.unit_id = x.id where u.uid = ?";
                    break;
                case 4: // Job Applicant
                    sql = "select * from ehub_identity.photo p where p.uid = ?";
                    break;
                case 5: // Alumni
                    sql = "select *, p.refno as tag from ehub_alumni.member p where p.refno = ?";
                    break;
                default: // Staff
                    sql = "select s.*,j.title as designation,x.long_name as unitname,concat(s.fname,ifnull(concat(' ',mname),''),' ',s.lname) as name,u.uid,g.group_name from ehub_identity.user u left join ehub_identity.group g on u.group_id = g.group_id left join hr.staff s on u.tag = s.staff_no left join hr.promotion p on s.promo_id = p.id left join hr.job j on j.id = p.job_id left join hr.unit x on p.unit_id = x.id where u.uid = ?";
                    break;
            }
            const res = yield db.query(sql, [uid]);
            return res && res[0];
        });
    }
    fetchSSOUser(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = "select u.*,g.group_name from ehub_identity.user u left join ehub_identity.group g on u.group_id = g.group_id where u.tag = ?";
            const res = yield db.query(sql, [tag]);
            return res && res[0];
        });
    }
    verifyUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = "select u.* from ehub_identity.user u where u.username = ?";
            const res = yield db.query(sql, [email]);
            return res;
        });
    }
    fetchUserByVerb(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                keyword = keyword == null || keyword == "null" ? "" : keyword.trim();
                const sql = ` 
          select s.*,concat(s.fname,ifnull(concat(' ',mname),''),' ',s.lname) as name,s.inst_email as mail,s.regno as tag,s.cellphone as phone,'01' as gid,'STUDENT' as group_name,p.short_name as descriptor,d.short_name as unitname from osis.students_db s left join osis.prog_db p on s.progid = p.progid left join osis.departments d on d.deptid = p.deptid where s.regno = ? or s.inst_email = ?; 
          select s.*,j.title as designation,x.long_name as unitname,concat(s.fname,ifnull(concat(' ',mname),''),' ',s.lname) as name,s.ucc_mail as mail,s.staff_no as tag,'02' as gid,'STAFF' as group_name,j.title as descriptor,x.long_name as unitname from hr.staff s left join hr.promotion p on s.promo_id = p.id left join hr.job j on j.id = p.job_id left join hr.unit x on p.unit_id = x.id where s.ucc_mail = ? or trim(s.staff_no) = ?;
          select s.*,concat(s.fname,ifnull(concat(' ',mname),''),' ',s.lname) as name,s.mobile as phone,'03' as gid,'NSS' as group_name from hr.nss s left join hr.unit x on s.unit_id = x.id where lower(s.nss_no) = ? or lower(s.email) = ?;
        `;
                const res = yield db.query(sql, [keyword, keyword, keyword, keyword, keyword === null || keyword === void 0 ? void 0 : keyword.toLowerCase(), keyword === null || keyword === void 0 ? void 0 : keyword.toLowerCase()]);
                if (res) {
                    if (res[0].length)
                        return res[0][0];
                    if (res[1].length)
                        return res[1][0];
                    if (res[2].length)
                        return res[2][0];
                }
                return null;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    fetchRolesByApp(app_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = "select x.urole_id as id,x.status,u.tag,u.group_id,u.username,p.role_name,x.arole_id,x.urole_id from ehub_identity.user_role x left join ehub_identity.user u on x.uid = u.uid left join ehub_identity.app_role p on x.arole_id = p.arole_id where p.app_id = ?";
            const res = yield db.query(sql, [app_id]);
            console.log(res);
            return res;
        });
    }
    fetchRoleById(urole_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = "select x.urole_id as id,x.status,u.tag,u.group_id,u.username,p.role_name,x.arole_id,x.urole_id from ehub_identity.user_role x left join ehub_identity.user u on x.uid = u.uid left join ehub_identity.app_role p on x.arole_id = p.arole_id where x.urole_id = ?";
            const res = yield db.query(sql, urole_id);
            return res && res[0];
        });
    }
    insertSSOUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // const sql = "insert into ehub_identity.user set ?";
            const sql = "replace into ehub_identity.user set ?";
            const res = yield db.query(sql, data);
            return res;
        });
    }
    insertSSORole(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = "insert into ehub_identity.user_role set ?";
            const res = yield db.query(sql, data);
            return res;
        });
    }
    updateSSORole(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = "update ehub_identity.user_role set ? where urole_id = ?";
            const res = yield db.query(sql, [data, id]);
            return res;
        });
    }
    deleteSSORole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = "delete from ehub_identity.user_role where urole_id = ?";
            const res = yield db.query(sql, id);
            return res;
        });
    }
    updateSSOPassword(tag, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = "update ehub_identity.user set ? where tag = ?";
            const res = yield db.query(sql, [data, tag]);
            return res;
        });
    }
}
exports.default = AuthModel;
/*




  updateUserByEmail: async (email, data) => {
    const sql =
      "update ehub_identity.user set ? where username = '" + email + "'";
    const res = await db.query(sql, data);
    return res;
  },

  insertSSOUser: async (data) => {
    const sql = "insert into ehub_identity.user set ?";
    const res = await db.query(sql, data);
    return res;
  },

  insertSSORole: async (data) => {
    const sql = "insert into ehub_identity.user_role set ?";
    const res = await db.query(sql, data);
    return res;
  },

  deleteSSORole: async (uid, role) => {
    const sql =
      "delete from ehub_identity.user_role where uid = " +
      uid +
      " and arole_id = " +
      role;
    const res = await db.query(sql);
    return res;
  },



  updateDomainPassword: async (tag, gid, password, sdata) => {
    var sql, res;
    if (parseInt(gid) == 1) {
      sql = "update osisextra.useraccount set password = md5(?), cdate = now() where regno = ?";
      res = await db.query(sql, [password,tag]);
    } else if (parseInt(gid) == 2) {
      const isExist = await db.query("select * from hr.`user` where staff_no = ?",[tag]);
      if (isExist && isExist.length > 0) {
        sql = "update hr.`user` set password = ? where staff_no = ?";
        res = await db.query(sql,[password,tag]);
      } else {
        const dt = { username: tag, staff_no: tag, password, role: "03", roles: "03" };
        sql = "insert into hr.`user` set ?";
        res = await db.query(sql, dt);
      }
    }

    if (res && (res.affectedRows > 0 || res.insertId > 0)) {
      const sql ="update ehub_identity.user set flag_ad = ?, flag_gs = ? where uid = ?";
      const resx = await db.query(sql, [ sdata.userdata.flag_ad, sdata.userdata.flag_gs, sdata.userdata.uid ]);
    }
    return res;
  },

  generateMail: async (user, domain) => {
    const { fname, lname, tag } = user;
    var username = getUsername(fname, lname);
    var mail, count;
    while (true) {
      mail = `${username}${!count ? "" : count}@${domain}`;
      const isExist = await Box.checkGsUser(mail);
      if (isExist) {
        count = !count ? 2 : count + 1;
      } else {
        break;
      }
      setTimeout(() => null, 200);
    }

    if (parseInt(user.gid) == 1) {
      // Update osis.students_db set inst_email = mail
    } else {
      // Update hr.staff set ucc_mail = mail
      const res = await db.query("update hr.staff set ucc_mail = ? where staff_no = ?",[mail,tag]);
    }
  },

  
 fetchEvsPhoto: async (tag, eid) => {
      var sql;
      if (tag == "logo") {
        sql = "select logo as path from ehub_vote.election where id = ?";
      } else {
        sql = "select photo as path from ehub_vote.candidate where id = ?";
      }
      const res = await db.query(sql, [eid]);
      return res;
    },
  
    
    fetchUserByVerb: async (keyword) => {
      keyword = keyword == null || keyword == "null" ? "" : keyword.trim();
      var sql, res;
      // Student
      sql =
        "select s.*,concat(s.fname,' ',ifnull(concat(mname,' '),''),s.lname) as name,s.inst_email as mail,s.regno as tag,s.cellphone as phone,'01' as gid,'STUDENT' as group_name,p.short_name as descriptor,d.short_name as unitname from osis.students_db s left join osis.prog_db p on s.progid = p.progid  left join osis.departments d on d.deptid = p.deptid where s.regno = '" +
        keyword +
        "' or s.inst_email = '" +
        keyword +
        "'";
      const res1 = await db.query(sql);
      if (res1 && res1.length > 0) res = res1[0];
  
      // Staff
      sql =
        "select s.*,j.title as designation,x.long_name as unitname,concat(s.fname,' ',ifnull(concat(mname,' '),''),s.lname) as name,s.ucc_mail as mail,s.staff_no as tag,'02' as gid,'STAFF' as group_name,j.title as descriptor,x.long_name as unitname from hr.staff s left join hr.promotion p on s.promo_id = p.id left join hr.job j on j.id = p.job_id left join hr.unit x on p.unit_id = x.id where (s.ucc_mail = '" +
        keyword +
        "' or trim(s.staff_no) = '" +
        keyword +
        "') and s.ucc_mail is not null";
      const res2 = await db.query(sql);
      if (res2 && res2.length > 0) res = res2[0];
  
      // NSS
      sql =
        "select s.*,concat(s.fname,' ',ifnull(concat(mname,' '),''),s.lname) as name,s.mobile as phone,'03' as gid,'NSS' as group_name from hr.nss s left join hr.unit x on s.unit_id = x.id where s.nss_no = '" +
        keyword +
        "' or s.email = '" +
        keyword +
        "'";
      const res3 = await db.query(sql);
      if (res3 && res3.length > 0) res = res3[0];
  
      // Applicant (Job)
      //sql = "select *,'04' as gid from ehub_identity.photo p where p.uid = "+uid;
      //const res4 = await db.query(sql);
      //if(res4 && res4.length > 0) res = res4[0]
  
      // Alumni
      sql =
        "select *,'05' as gid,'ALUMNI' as group_name from ehub_alumni.member where refno = '" +
        keyword +
        "'";
      const res5 = await db.query(sql);
      if (res5 && res5.length > 0) res = res5[0];
  
      return res;
    },
  
    fetchUsersByVerb: async (keyword) => {
      keyword = keyword == null || keyword == "null" ? "" : keyword.trim();
      var sql, res;
      // Student
      sql =
        "select s.*,concat(s.fname,' ',ifnull(concat(mname,' '),''),s.lname) as name,s.inst_email as mail,s.regno as tag,s.cellphone as phone,'01' as gid,'STUDENT' as group_name,p.short_name as descriptor,d.short_name as unitname from osis.students_db s left join osis.prog_db p on s.progid = p.progid  left join osis.departments d on d.deptid = p.deptid where s.regno = '" +
        keyword +
        "' or s.inst_email = '" +
        keyword +
        "'";
      const res1 = await db.query(sql);
      if (res1 && res1.length > 0) res = res1;
  
      // Staff
      sql =
        "select s.*,j.title as designation,x.long_name as unitname,concat(s.fname,' ',ifnull(concat(mname,' '),''),s.lname) as name,s.ucc_mail as mail,s.staff_no as tag,'02' as gid,'STAFF' as group_name,j.title as descriptor,x.long_name as unitname from hr.staff s left join hr.promotion p on s.promo_id = p.id left join hr.job j on j.id = p.job_id left join hr.unit x on p.unit_id = x.id where (s.ucc_mail = '" +
        keyword +
        "' or trim(s.staff_no) = '" +
        keyword +
        "') and s.ucc_mail is not null";
      const res2 = await db.query(sql);
      if (res2 && res2.length > 0) res = res2;
  
      // NSS
      sql =
        "select s.*,concat(s.fname,' ',ifnull(concat(mname,' '),''),s.lname) as name,s.mobile as phone,'03' as gid,'NSS' as group_name from hr.nss s left join hr.unit x on s.unit_id = x.id where s.nss_no = '" +
        keyword +
        "' or s.email = '" +
        keyword +
        "'";
      const res3 = await db.query(sql);
      if (res3 && res3.length > 0) res = res3;
  
      // Applicant (Job)
      //sql = "select *,'04' as gid from ehub_identity.photo p where p.uid = "+uid;
      //const res4 = await db.query(sql);
      //if(res4 && res4.length > 0) res = res4[0]
  
      // Alumni
      sql =
        "select *,'05' as gid,'ALUMNI' as group_name from ehub_alumni.member where refno = '" +
        keyword +
        "'";
      const res5 = await db.query(sql);
      if (res5 && res5.length > 0) res = res5;
  
      return res;
    },
  
    fetchUserByPhone: async (phone) => {
      // Student
      const res1 = await db.query(
        "select s.*,p.short as program_name,m.title as major_name,concat(s.fname,' ',ifnull(concat(mname,' '),''),s.lname) as name, x.title as session_name,x.academic_year as session_year,x.academic_sem as session_semester,x.id as session_id,x.cal_register_start,x.cal_register_end,u.username,u.uid,u.group_id,u.group_id as gid from ehub_identity.user u left join ais.student s on u.tag = s.refno left join ehub_utility.program p on s.prog_id = p.id left join ais.major m on s.major_id = m.id left join ehub_utility.session x on x.mode_id = p.mode_id where x.default = 1 and s.phone = " +
          phone
      );
      // Staff
      const res2 = await db.query(
        "select s.*,j.title as designation,x.title as unitname,concat(s.fname,' ',ifnull(concat(mname,' '),''),s.lname) as name,u.username,u.uid,u.group_id,u.group_id as gid from ehub_identity.user u left join ehub_hrs.staff s on u.tag = s.staff_no left join ehub_hrs.job j on j.id = s.job_id left join ehub_utility.unit x on s.unit_id = x.id where s.phone = " +
          phone
      );
      // NSS
      // Applicant (Job)
      // Alumni
      if (res1 && res1.length > 0) return res1;
      if (res2 && res2.length > 0) return res2;
    },





*/ 
