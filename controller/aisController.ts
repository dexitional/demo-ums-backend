import { Request, Response } from "express";
import moment from "moment";
import { prisma } from "../prisma/client";

import fs from "fs";
import path from "path";
import { getClass, getGrade, getGradePoint, getOrSetCache } from "../util/helper";
import { paramStr } from "../util/paramStr";
import { completeType } from "@prisma/client";
import { graduateSession } from "../drizzle/schema";
const ais: any = prisma;
const sha1 = require('sha1');
const { customAlphabet } = require("nanoid");
const pwdgen = customAlphabet("1234567890abcdefghijklmnopqrstuvwzyx", 6);
const sms = require('../config/sms');
const ExcelJS = require('exceljs');



export default class AisController {

   async fetchTest(req: Request, res: Response) {
      try {
         const tag = '24010001';
         const resp = await ais.election.findMany({
            // where: { voterList: { array_contains: tag }},
            where: { voterData: { path: '$[*].tag', array_contains: tag } },
         })
         if (resp?.length) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   /* Reports */
   async loadReport(req: Request, res: Response) {
      try {
         let { type, program, major, year, mode, session, gsession, rsession, category } = req.body;
         let resp: any = { type };

         if (type == 'student_registration') {
            let regs = await ais.activityRegister.findMany({
               where: {
                  session: { default: true },
                  ...program && ({ student: { programId: program } }),
                  ...major && ({ student: { majorId: major } }),
                  ...mode && ({ student: { studyMode: mode } }),
                  ...year && ({ semesterNum: { in: [(Number(year) * 2), (Number(year) * 2) - 1] } }),
               },
               include: { student: { include: { program: true, major: true } }, session: true },
               orderBy: [
                  { session: { createdAt: 'asc' } },
                  { student: { programId: 'asc' } },
                  { student: { majorId: 'asc' } },
                  { student: { semesterNum: 'asc' } },
                  { student: { studyMode: 'asc' } },
                  { student: { lname: 'asc' } },
               ]
            })
            if (regs.length) {
               regs = regs.map((r: any) => ({
                  'LAST NAME': r.student?.lname?.toUpperCase(),
                  'FIRST NAME': r.student?.fname?.toUpperCase(),
                  'MIDDLE NAME(S)': r.student?.mname?.toUpperCase(),
                  'INDEX NUMBER': r.student?.indexno,
                  'STUDENT ID': r.student?.id,
                  'STUDY MODE': r.student?.studyMode,
                  'GENDER': r.student?.gender,
                  'YEAR': Math.ceil(r.semesterNum / 2),
                  'ACADEMIC SESSION': `${r.session?.title} - ${r.session?.tag}`,
                  'PROGRAM': r.student?.program?.shortName,
                  'MAJOR': r.student?.major?.shortName,
                  'COURSES': r.courses,
                  'REGISTRATION DATE': r.createdAt
               }))
               resp = { ...resp, data: regs }
            }

         } else if (type == 'student_deferment') {
            let regs = await ais.activityDefer.findMany({
               where: {
                  ...program && ({ student: { programId: program } }),
                  ...major && ({ student: { majorId: major } }),
                  ...mode && ({ student: { studyMode: mode } }),
                  ...year && ({ semesterNum: { in: [(Number(year) * 2), (Number(year) * 2) - 1] } }),
               },
               include: { student: { include: { program: true, major: true } } },
               orderBy: [
                  { student: { programId: 'asc' } },
                  { student: { majorId: 'asc' } },
                  { student: { semesterNum: 'asc' } },
                  { student: { studyMode: 'asc' } },
                  { student: { lname: 'asc' } },
               ]
            })
            if (regs.length) {
               regs = regs.map((r: any) => ({
                  'LAST NAME': r.student?.lname?.toUpperCase(),
                  'FIRST NAME': r.student?.fname?.toUpperCase(),
                  'MIDDLE NAME(S)': r.student?.mname?.toUpperCase(),
                  'INDEX NUMBER': r.student?.indexno,
                  'STUDENT ID': r.student?.id,
                  'STUDY MODE': r.student?.studyMode,
                  'GENDER': r.student?.gender,
                  'YEAR': Math.ceil(r.semesterNum / 2),
                  'PROGRAM': r.student?.program?.shortName,
                  'MAJOR': r.student?.major?.shortName,
                  'DURATION': r.durationInYears,
                  'RESUMPTION DATE': r.end
               }))
               resp = { ...resp, data: regs }
            }

         } else if (type == 'student_debtor') {
            let regs = await ais.student.findMany({
               where: {
                  //completeStatus: false,
                  accountNet: { gt: 0 },
                  ...program && ({ programId: program }),
                  ...major && ({ majorId: major }),
                  ...mode && ({ studyMode: mode }),
                  ...year && ({ semesterNum: { in: [(Number(year) * 2), (Number(year) * 2) - 1] } }),
               },
               include: { program: true, major: true },
               orderBy: [
                  { programId: 'asc' },
                  { majorId: 'asc' },
                  { semesterNum: 'asc' },
                  { studyMode: 'asc' },
                  { lname: 'asc' },
               ]
            })
            if (regs.length) {
               regs = regs.map((r: any) => ({
                  'LAST NAME': r.lname?.toUpperCase(),
                  'FIRST NAME': r.fname?.toUpperCase(),
                  'MIDDLE NAME(S)': r.mname?.toUpperCase(),
                  'INDEX NUMBER': r.indexno,
                  'STUDENT ID': r.id,
                  'STUDY MODE': r.studyMode,
                  'GENDER': r.gender,
                  'YEAR': Math.ceil(r.semesterNum / 2),
                  'PROGRAM': r.program?.shortName,
                  'MAJOR': r.major?.shortName,
                  'STUDENT ACCOUNT NET': r.accountNet,
               }))
               resp = { ...resp, data: regs }
            }

         } else if (type == 'student_profile') {
            let regs = await ais.student.findMany({
               where: {
                  completeStatus: false,
                  ...program && ({ programId: program }),
                  ...major && ({ majorId: major }),
                  ...mode && ({ studyMode: mode }),
                  ...year && ({ semesterNum: { in: [(Number(year) * 2), (Number(year) * 2) - 1] } }),
               },
               include: { program: true, major: true },
               orderBy: [
                  { programId: 'desc' },
                  { majorId: 'asc' },
                  { semesterNum: 'asc' },
                  { studyMode: 'asc' },
                  { lname: 'asc' },
               ]
            })
            if (regs.length) {
               regs = regs.map((r: any) => ({
                  'LAST NAME': r.lname?.toUpperCase(),
                  'FIRST NAME': r.fname?.toUpperCase(),
                  'MIDDLE NAME(S)': r.mname?.toUpperCase(),
                  'INDEX NUMBER': r.indexno,
                  'STUDENT ID': r.id,
                  'STUDY MODE': r.studyMode,
                  'GENDER': r.gender,
                  'YEAR': Math.ceil(r.semesterNum / 2),
                  'PROGRAM': r.program?.shortName,
                  'MAJOR': r.major?.shortName,
                  'STATUS': r.deferStatus == 1 ? 'DEFERRED' : 'ACTIVE',
               }))
               resp = { ...resp, data: regs }
            }

         } else if (type == 'exam_eligible') {
            let regs = await ais.student.findMany({
               where: {
                  OR: [
                     { accountNet: { lte: 0 } },
                     { flagPardon: true },
                  ],
                  AND: [
                     { completeStatus: false },
                     { ...program && ({ programId: program }) },
                     { ...major && ({ majorId: major }) },
                     { ...mode && ({ studyMode: mode }) },
                     { ...year && ({ semesterNum: { in: [(Number(year) * 2), (Number(year) * 2) - 1] } }) },
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
            })
            if (regs.length) {
               regs = regs.map((r: any) => ({
                  'LAST NAME': r.lname?.toUpperCase(),
                  'FIRST NAME': r.fname?.toUpperCase(),
                  'MIDDLE NAME(S)': r.mname?.toUpperCase(),
                  'INDEX NUMBER': r.indexno,
                  'STUDENT ID': r.id,
                  'STUDY MODE': r.studyMode,
                  'GENDER': r.gender,
                  'YEAR': Math.ceil(r.semesterNum / 2),
                  'PROGRAM': r.program?.shortName,
                  'MAJOR': r.major?.shortName,
                  'STATUS': r.deferStatus == 1 ? 'DEFERRED' : 'ACTIVE',
               }))
               resp = { ...resp, data: regs }
            }

         } else if (type == 'resit') {
            let regs = await ais.resit.findMany({
               where: {
                  OR: [
                     { ...session && ({ session: { default: true } }) },
                     { ...rsession && ({ trailSession: { default: true } }) },
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
            })
            if (regs.length) {
               regs = regs.map((r: any) => ({
                  'LAST NAME': r.student.lname?.toUpperCase(),
                  'FIRST NAME': r.student.fname?.toUpperCase(),
                  'MIDDLE NAME(S)': r.student.mname?.toUpperCase(),
                  'INDEX NUMBER': r.student?.indexno,
                  'STUDENT ID': r.student?.id,
                  'STUDY MODE': r.student.studyMode,
                  'GENDER': r.student.gender,
                  'YEAR': Math.ceil(r.student.semesterNum / 2),
                  'PROGRAM': r.student.program?.shortName,
                  'COURSE': `${r.course?.title} - ${r.course?.id}`,
                  'REGISTRATION DATE': r.registeredAt ? 'YES' : 'NO',
                  'PAYMENT STATUS': r.paid ? 'YES' : 'NO',
               }))
               resp = { ...resp, data: regs }
            }

         } else if (type == 'graduate_list') {
            let regs = await ais.graduate.findMany({
               where: {
                  ...gsession && ({ graduateSession: { default: true } }),
               },
               include: { graduateSession: true, student: { include: { program: true, major: true } } },
               orderBy: [
                  { student: { programId: 'asc' } },
                  { student: { majorId: 'asc' } },
                  { student: { semesterNum: 'asc' } },
                  { student: { studyMode: 'asc' } },
                  { student: { lname: 'asc' } },
               ]
            })
            if (regs.length) {
               regs = regs.map((r: any) => ({
                  'LAST NAME': r.student.lname?.toUpperCase(),
                  'FIRST NAME': r.student.fname?.toUpperCase(),
                  'MIDDLE NAME(S)': r.student.mname?.toUpperCase(),
                  'INDEX NUMBER': r.student?.indexno,
                  'STUDENT ID': r.student?.id,
                  'STUDY MODE': r.student.studyMode,
                  'GENDER': r.student.gender,
                  'PROGRAM': r.student.program?.shortName,
                  'MAJOR': r.student.major?.shortName,
                  'SESSION': r.graduateSession?.title?.toUpperCase(),
                  'CGPA': r.cgpa,
                  'CLASS': r.class,
               }))
               resp = { ...resp, data: regs }
            }

         } else if (type == 'staff') {
            let regs = await ais.staff.findMany({
               where: {
                  ...category && ({ unit: { type: category } }),
               },
               include: { job: true, unit: true },
               orderBy: [
                  { staffNo: 'asc' },
               ]
            })
            if (regs.length) {
               regs = regs.map((r: any) => ({
                  'LAST NAME': r.lname?.toUpperCase(),
                  'FIRST NAME': r.fname?.toUpperCase(),
                  'MIDDLE NAME(S)': r.mname?.toUpperCase(),
                  'STAFF NUMBER': r.staffNo,
                  'PHONE NUMBER': r.phone,
                  'EMAIL': r?.email,
                  'INSTITUTIONAL EMAIL': r.instituteEmail,
                  'UNIT': r.unit?.title?.toUpperCase(),
                  'DESIGNATION': r.job?.title?.toUpperCase(),
                  'STAFF STATUS': r.staffStatus,
               }))
               resp = { ...resp, data: regs }
            }
         }

         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   /* Dashboard & Statistics */
   async loadDashboard(req: Request, res: Response) {
      try {
         // Main Statistics
         // const students:any = await ais.student.findMany({ where: { default: true } }); // students

         // Academic Session Statistics
         const sessions: any = await ais.session.findMany({ where: { default: true } }); // Sessions
         const academic = await Promise.all(sessions.map(async (s: any) => {
            const { tag } = s;
            // Registered
            const reg: any = await ais.activityRegister.findMany({ where: { sessionId: s.id } });
            // const unregister:any = await ais.activityRegister.findMany({ where: { sessionId: s.id, student: { gender: 'F' }} });
            const unreg: any = tag == 'MAIN'
               ? await ais.$queryRaw`select id from ais_student s where (date_format(entryDate,'%m') = '09' or (date_format(entryDate,'%m') = '01' and ((entrySemesterNum = 1 and semesterNum > 2) or (entrySemesterNum = 3 and semesterNum > 4)))) and completeStatus = 0 and deferStatus = 0 and indexno not in (select indexno from ais_activity_register where sessionId = ${s.id})`
               : await ais.$queryRaw`select id from ais_student s where date_format(entryDate,'%m') = '01' and ((entrySemesterNum = 1 and semesterNum < 3) or (entrySemesterNum = 3 and semesterNum < 5)) and completeStatus = 0 and deferStatus = 0 and indexno not in (select indexno from ais_activity_register where sessionId = ${s.id})`;
            return ({
               label: `${s.title} - ${s.tag}`,
               register: reg?.length,
               unregister: unreg?.length
            })
         }));

         // Resit Session Statistics
         const rsession: any = await ais.resitSession.findFirst({ where: { default: true } }); // Resit Sessions
         const reg_resit: any = await ais.resit.count({ where: { resitSession: { default: true }, registeredAt: { not: null }, taken: false } }); // Registered Resits
         const all_resit: any = await ais.resit.count({ where: { resitSessionId: null } }); // All Students Resits
         const cs_resit: any = await ais.resit.groupBy({
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
            label: rsession?.title,
            register: reg_resit,
            estimate: all_resit,
            courses: cs_resit?.length || 0,
         }

         // Graduation Session Statistics
         const gsession: any = await ais.graduateSession.findFirst({ where: { default: true } }); // Resit Sessions
         const graduand: any = await ais.graduate.count({ where: { graduateSession: { default: true } } }); // Registered Resits
         const completed: any = await ais.student.count({ where: { completeStatus: true, graduateStatus: false } }); // All Students Resits
         const graduation = {
            label: gsession?.title,
            graduand,
            complete: completed,
         }

         // Student Statistics
         const mactive: any = await ais.student.count({ where: { completeStatus: false, deferStatus: false, gender: 'M' } });
         const factive: any = await ais.student.count({ where: { completeStatus: false, deferStatus: false, gender: 'F' } });
         const mdefer: any = await ais.student.count({ where: { completeStatus: false, deferStatus: true, gender: 'M' } });
         const fdefer: any = await ais.student.count({ where: { completeStatus: false, deferStatus: true, gender: 'F' } });
         const mcomplete: any = await ais.student.count({ where: { completeStatus: true, deferStatus: false, gender: 'M' } });
         const fcomplete: any = await ais.student.count({ where: { completeStatus: true, deferStatus: false, gender: 'F' } });
         const mgraduate: any = await ais.student.count({ where: { completeStatus: true, deferStatus: false, graduateStatus: true, gender: 'M' } });
         const fgraduate: any = await ais.student.count({ where: { completeStatus: true, deferStatus: false, graduateStatus: true, gender: 'F' } });



         // Department Statistics
         const depts = await ais.unit.findMany({ where: { type: 'ACADEMIC', levelNum: 2 } });
         const department = await Promise.all(depts.map(async (r: any) => {
            const programs = await ais.program.count({ where: { unitId: r.id } });
            const students = await ais.student.count({ where: { program: { unitId: r.id }, completeStatus: false } });
            const staff = await ais.staff.count({ where: { unitId: r.id, status: true } });
            return ({
               label: r.title,
               programs,
               students,
               staff
            })
         }));

         // Program Statistics
         const progs = await ais.program.findMany();
         const program = await Promise.all(progs.map(async (r: any) => {
            // // Applicant
            // const m_applicant:any = await ais.$queryRaw`select * from ams_step_choice c left join ams_step_profile p on p.serial = c.serial left join ams_applicant a on p.serial = a.serial where p.gender = 'M' and a.admissionId = ${session?.id} and c.programId = ${r?.id}`;
            // const f_applicant:any = await ais.$queryRaw`select * from ams_step_choice c left join ams_step_profile p on p.serial = c.serial left join ams_applicant a on p.serial = a.serial where p.gender = 'F' and a.admissionId = ${session?.id} and c.programId = ${r?.id}`;
            const y1 = await ais.student.count({ where: { programId: r.id, completeStatus: false, semesterNum: { in: [1, 2] } } });
            const y2 = await ais.student.count({ where: { programId: r.id, completeStatus: false, semesterNum: { in: [3, 4] } } });
            const y3 = await ais.student.count({ where: { programId: r.id, completeStatus: false, semesterNum: { in: [5, 6] } } });
            const y4 = await ais.student.count({ where: { programId: r.id, completeStatus: false, semesterNum: { in: [7, 8] } } });

            return ({
               label: r.code,
               y1,
               y2,
               y3,
               y4,
            })
         }));



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
         }

         if (data) {
            res.status(200).json(data)
         } else {
            res.status(204).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   /* Session */
   async fetchSessionList(req: Request, res: Response) {
      try {
         const resp = await ais.session.findMany({ where: { status: true }, orderBy: { createdAt: 'desc' } })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchSessions(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition: any = { orderBy: { createdAt: 'desc' } }
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { title: { contains: keyword } },
                  { id: { contains: keyword } },
               ],
            },
            orderBy: { createdAt: 'desc' }
         }
         const resp = await ais.$transaction([
            ais.session.count({
               ...(searchCondition),
            }),
            ais.session.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
            })
         ]);

         //if(resp && resp[1]?.length){
         res.status(200).json({
            totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
            totalData: resp[1]?.length,
            data: resp[1],
         })
         //} else {
         //res.status(202).json({ message: `no records found` })
         //}
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchSession(req: Request, res: Response) {
      try {
         const resp = await ais.session.findUnique({
            where: {
               id: paramStr(req.params.id)
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async activateSession(req: Request, res: Response) {
      try {
         const { sessionId } = req.body;

         const resm = await ais.session.findUnique({ where: { id: sessionId } })
         const resx = await ais.session.updateMany({ where: { NOT: { id: sessionId }, tag: resm?.tag }, data: { default: false } })
         //const resx = await ais.session.updateMany({ where: { NOT: { id: sessionId }  }, data: { default: false } })
         const resp = await ais.session.update({ where: { id: sessionId }, data: { default: true } })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   async postSession(req: Request & any, res: Response) {
      try {
         const resp = await ais.session.create({ data: { ...req.body } })
         if (resp) {
            // Log Login Response
            await ais.log.create({ data: { action: `CALENDAR_CREATED`, user: req?.userId, meta: req.body } })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateSession(req: Request & any, res: Response) {
      try {
         const resp = await ais.session.update({
            where: {
               id: paramStr(req.params.id)
            },
            data: {
               ...req.body,
            }
         })
         if (resp) {
            // Log Login Response
            await ais.log.create({ data: { action: `CALENDAR_UPDATED`, user: req?.userId, meta: req.body } })
            //  Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteSession(req: Request & any, res: Response) {
      try {
         const resp = await ais.session.delete({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            // Log Login Response
            await ais.log.create({ data: { action: `CALENDAR_DELETED`, user: req?.userId, meta: req.body } })
            // Return response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }



   /* Student */
   async fetchStudents(req: Request, res: Response) {
      const { page = 1, pageSize = 6, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
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
         }
         const resp = await ais.$transaction([
            ais.student.count({
               ...(searchCondition),
            }),
            ais.student.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
               include: {
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
               },
               orderBy: [
                  { completeStatus: 'asc' },
                  { semesterNum: 'asc' }
               ]
            })
         ]);

         //if(resp && resp[1]?.length){
         res.status(200).json({
            totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
            totalData: resp[1]?.length,
            data: resp[1],
         })
         //} else {
         //res.status(202).json({ message: `no records found` })
         //}
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchStudent(req: Request, res: Response) {
      try {
         const resp = await ais.student.findUnique({
            where: {
               id: paramStr(req.params.id)
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
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchStudentTranscript(req: Request, res: Response) {
      try {
         const st: any = await ais.student.findFirst({
            where: {
               OR: [
                  {
                     AND: [
                        { indexno: { not: null } },
                        { id: paramStr(req.params.id) }
                     ]
                  },
                  { indexno: paramStr(req.params.id) }
               ]
            },
            select: { indexno: true, fname: true, mname: true, lname: true, id: true, gender: true, entryDate: true, exitDate: true, program: { select: { longName: true, shortName: true, stype: true, category: true } } }
         });

         if (!st) throw ("No index number generated")
         const resp = await ais.assessment.findMany({
            where: {
               indexno: st?.indexno,
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
            var mdata: any = new Map();
            for (const sv of resp) {
               const index: string = sv?.session?.title ?? 'none';
               const grades: any = sv.scheme?.gradeMeta;
               const classes: any = sv.scheme?.classMeta;
               const zd = { ...sv, student: st, grade: await getGrade(sv.totalScore, grades), gradepoint: await getGradePoint(sv.totalScore, grades), classes }
               // Data By Courses
               if (mdata.has(index)) {
                  mdata.set(index, [...mdata.get(index), { ...zd }])
               } else {
                  mdata.set(index, [{ ...zd }])
               }
            }
            return res.status(200).json(Array.from(mdata))
         } else {
            return res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(202).json({ message: error.message })
      }
   }


   async fetchStudentTranscripts(req: Request, res: Response) {
      try {

         const cacheKey = `transcripts:${JSON.stringify(req.body.key)}`;
         const result = await getOrSetCache(cacheKey, async () => {

            const resp = await ais.broadsheet.findMany({
               where: {
                  indexno: { in: req.body?.data },
               },
               orderBy: { sessionCreatedAt: 'asc' }
            });

            if (resp?.length) {
               var mdata: any = new Map();
               for (const sv of resp) {
                  const index: string = sv.indexno;
                  if (mdata.has(index)) {
                     mdata.set(index, [...mdata.get(index), sv])
                  } else {
                     mdata.set(index, [sv])
                  }
               }

               const vdata = await Promise.all(Array.from(mdata)?.map(async (st: any) => {
                  let [indexno, tdata] = st;
                  let sdata: any = new Map();

                  for (const sv of tdata) {
                     const cindex: string = sv.title ?? 'none';
                     const grades: any = sv.gradeMeta;
                     const classes: any = sv.classMeta;
                     const zd = { ...sv, grade: await getGrade(sv.totalScore, grades), gradepoint: await getGradePoint(sv.totalScore, grades), classes }
                     // Data By Courses
                     if (sdata.has(cindex)) {
                        sdata.set(cindex, [...sdata.get(cindex), { ...zd }])
                     } else {
                        sdata.set(cindex, [{ ...zd }])
                     }
                  }
                  return [indexno, Array.from(sdata)]
               }))
               return vdata;
            }  
         });
         if(result){
            // Return Response
            return res.status(200).json(result);
         } else {
            return res.status(202).json({ message: `No records` })
         }
        

      } catch (error: any) {
         console.log(error)
         return res.status(202).json({ message: error.message })
      }
   }


   async fetchStudentFinance(req: Request, res: Response) {
      try {
         const resp = await ais.studentAccount.findMany({
            where: { studentId: paramStr(req.params.id) },
            include: {
               student: { select: { fname: true, mname: true, indexno: true, program: { select: { longName: true } } } },
               bill: { select: { narrative: true } },
               charge: { select: { title: true } },
               session: { select: { title: true } },
               transaction: { select: { transtag: true } },
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchStudentActivity(req: Request, res: Response) {
      try {
         const resp = await ais.student.findUnique({
            where: {
               id: paramStr(req.params.id)
            },
            include: {
               country: true,
               program: {
                  select: {
                     longName: true
                  }
               },
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async stageStudent(req: Request & any, res: Response) {
      try {
         const { studentId } = req.body
         const password = pwdgen();
         const isUser = await ais.user.findFirst({ where: { tag: studentId } })
         if (isUser) throw ("Student Portal Account Exists!")
         const ssoData = { tag: studentId, username: studentId, password: sha1(password), unlockPin: password }  // AUCC only
         //   const ssoData = { tag:studentId, username:studentId, password:sha1(password), unlockPin: password }  // MLK & Others
         // Populate SSO Account
         const resp = await ais.user.create({
            data: {
               ...ssoData,
               group: { connect: { id: 1 } },
            },
         })
         if (resp) {
            // Send Credentials By SMS
            const st = await ais.student.findFirst({ where: { id: studentId } });
            if (st?.phone) await sms(st?.phone, `Hi! Your new credentials is username: ${st?.instituteEmail ?? studentId}, password: ${password}`)
            // Log Login Response
            await ais.log.create({ data: { action: `STUDENT_ACCOUNT_STAGED`, user: req?.userId, meta: ssoData } })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json(error)
      }
   }



   async resetStudent(req: Request & any, res: Response) {
      try {
         const { studentId } = req.body;
         const password = pwdgen();
         const resp = await ais.user.updateMany({
            where: { tag: studentId },
            // data: { password: sha1(password), unlockPin: password },
            data: { password: sha1(password) },
            include: true
         })
         if (resp?.count) {
            // Send Password By SMS
            const st = await ais.student.findFirst({ where: { id: studentId } });
            if (st?.phone) await sms(st?.phone, `Hi! Your new credentials is username: ${st?.instituteEmail ?? studentId}, password: ${password}`)
            // Log Login Response
            await ais.log.create({ data: { action: `STUDENT_ACCOUNT_RESET`, user: req?.userId, meta: { password: sha1(password) } } })
            // Return Password
            res.status(200).json({ password })
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json(error)
      }
   }

   async changePhoto(req: Request, res: Response) {
      try {
         const { studentId } = req.body
         const password = pwdgen();
         const resp = await ais.user.updateMany({
            where: { tag: studentId },
            data: { password: sha1(password) },
         })
         if (resp) {
            res.status(200).json({ password })
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json(error)
      }
   }

   async generateIndex(req: Request & any, res: Response) {
      try {
         const { studentId } = req.body;
         let indexno;
         const student = await ais.student.findUnique({
            where: { id: studentId },
            include: { program: { select: { prefix: true } } },
         })
         if (student?.indexno) throw ("Index number exists for student!")
         // const students = await ais.$queryRaw`select * from ais_student where date_format(entryDate,'%m%y') = ${moment(student?.entryDate).format("MMYYYY")} and programId = ${student?.programId}`;
         const students = await ais.$queryRaw`select * from ais_student where date_format(entryDate,'%m%y') = ${moment(student?.entryDate).format("MMYY")} and programId = ${student?.programId} and indexno is not null and (semesterNum = entrySemesterNum)`;
         // console.log("index student: ", students,moment(student?.entryDate).format("MMYY"));
         // AUCC INDEX NUMBER GENERATION
         let studentCount = students?.length + 1;
         let loop = true;
         while (loop) {
            // Compute Index Number
            const count = studentCount.toString().length == 1 ? `000${studentCount}` : studentCount.toString().length == 2 ? `00${studentCount}` : studentCount.toString().length == 3 ? `0${studentCount}` : studentCount;
            indexno = `${student?.program?.prefix}${moment(student?.entryDate || new Date()).format("MMYY")}${count}`
            // console.log(student?.program?.prefix, moment(student?.entryDate || new Date()).format("MMYY"), studentCount, indexno)
            // Check If Index Number Exists
            const ck = await ais.student.findFirst({ where: { indexno } });
            if (ck) {
               studentCount = studentCount + 1;
            } else {
               loop = false;
            }
         }

         // MLK INDEX NUMBER GENERATION
         // const count = student?.progCount?.toString().length == 1 ? `00${student?.progCount}`  : student?.progCount?.toString().length == 2 ? `0${student?.progCount}` : student?.progCount;
         // indexno = `${student?.program?.prefix}/${moment(student?.entryDate || new Date()).format("YY")}/${count}`

         const resp = await ais.student.update({
            where: { id: studentId },
            data: { indexno },
         })
         if (resp) {
            // Send Notfication
            const msg = `Hi ${student.fname}! Your AUCB Index number has been generated: ${indexno}, Thank you!`;
            await sms(student?.phone, msg);
            // Log Login Response
            await ais.log.create({ data: { action: `INDEX_NUMBER_GENERATED`, user: req?.userId, meta: { indexno } } })
            // Return Password
            res.status(200).json({ indexno })
         } else {
            res.status(202).json({ message: `no records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json(error)
      }
   }

   async generateEmail(req: Request & any, res: Response) {
      try {
         let count = 1;
         let isNew = true;
         const { studentId } = req.body;
         const st = await ais.student.findFirst({ where: { id: studentId } });
         if (st?.instituteEmail) {
            await ais.user.updateMany({ where: { tag: studentId }, data: { username: st?.instituteEmail } });
            throw ("mail already exists !");
         }
         let username = `${st?.fname?.replaceAll(' ', '')}.${st?.lname}`.toLowerCase();

         while (isNew) {
            const ck = await ais.student.findFirst({ where: { instituteEmail: { startsWith: `${username}${count > 1 ? count : ''}` } } });
            if (ck) count = count + 1;
            else isNew = false;
         }
         // Update Student Email
         const instituteEmail = `${username}@${process.env.UMS_MAIL}`;
         const resp = await ais.student.update({ where: { id: studentId }, data: { instituteEmail } });
         if (resp) {
            // Update SSO User
            await ais.user.updateMany({ where: { tag: studentId }, data: { username: instituteEmail } });
            // Log Login Response
            await ais.log.create({ data: { action: `STUDENT_EMAIL_GENERATED`, user: req?.userId, meta: { instituteEmail } } })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json(error)
      }
   }




   async postStudent(req: Request & any, res: Response) {
      try {
         const { titleId, programId, countryId, regionId, religionId, disabilityId, majorId } = req.body
         delete req.body.titleId; delete req.body.programId;
         delete req.body.countryId; delete req.body.regionId;
         delete req.body.religionId; delete req.body.disabilityId;
         delete req.body.majorId;
         //if (req.body.entryDate) req.body.entryDate = moment(req.body.entryDate).toDate;
         req.body.indexno = !req.body.indexno ? null : req.body.indexno;
         req.body.completeType = !req.body.completeType ? null : req.body.completeType;

         //req.body.entryDate  = !req.body.entryDate ? null : moment(req.body.entryDate).toDate();
         if (req.body.entryDate) req.body.entryDate = new Date(req.body.entryDate);
         if (req.body.dob) req.body.dob = new Date(req.body.dob);

         const resp = await ais.student.create({
            data: {
               ...req.body,
               ...programId && ({ program: { connect: { id: programId } } }),
               ...titleId && ({ title: { connect: { id: titleId } } }),
               ...countryId && ({ country: { connect: { id: countryId } } }),
               ...regionId && ({ region: { connect: { id: regionId } } }),
               ...religionId && ({ religion: { connect: { id: religionId } } }),
               ...disabilityId && ({ disability: { connect: { id: disabilityId } } }),
               ...majorId && majorId == 'NONE' && ({ major: { disconnect: true } }),
               ...majorId && majorId != 'NONE' && ({ major: { connect: { id: majorId } } }),
            }
         })
         if (resp) {
            // Log Login Response
            await ais.log.create({
               data: {
                  action: `STUDENT_CREATED`, user: req?.userId, meta: {
                     ...req.body,
                     ...programId && ({ program: { connect: { id: programId } } }),
                     ...titleId && ({ title: { connect: { id: titleId } } }),
                     ...countryId && ({ country: { connect: { id: countryId } } }),
                     ...regionId && ({ region: { connect: { id: regionId } } }),
                     ...religionId && ({ religion: { connect: { id: religionId } } }),
                     ...disabilityId && ({ disability: { connect: { id: disabilityId } } }),
                     ...majorId && majorId == 'NONE' && ({ major: { disconnect: true } }),
                     ...majorId && majorId != 'NONE' && ({ major: { connect: { id: majorId } } }),
                  }
               }
            })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateStudent(req: Request & any, res: Response) {
      try {
         const { titleId, programId, countryId, regionId, religionId, disabilityId, majorId, instituteEmail, indexno } = req.body
         delete req.body.titleId; delete req.body.programId;
         delete req.body.countryId; delete req.body.regionId;
         delete req.body.religionId; delete req.body.disabilityId;
         delete req.body.majorId; 
         // delete req.body.dob;
         // delete req.body.indexno;
         req.body.completeType = !req.body.completeType ? null : req.body.completeType;
         if (indexno != undefined) req.body.indexno = !req.body.indexno ? null : req.body.indexno;
         if (req.body.entryDate) req.body.entryDate = new Date(req.body.entryDate);
         if (req.body.dob) req.body.dob = new Date(req.body.dob);
         const resp = await ais.student.update({
            where: { id: paramStr(req.params.id) },
            data: {
               ...req.body,
               //...indexno && ({ indexno }),
               ...programId && ({ program: { connect: { id: programId } } }),
               ...titleId && ({ title: { connect: { id: titleId } } }),
               ...countryId && ({ country: { connect: { id: countryId } } }),
               ...regionId && ({ region: { connect: { id: regionId } } }),
               ...religionId && ({ religion: { connect: { id: religionId } } }),
               ...disabilityId && ({ disability: { connect: { id: disabilityId } } }),
               ...majorId && majorId == 'NONE' && ({ major: { disconnect: true } }),
               ...majorId && majorId != 'NONE' && ({ major: { connect: { id: majorId } } }),
            }
         })
         if (resp) {
            // Update Email as tag in sso_user
            if (instituteEmail) await ais.user.updateMany({ where: { tag: paramStr(req.params.id) }, data: { username: instituteEmail } });
            // Log Login Response
            await ais.log.create({
               data: {
                  action: `STUDENT_UPDATED`, user: req?.userId, meta: {
                     ...req.body,
                     ...programId && ({ program: { connect: { id: programId } } }),
                     ...titleId && ({ title: { connect: { id: titleId } } }),
                     ...countryId && ({ country: { connect: { id: countryId } } }),
                     ...regionId && ({ region: { connect: { id: regionId } } }),
                     ...religionId && ({ religion: { connect: { id: religionId } } }),
                     ...disabilityId && ({ disability: { connect: { id: disabilityId } } }),
                     ...majorId && majorId == 'NONE' && ({ major: { disconnect: true } }),
                     ...majorId && majorId != 'NONE' && ({ major: { connect: { id: majorId } } }),
                  }
               }
            })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteStudent(req: Request & any, res: Response) {
      try {
         const resp = await ais.student.delete({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            // Log Response
            await ais.log.create({ data: { action: `STUDENT_DELETED`, user: req?.userId, meta: resp } })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async publishStudentTranscript(req: Request & any, res: Response) {
      try {console.log(req.body.assessmentId)
         const resp = await ais.$executeRaw`update ais_assessment set status = 1 where id = ${paramStr(req.body.assessmentId)} and totalScore is not null`;
         if (resp) {
            // Log Response
            await ais.log.create({ data: { action: `ASSESSMENT_PUBLISHED`, user: req?.userId, meta: resp } })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   async deleteStudentTranscript(req: Request & any, res: Response) {
      try {
         const resp = await ais.assessment.delete({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            // Log Response
            await ais.log.create({ data: { action: `ASSESSMENT_DELETED`, user: req?.userId, meta: resp } })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   /* Courses */
   async fetchCourseList(req: Request, res: Response) {
      try {
         const resp = await ais.course.findMany({ where: { status: true }, orderBy: { title: 'asc' } })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchCourses(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { title: { contains: keyword } },
                  { id: { contains: keyword } },
               ],
            }
         }
         const resp = await ais.$transaction([
            ais.course.count({
               ...(searchCondition),
            }),
            ais.course.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
            })
         ]);

         //if(resp && resp[1]?.length){
         res.status(200).json({
            totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
            totalData: resp[1]?.length,
            data: resp[1],
         })
         //} else {
         //res.status(202).json({ message: `no records found` })
         //}
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchCourse(req: Request, res: Response) {
      try {
         const resp = await ais.course.findUnique({
            where: {
               id: paramStr(req.params.id)
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postCourse(req: Request & any, res: Response) {
      try {

         const resp = await ais.course.create({
            data: {
               ...req.body,
            },
         })
         if (resp) {
            // Log Login Response
            await ais.log.create({ data: { action: `COURSE_CREATED`, user: req?.userId, meta: req.body } })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateCourse(req: Request & any, res: Response) {
      try {
         const resp = await ais.course.update({
            where: {
               id: paramStr(req.params.id)
            },
            data: {
               ...req.body,
            }
         })
         if (resp) {
            // Log Login Response
            await ais.log.create({ data: { action: `COURSE_UPDATED`, user: req?.userId, meta: req.body } })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteCourse(req: Request & any, res: Response) {
      try {
         const resp = await ais.course.delete({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            // Log Login Response
            await ais.log.create({ data: { action: `COURSE_DELETED`, user: req?.userId, meta: resp } })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   /* Structure & Curriculum */
   async fetchCurriculums(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { courseId: { contains: keyword } },
                  { unit: { title: { contains: keyword } } },
                  { program: { longName: { contains: keyword } } },
                  { course: { title: { contains: keyword } } },
               ],
            }
         }
         const resp = await ais.$transaction([
            ais.structure.count({
               ...(searchCondition),
            }),
            ais.structure.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
               include: {
                  unit: { select: { title: true } },
                  program: { select: { longName: true } },
                  course: { select: { title: true } },
               }
            })
         ]);

         //if(resp && resp[1]?.length){
         res.status(200).json({
            totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
            totalData: resp[1]?.length,
            data: resp[1],
         })
         // } else {
         //   res.status(202).json({ message: `no records found` })
         // }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchCurriculumList(req: Request, res: Response) {
      try {
         const resp = await ais.structure.findMany({
            where: { status: true },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchCurriculum(req: Request, res: Response) {
      try {
         const resp = await ais.structure.findUnique({
            where: {
               id: paramStr(req.params.id)
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postCurriculum(req: Request, res: Response) {
      try {
         const { unitId, programId, courseId, majorId } = req.body
         delete req.body.courseId; delete req.body.programId;
         delete req.body.unitId; delete req.body.majorId;
         const resp = await ais.structure.create({
            data: {
               ...req.body,
               ...programId && ({ program: { connect: { id: programId } } }),
               ...courseId && ({ course: { connect: { id: courseId } } }),
               ...unitId && ({ unit: { connect: { id: unitId } } }),
               ...majorId && ({ major: { connect: { id: majorId } } }),
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateCurriculum(req: Request, res: Response) {
      try {
         const { unitId, programId, courseId, majorId } = req.body
         delete req.body.courseId; delete req.body.programId;
         delete req.body.unitId; delete req.body.majorId;
         const resp = await ais.structure.update({
            where: { id: paramStr(req.params.id) },
            data: {
               ...req.body,
               ...programId && ({ program: { connect: { id: programId } } }),
               ...courseId && ({ course: { connect: { id: courseId } } }),
               ...unitId && ({ unit: { connect: { id: unitId } } }),
               ...majorId && ({ major: { connect: { id: majorId } } }),
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteCurriculum(req: Request, res: Response) {
      try {
         const resp = await ais.structure.delete({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   /* Schemes */
   async fetchSchemes(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { title: { contains: keyword } },
               ],
            }
         }
         const resp = await ais.$transaction([
            ais.scheme.count({
               ...(searchCondition),
            }),
            ais.scheme.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
               include: {
                  _count: {
                     select: { program: true }
                  }
               }
            })
         ]);

         //if(resp && resp[1]?.length){
         res.status(200).json({
            totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
            totalData: resp[1]?.length,
            data: resp[1],
         })
         //} else {
         //res.status(202).json({ message: `no records found` })
         //}
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchSchemeList(req: Request, res: Response) {
      try {
         const resp = await ais.scheme.findMany({
            where: { status: true },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchScheme(req: Request, res: Response) {
      try {
         const resp = await ais.scheme.findUnique({
            where: {
               id: paramStr(req.params.id)
            },
            include: { program: true }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postScheme(req: Request, res: Response) {
      try {
         console.log(req.body);
         const resp = await ais.scheme.create({
            data: {
               ...req.body,
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateScheme(req: Request, res: Response) {
      try {
         console.log(req.body);
         const resp = await ais.scheme.update({
            where: {
               id: paramStr(req.params.id)
            },
            data: {
               ...req.body,
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteScheme(req: Request, res: Response) {
      try {
         const resp = await ais.scheme.delete({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   /* Registrations */
   async fetchRegistrationList(req: Request, res: Response) {
      try {
         const resp = await ais.activityRegister.findMany({
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
         })

         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchRegistrations(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
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
         }
         const resp = await ais.$transaction([
            ais.activityRegister.count({
               ...(searchCondition),
            }),
            ais.activityRegister.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
               orderBy: { createdAt: 'desc' },
               include: {
                  student: {
                     select: {
                        fname: true, mname: true, lname: true, indexno: true,
                        semesterNum: true, id: true, gender: true,
                        program: { select: { longName: true } },
                     }
                  },
                  session: { select: { title: true, tag: true } },
               }
            })
         ]);

         //if(resp && resp[1]?.length){
         res.status(200).json({
            totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
            totalData: resp[1]?.length,
            data: resp[1],
         })
         // } else {
         //    res.status(202).json({ message: `no records found` })
         // }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchRegistration(req: Request, res: Response) {
      try {
         let resp = [];
         const st = await ais.student.findUnique({
            where: { id: paramStr(req.params.indexno) },
            select: { id: true, indexno: true, fname: true, mname: true, lname: true, gender: true, semesterNum: true, program: { select: { longName: true, department: true } } },
         })
         if (st) {
            // Get Active Sessions Info
            const sessions: any = await ais.session.findMany({ where: { default: true } })
            const session: any = sessions.find((row: any) => (moment(st?.entryDate).format("MM") == '01' && st?.semesterNum <= 2) ? row?.tag?.toUpperCase() == 'SUB' : row?.tag?.toUpperCase() == 'MAIN')
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
            resp = await ais.assessment.findMany({
               include: {
                  course: { select: { title: true, creditHour: true } },
                  session: { select: { title: true } },
               },
               where: {
                  indexno: st?.indexno,
                  sessionId: session?.id
               },
            });
         }

         // Resit Courses
         const resits = await ais.resit.findMany({
            where: {
               indexno: paramStr(req.params.indexno),
               registerSession: { default: true }
            },
            select: {
               course: { select: { title: true, creditHour: true } },
               registerSession: { select: { title: true } },
               courseId: true
            }
         })

         if (resits.length) {
            for (let rs of resits)
               resp.push({ course: rs.course, session: rs.registerSession, courseId: rs.courseId, type: 'R' })
         }

         if (resp) {
            // Add Student Bio
            resp = resp.map((r: any) => ({ ...r, student: st }));
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchRegistrationMount(req: Request, res: Response) {
      try {
         const courses: any = [];
         const id = paramStr(req.params.indexno);
         // Get Student Info
         const student: any = await ais.student.findUnique({ include: { program: { select: { schemeId: true, hasMajor: true } } }, where: { id } })
         const indexno = student?.indexno;
         // Get Active Sessions Info
         const sessions: any = await ais.session.findMany({ where: { default: true } })
         // console.log("sessions: ", sessions);

         // Get Session, for AUCC Only
         // const session: any = sessions.find((row: any) => (moment(student?.entryDate).format("MM") == '01' && student?.semesterNum <= 2) ? row?.tag?.toUpperCase() == 'SUB' : row?.tag?.toUpperCase() == 'MAIN');
         // NB: Entry Year 1 for January Stream joins September Stream in Year 2 and Entry Year 2 for January Stream joins September Stream in Year 3
         const session: any = sessions.find((row: any) => {
            const streamTag = (moment(student?.entryDate).format("MM") == '01' && ((student?.entrySemesterNum == 1 && ['1', '2'].includes(student?.semesterNum)) || (student?.entrySemesterNum == 3 && ['3', '4'].includes(student?.semesterNum)))) ? 'SUB' : 'MAIN';
            return row?.tag?.toUpperCase() == streamTag;
         });
         // Get Session, for MLK Only
         // const session:any = sessions[0];

         // console.log("Session: ", session?.tag);
         // console.log("Registration Stream: ", moment(student?.entryDate).format("MM"));
         // console.log("Registration Stream: ", ['01','09'].includes(moment(student?.entryDate).format("MM") ? 'Stream Passed':'Issue with Stream / Entry Month'));
         // console.log("Registration SemesterNum: ", student?.semesterNum);

         // Get Normal Courses with/without Majors
         const maincourses = await ais.structure.findMany({
            include: { course: { select: { title: true, creditHour: true } }, major: { select: { shortName: true } } },
            where: {
               semesterNum: student?.semesterNum,
               programId: student?.programId,
            },
            orderBy: { type: 'asc' }
         })
         // Meta & Instructions
         const meta = await ais.structmeta.findFirst({
            where: { programId: student?.programId, majorId: student?.majorId, semesterNum: student?.semesterNum },
         })

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
               const isAdded = courses.find((c: any) => c.code == course.courseId);
               if (!isAdded)
                  courses.push({
                     code: course.courseId,
                     course: course?.course?.title,
                     credit: course?.course?.creditHour,
                     type: course?.type,
                     lock: course?.lock,
                     sessionId: session?.id,
                     schemeId: student?.program?.schemeId,
                     semesterNum: student?.semesterNum,
                     indexno,
                     ...course.majorId && ({ major: course?.major?.shortName })
                  })
            }
         }
         // Get Resit Courses
         const resitcourses: any = await ais.resit.findMany({
            include: { course: { select: { title: true, creditHour: true } } },
            where: {
               indexno, taken: false, trailSession: { semester: session?.semesterNum },
            }
         })
         if (student && resitcourses.length) {
            for (const course of resitcourses) {
               const isAdded = courses.find((c: any) => c.code == course.courseId);
               if (!isAdded)
                  courses.push({
                     code: course.courseId,
                     course: course?.course?.title,
                     credit: course?.course?.creditHour,
                     type: 'R',
                     lock: false,
                     sessionId: session.id,
                     schemeId: student?.program?.schemeId,
                     semesterNum: student.semesterNum,
                     indexno,
                     ...course.majorId && ({ major: course?.major?.shortName })
                  })
            }
         }

         // Conditions
         let condition = true; // Allow Registration
         let message;          // Reason attached
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
         if (!student?.indexno) { condition = false; message = "No Index Number for Student!" }
         // If Semester Level or Program ID or (Major  ID for Year 3,4) is not Updated, Block Registration - Before
         if (!student?.programId || (student.program.hasMajor && student.semesterNum > 4 && !student.majorId) || !student?.semesterNum) { condition = false; message = "No Major or Program or Level Set!" }

         // If Student is Owing Fees, Lock Registration - Before
         // if(student?.accountNet > 0 && student?.accountNet < (Bill amount * Payment Percentage )) { condition = false; message = "No Index Number for Student!" }

         // If Student is Pardoned by Finance, Allow Registration - Before
         // If Registration Period is Inactive - Before
         // If Registration Period is Active and Halt status is ON - Before
         // If Registration Period is Extended for Late Finers - Before


         if (courses?.length) {
            res.status(200).json({ session: session?.title, courses, meta, condition, message, registerStart: session?.registerStart, registerEnd: session?.registerEnd, registerEndLate: session?.registerEndLate })
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(202).json({ message: error.message })
      }
   }

   async postRegistration(req: Request, res: Response) {
      try {
         const courses = req.body;
         const data: any = [], rdata: any = [];
         // Get Active Sessions Info
         const st: any = await ais.student.findFirst({ include: { program: { select: { schemeId: true, hasMajor: true } } }, where: { indexno: courses[0].indexno } })
         const sessions: any = await ais.session.findMany({ where: { default: true } })
         const session: any = sessions.find((row: any) => (moment(st?.entryDate).format("MM") == '01' && st?.semesterNum <= 2) ? row?.tag?.toUpperCase() == 'SUB' : row?.tag?.toUpperCase() == 'MAIN')
         // Check If Registration Data exists
         const slip = await ais.assessment.findFirst({ where: { indexno: courses[0].indexno, sessionId: session.id } });
         if (slip) throw ("Registration already submitted!")

         const resitcourses = courses.filter((row: any) => row.type == 'R')
         const maincourses = courses.filter((row: any) => row.type != 'R')
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
               })
            }
         }
         if (resitcourses?.length) {
            // Resit Session Info
            const rsession: any = await ais.resitSession.findFirst({ where: { default: true } })
            // Save Resit Registration
            for (const course of resitcourses) {
               const ups = await ais.resit.updateMany({
                  where: {
                     indexno: course?.indexno,
                     courseId: course?.code,
                     taken: false,
                     paid: true
                  },
                  data: {
                     resitSessionId: rsession.id,
                     registerSessionId: course?.sessionId

                     //registerSession: { connect: { id: course?.sessionId }},
                     //... rsession && ({ session: { connect: { id:rsession?.id }} }),
                     //taken: true  - Only when Resit Exam is taken
                  }
               })
               if (ups) rdata.push(ups);
            }
         }
         // Log Registration
         const isLogged = await ais.activityRegister.findFirst({
            where: {
               indexno: maincourses[0].indexno,
               sessionId: maincourses[0].sessionId
            }
         })
         if (!isLogged)
            await ais.activityRegister.createMany({
               data: [{
                  indexno: maincourses[0].indexno,
                  sessionId: maincourses[0].sessionId,
                  courses: courses?.length,
                  credits: courses?.reduce((sum: number, cur: any) => sum + cur.credit, 0),
                  semesterNum: maincourses[0].semesterNum,
                  dump: courses
               }]
            })
         else
            await ais.activityRegister.update({
               where: { id: isLogged?.id },
               data: {
                  indexno: maincourses[0].indexno,
                  sessionId: maincourses[0].sessionId,
                  courses: courses?.length,
                  credits: courses?.reduce((sum: number, cur: any) => sum + cur.credit, 0),
                  semesterNum: maincourses[0].semesterNum,
                  dump: courses
               }
            })

         // Save Registration Courses
         const mainresp = await ais.assessment.createMany({ data })
         if (mainresp) {
            res.status(200).json({ courses: mainresp, resits: rdata, totalCourses: courses.length })
         } else {
            res.status(200).json({ message: `No selected courses found!` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(200).json({ message: error })
      }
   }


   async updateRegistration(req: Request, res: Response) {
      try {
         const indexno = paramStr(req.params.indexno);
         const courses = req.body;
         const data: any = [], rdata: any = [];
         const resitcourses = courses.filter((row: any) => row.type == 'R')
         const maincourses = courses.filter((row: any) => row.type != 'R')
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
               })
            }
         }

         if (resitcourses.length) {
            for (const course of resitcourses) {
               const ups = await ais.resit.updateMany({
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
               })
               if (ups) rdata.push(ups);
            }
         }
         const mainresp = await ais.assessment.createMany({ data })
         if (mainresp) {
            res.status(200).json({ courses: mainresp, resits: rdata })
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteRegistration(req: Request, res: Response) {
      try {
         // const { data } =  req.body;
         // if(data?.length){

         // }
         // Delete Courses Registration
         const resp = await ais.assessment.deleteMany({
            where: {
               indexno: paramStr(req.params.indexno),
               session: { default: true }
            }
         })
         // Delete Registration Log
         const log = await ais.activityRegister.deleteMany({
            where: {
               indexno: paramStr(req.params.indexno),
               session: { default: true }
            }
         })
         // Reset Resit Registration
         const resit = await ais.resit.updateMany({
            where: {
               indexno: paramStr(req.params.indexno),
               registerSession: { default: true }
            },
            data: {
               taken: false,
               resitSessionId: null,
               registerSessionId: null,
            }
         })

         if (resp?.count) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `Registration not deleted` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   /* programs */
   async fetchProgramList(req: Request, res: Response) {
      try {
         const resp = await ais.program.findMany({
            where: { status: true },
            include: {
               department: { select: { title: true } },
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchPrograms(req: Request, res: Response) {
      const { page = 1, pageSize = 6, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { code: { contains: keyword } },
                  { shortName: { contains: keyword } },
                  { longName: { contains: keyword } },
                  { prefix: { contains: keyword } },
               ],
            }
         }
         const resp = await ais.$transaction([
            ais.program.count({
               ...(searchCondition),
            }),
            ais.program.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
               include: {
                  department: { select: { title: true } },
                  student: { select: { _count: true } }
               }
            })
         ]);

         //if(resp && resp[1]?.length){
         res.status(200).json({
            totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
            totalData: resp[1]?.length,
            data: resp[1],
         })
         //} else {
         //res.status(202).json({ message: `no records found` })
         //}
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchProgram(req: Request, res: Response) {
      try {
         const resp = await ais.program.findUnique({
            where: {
               id: paramStr(req.params.id)
            },
            include: {
               department: { select: { title: true } },
               student: { select: { _count: true } }
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchProgramStructure(req: Request, res: Response) {
      try {
         const resp = await ais.program.findUnique({
            where: { id: paramStr(req.params.id) },
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
         })

         if (resp?.structure?.length) {
            var mdata: any = new Map(), sdata: any = new Map();
            for (const sv of resp?.structure) {
               const index: string = `LEVEL ${Math.ceil(sv.semesterNum / 2) * 100}, ${sv.semesterNum % 2 == 0 ? 'SEMESTER 2' : 'SEMESTER 1'}` || 'none';
               const zd = { ...sv, course: sv?.course?.title, code: sv?.course?.id, credit: sv?.course?.creditHour, practical: sv?.course?.practicalHour, theory: sv?.course?.theoryHour, type: sv?.type }
               // Data By Level - Semester
               if (mdata.has(index)) {
                  mdata.set(index, [...mdata.get(index), { ...zd }])
               } else {
                  mdata.set(index, [{ ...zd }])
               }
            }

            for (const sv of resp?.structmeta) {
               const index: string = `LEVEL ${Math.ceil(sv.semesterNum / 2) * 100}, ${sv.semesterNum % 2 == 0 ? 'SEMESTER 2' : 'SEMESTER 1'}` || 'none';
               const zd = { ...sv }
               // Data By Level - Semester
               if (sdata.has(index)) {
                  sdata.set(index, [...sdata.get(index), { ...zd }])
               } else {
                  sdata.set(index, [{ ...zd }])
               }
            }
            console.log(Object.fromEntries(sdata))
            res.status(200).json({ data: Array.from(mdata), meta: Object.fromEntries(sdata) })
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchProgramStudents(req: Request, res: Response) {
      try {
         const resp = await ais.program.findUnique({
            where: { id: paramStr(req.params.id) },
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
         })
         if (resp?.student?.length) {
            var mdata: any = new Map();
            for (const sv of resp?.student) {
               const index: string = `LEVEL ${Math.ceil(sv.semesterNum / 2) * 100}` || 'none';
               const zd = { ...sv }
               // Data By Level - Semester
               if (mdata.has(index)) {
                  mdata.set(index, [...mdata.get(index), { ...zd }])
               } else {
                  mdata.set(index, [{ ...zd }])
               }
            }
            res.status(200).json(Array.from(mdata))
         } else {
            res.status(200).json([])
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchProgramStatistics(req: Request, res: Response) {
      try {
         const resp = await ais.program.findUnique({
            where: {
               id: paramStr(req.params.id)
            },
            include: {
               department: { select: { title: true } },
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postProgram(req: Request, res: Response) {
      try {
         const { unitId, schemeId } = req.body
         delete req.body.schemeId; delete req.body.unitId;

         const resp = await ais.program.create({
            data: {
               ...req.body,
               ...unitId && ({ department: { connect: { id: unitId } } }),
               ...schemeId && ({ scheme: { connect: { id: schemeId } } }),
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateProgram(req: Request, res: Response) {
      try {
         const { unitId, schemeId } = req.body
         delete req.body.schemeId; delete req.body.unitId;
         const resp = await ais.program.update({
            where: { id: paramStr(req.params.id) },
            data: {
               ...req.body,
               ...unitId && ({ department: { connect: { id: unitId } } }),
               ...schemeId && ({ scheme: { connect: { id: schemeId } } }),
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteProgram(req: Request, res: Response) {
      try {
         const resp = await ais.program.delete({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   /* Majors */
   async fetchMajorList(req: Request, res: Response) {
      try {
         const resp = await ais.major.findMany({
            where: { status: true },
            include: {
               program: { select: { shortName: true } },
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }




   /* Departments */
   async fetchDepartments(req: Request, res: Response) {
      try {
         const resp = await ais.unit.findMany({
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
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   /* Faculties */
   async fetchFaculties(req: Request, res: Response) {
      try {
         const resp = await ais.unit.findMany({
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
            orderBy: {

            }
         })

         console.log("Faculties: ", resp)

         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   /* Units */
   async fetchUnits(req: Request, res: Response) {
      const { page = 1, pageSize = 6, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { title: { contains: keyword } },
                  { code: { contains: keyword } },
                  { headStaffNo: { contains: keyword } },
               ],
            },
            //include: { level1: true },
            //   orderBy: { createdAt: 'asc'}
         }
         const resp = await ais.$transaction([
            ais.unit.count({
               ...(searchCondition),
            }),
            ais.unit.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
            })
         ]);

         if (resp && resp[1]?.length) {
            res.status(200).json({
               totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
               totalData: resp[1]?.length,
               data: resp[1],
            })
         } else {
            res.status(202).json({ message: `no records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchUnitList(req: Request, res: Response) {
      try {
         const resp = await ais.unit.findMany({
            where: { status: true },
            include: { level1: true },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchUnit(req: Request, res: Response) {
      try {
         const resp = await ais.unit.findUnique({
            where: {
               id: paramStr(req.params.id)
            },
            include: { level1: true },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postUnit(req: Request, res: Response) {
      try {
         const { level1Id } = req.body
         delete req.body.level1Id;
         const resp = await ais.unit.create({
            data: {
               ...req.body,
               ...level1Id && ({ level1: { connect: { id: level1Id } } }),
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateUnit(req: Request, res: Response) {
      try {
         const { level1Id, headStaffNo: newHead } = req.body
         delete req.body.level1Id;
         const unit = await ais.unit.findFirst({ where: { id: paramStr(req.params.id) } });
         const resp = await ais.unit.update({
            where: { id: paramStr(req.params.id) },
            data: {
               ...req.body,
               ...level1Id && ({ level1: { connect: { id: level1Id } } }),
               ...!level1Id && ({ level1: { disconnect: true } }),
            }
         })
         if (resp) {

            // Stage Head or Dean of Unit

            if (['ACADEMIC'].includes(unit?.type) && newHead && newHead != unit.headStaffNo) {
               //###### NEW HEAD/DEAN ####//
               // Update Role of New Head or Dean
               let userId;
               const nrole = await ais.userRole.findFirst({
                  where: {
                     user: { tag: newHead },
                     appRole: { id: { in: [1, 2, 3, 4, 5, 6, 13, 14, 15, 16] } }
                  }
               })
               if (nrole) {
                  userId = nrole.userId;
                  // Remove AIS Roles
                  await ais.userRole.deleteMany({
                     where: {
                        user: { tag: newHead },
                        appRole: { id: { in: [1, 2, 3, 4, 5, 6, 13, 14, 15, 16] } }
                     }
                  })

               } else {
                  const user = await ais.user.findFirst({ where: { tag: newHead } })
                  if (user) userId = user.id;

               }

               if (unit?.levelNum == 1) {
                  await ais.userRole.create({
                     data: {
                        userId,
                        appRoleId: 4,
                        roleMeta: unit?.id
                     }
                  })

               } else {
                  await ais.userRole.create({
                     data: {
                        userId,
                        appRoleId: 3,
                        roleMeta: unit?.id
                     }
                  })
               }

               // ###### OLD HEAD/DEAN ###### //
               if (unit?.headStaffNo) {
                  const orole = await ais.userRole.findFirst({
                     where: {
                        user: { tag: unit?.headStaffNo },
                        appRole: { id: { in: [1, 2, 3, 4, 5, 6, 13, 14, 15, 16] } }
                     }
                  })

                  if (orole) {
                     // Remove AIS Roles
                     await ais.userRole.deleteMany({
                        where: {
                           user: { tag: unit?.headStaffNo },
                           appRole: { id: { in: [1, 2, 3, 4, 5, 6, 13, 14, 15, 16] } }
                        }
                     })
                     // Create Assessor Role
                     await ais.userRole.create({
                        data: {
                           userId: orole?.userId,
                           appRoleId: 1,
                           roleMeta: null
                        }
                     })
                  }
               }
            }
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteUnit(req: Request, res: Response) {
      try {
         const resp = await ais.unit.delete({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   /* Jobs */
   async fetchJobs(req: Request, res: Response) {
      const { page = 1, pageSize = 6, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { title: { contains: keyword } },
                  { id: { contains: keyword } },
               ],
            },
            include: {
               level1: { select: { title: true, code: true } }
            },

         }
         const resp = await ais.$transaction([
            ais.job.count({
               ...(searchCondition),
            }),
            ais.job.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
            })
         ]);

         if (resp && resp[1]?.length) {
            res.status(200).json({
               totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
               totalData: resp[1]?.length,
               data: resp[1],
            })
         } else {
            res.status(202).json({ message: `no records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchJobList(req: Request, res: Response) {
      try {
         const resp = await ais.job.findMany({
            where: { status: true }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchJob(req: Request, res: Response) {
      try {
         const resp = await ais.job.findUnique({
            where: {
               id: paramStr(req.params.id)
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postJob(req: Request, res: Response) {
      try {
         const resp = await ais.job.create({
            data: {
               ...req.body,
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateJob(req: Request, res: Response) {
      try {
         const resp = await ais.job.update({
            where: {
               id: paramStr(req.params.id)
            },
            data: {
               ...req.body,
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteJob(req: Request, res: Response) {
      try {
         const resp = await ais.job.delete({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   /* Progression */
   async fetchProgressions(req: Request, res: Response) {
      const { page = 1, pageSize = 6, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition: any = {
         where: { session: { default: true } }
      }
      try {
         if (keyword) searchCondition = {
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
         }
         const resp = await ais.$transaction([
            ais.activityProgress.count({
               ...(searchCondition),
            }),
            ais.activityProgress.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
               include: {
                  student: { include: { program: true } },
                  session: true
               },
            })
         ]);

         //if(resp && resp[1]?.length){
         res.status(200).json({
            totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
            totalData: resp[1]?.length,
            data: resp[1],
         })
         // } else {
         //    res.status(202).json({ message: `no records found` })
         // }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchProgression(req: Request, res: Response) {
      try {
         const resp = await ais.activityProgress.findUnique({
            where: { id: paramStr(req.params.id) },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postProgression(req: Request, res: Response) {
      try {
         const { indexno } = req.body;
         delete req.body.indexno;
         // Check If Student Exist with Index number
         const st = await ais.student.findFirst({ where: { indexno, deferStatus: false, completeStatus: false }, include: { program: { select: { semesterTotal: true } } } });
         if (!st) throw ("Student can't be progressed, check indexno,defer or complete status!");

         // Fetch Active Session for Student - AUCC Only
         const session = ((st.semesterNum <= 2 && st.entrySemesterNum == 1) || (st.semesterNum <= 4 && st.entrySemesterNum == 3)) && ['01', '1'].includes(moment(st.entryDate).format("MM"))
            ? await ais.session.findFirst({ where: { default: true, tag: 'SUB' } })
            : await ais.session.findFirst({ where: { default: true, tag: 'MAIN' } })

         // Fetch Active Session for Student - MLK & Others Only
         // const session = await ais.sesssion.findFirst({ where: { default: true }})

         // Check If Progressed
         const pg = await ais.activityProgress.findFirst({ where: { indexno, sessionId: session?.id } })
         if (pg) throw ("Student already progressed !");


         // Save Progression Data
         const resp = await ais.activityProgress.create({
            data: {
               semesterNum: (st.semesterNum + 1 > st.program?.semesterTotal ? 0 : st.semesterNum + 1),
               status: true,
               ...session && ({ session: { connect: { id: session?.id } } }),
               ...indexno && ({ student: { connect: { indexno } } }),
            }
         })
         if (resp) {
            // Update Student SemesterNum & CompleteStatus
            await ais.student.update({
               where: { id: st?.id },
               data: {
                  semesterNum: (st.semesterNum + 1 > st.program?.semesterTotal ? 0 : st.semesterNum + 1),
                  completeStatus: (st.semesterNum + 1 > st.program?.semesterTotal ? true : false
                  )
               }
            })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(202).json({ message: error.message })
      }
   }

   async postAllProgression(req: Request, res: Response) {
      try {
         const { sessionId } = req.body
         delete req.body.sessionId;
         // Fetch Active Session for Student
         const session = await ais.session.findFirst({ where: { id: sessionId } })
         // AUCC only
         const students = session.tag == 'SUB'
            ? await ais.$queryRaw`select s.id,indexno,semesterNum,p.semesterTotal from ais_student s left join ais_program p on s.programId = p.id where (((semesterNum <= 2 and entrySemesterNum = 1) or (semesterNum <= 4 and entrySemesterNum = 3)) and date_format(entryDate,'%m') = '01') and completeStatus = 0 and deferStatus = 0 and indexno is not NULL`
            : await ais.$queryRaw`select s.id,indexno,semesterNum,p.semesterTotal from ais_student s left join ais_program p on s.programId = p.id where ((((semesterNum > 2 and entrySemesterNum = 1) or (semesterNum > 4 and entrySemesterNum = 3)) and date_format(entryDate,'%m') = '01') or (date_format(entryDate,'%m') <> '01') or entryDate is null) and completeStatus = 0 and deferStatus = 0 and indexno is not NULL`;

         // MLK & Others only
         // const students = await ais.$queryRaw`select indexno,semesterNum from ais_student where completeStatus = 0 and deferStatus = 0 and indexno is not NULL`;

         const resp = await Promise.all(students.map(async (st: any) => {
            console.log("st: ", st)
            // Check If Progressed
            const pg = await ais.activityProgress.findFirst({ where: { indexno: st?.indexno, sessionId: session?.id } })
            if (pg) return null;

            // Update Student SemesterNum & CompleteStatus
            await ais.student.update({
               where: { id: st?.id },
               data: {
                  semesterNum: (st?.semesterNum + 1 > st?.semesterTotal ? 0 : Math.min(st?.semesterTotal, st?.semesterNum + 1)),
                  completeStatus: (st?.semesterNum + 1 > st?.semesterTotal ? true : false
                  )
               }
            })

            // Update Session Progression Status
            await ais.session.update({ where: { id: sessionId }, data: { progressStudent: true } })

            // Return Response
            return ais.activityProgress.create({
               data: {
                  student: { connect: { indexno: st.indexno } },
                  semesterNum: (st?.semesterNum + 1 > st?.semesterTotal ? 0 : Math.min(st?.semesterTotal, st?.semesterNum + 1)),
                  status: true,
                  ...session && ({ session: { connect: { id: session?.id } } }),
               }
            })
         }))

         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateProgression(req: Request, res: Response) {
      try {
         const resp = await ais.activityProgress.update({
            where: {
               id: paramStr(req.params.id)
            },
            data: {
               ...req.body,
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteProgression(req: Request, res: Response) {
      try {
         const resp = await ais.activityProgress.delete({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   /* Sheets */
   async fetchSheets(req: Request, res: Response) {
      const { page = 1, pageSize = 6, keyword = '', unit = '' }: any = req.query;
      console.log("unit:", unit)
      const offset = (page - 1) * pageSize;
      let searchCondition: any = unit
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
         }

      try {
         if (keyword && unit) searchCondition = {
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
         }
         else if (keyword) searchCondition = {
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
         }

         const resp = await ais.$transaction([
            ais.sheet.count({
               ...(searchCondition),
            }),
            ais.sheet.findMany({
               ...(searchCondition &&
                  ({
                     ...searchCondition,
                     include: {
                        session: true,
                        program: true,
                        course: true,
                        major: true,
                        assignee: true,
                     }
                  })),
               skip: offset,
               take: Number(pageSize),
               orderBy: [
                  { session: { createdAt: 'desc' } },
                  { semesterNum: 'asc' }
               ]
            })
         ]);

         //if(resp && resp[1]?.length){
         res.status(200).json({
            totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
            totalData: resp[1]?.length,
            data: resp[1],
         })
         // } else {
         //res.status(202).json({ message: `no records found` })
         //}
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchMySheets(req: any, res: Response) {
      const assignStaffId = req.userId;
      const { page = 1, pageSize = 6, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition: any = {
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
         if (keyword) searchCondition = {
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
         }

         const resp = await ais.$transaction([
            ais.sheet.count({
               ...(searchCondition),
            }),
            ais.sheet.findMany({
               ...(searchCondition &&
                  ({
                     ...searchCondition,
                     include: {
                        session: true,
                        program: true,
                        course: true,
                        major: true,
                        assignee: true,
                     }
                  })),
               skip: offset,
               take: Number(pageSize),
               // orderBy: [{ sessionId:'desc'},{ semesterNum:'asc'}]
               orderBy: [
                  { session: { createdAt: 'desc' } },
                  { semesterNum: 'asc' }
               ]
            })
         ]);

         //if(resp && resp[1]?.length){
         res.status(200).json({
            totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
            totalData: resp[1]?.length,
            data: resp[1],
         })
         // } else {
         //res.status(202).json({ message: `no records found` })
         //}
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async stageSheet(req: Request, res: Response) {
      try {
         // Fetch Active Semester
         const { sessionId } = req.body
         // Fetch Session Info
         const session = await ais.session.findFirst({ where: { id: sessionId, default: true } })
         if (session) {
            // Fetch Mounted Courses all Program Levels
            let mounts = await ais.structure.findMany({ where: { status: true }, include: { program: true } })
            mounts = mounts.filter((meta: any) => (meta?.semesterNum % 2) == (session?.semester == 'SEM2' ? 0 : 1))
            let data = [];
            for (let meta of mounts) {
               let modes: any;
               console.log("MODE: ", meta?.program?.category)
               switch (meta?.program?.category) {
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
                  data.push({ ...meta, studyMode: mode })
               }
            }

            //console.log(data);
            // Check whether Sheets are generated 
            const form = await ais.sheet.findFirst({ where: { sessionId, status: true } })
            if (form) {
               // Update Generated Flag
               await ais.session.update({ where: { id: sessionId }, data: { stageSheet: true } })
               // Return Response
               return res.status(202).json({ message: `sheets exists for calendar` });
            }

            // Upsert Bulk into Sheet 
            const resp: any = await Promise.all(data?.map(async (row: any) => {
               let { courseId, programId, unitId, majorId } = row;
               return await ais.sheet.create({
                  data: {
                     semesterNum: row.semesterNum,
                     studyMode: row.studyMode,
                     ...sessionId && ({ session: { connect: { id: sessionId } } }),
                     ...courseId && ({ course: { connect: { id: courseId } } }),
                     ...programId && ({ program: { connect: { id: programId } } }),
                     ...majorId && ({ major: { connect: { id: majorId } } }),
                     ...unitId && ({ unit: { connect: { id: unitId } } }),
                  }
               })
            }))
            if (resp) {
               // Update Stage Status in Calendar
               await ais.session.update({ where: { id: sessionId }, data: { stageSheet: true } })
               return res.status(200).json(resp)

            } else {
               return res.status(202).json({ message: `no record found` })
            }

         } else {
            return res.status(202).json({ message: `no record found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async cleanSheet(req: Request, res: Response) {
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
         const session = await ais.session.findFirst({ where: { id: sessionId } })
         if (session) {
            // Fetch Mounted Courses all Program Levels
            let mounts = await ais.structure.findMany({ where: { status: true }, include: { program: true } })
            mounts = mounts.filter((meta: any) => (meta?.semesterNum % 2) == (session?.semester == 'SEM2' ? 0 : 1))
            let data = [];
            for (let meta of mounts) {
               let modes: any;
               console.log("MODE: ", meta?.program?.category)
               switch (meta?.program?.category) {
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
                  data.push({ ...meta, studyMode: mode })
               }
            }

            // Upsert Bulk into Sheet 
            const resp: any = await Promise.all(data?.map(async (row: any) => {
               let { courseId, programId, unitId, majorId } = row;
               const sheetM = await ais.sheet.findFirst({ where: { semesterNum: row.semesterNum, sessionId, programId, courseId } });
               const sheet = await ais.sheet.findFirst({ where: { semesterNum: row.semesterNum, studyMode: row.studyMode, sessionId, programId, courseId } });
               await ais.$executeRaw`set foreign_key_checks=0`;
               if (sheet) {
                  return await ais.$executeRaw`UPDATE ais_sheet SET semesterNum = ${row.semesterNum}, studyMode = ${row.studyMode}, assignStaffId = ${sheetM?.assignStaffId || null}, sessionId = ${sessionId || null}, courseId = ${courseId || null}, programId = ${programId || null}, majorId = ${majorId || null}, unitId = ${unitId || null}, updatedAt = NOW() WHERE id = ${sheet.id}`;
               } else {
                  return await ais.$executeRaw`INSERT INTO ais_sheet (id,semesterNum,studyMode,assignStaffId,sessionId,courseId,programId,majorId,unitId,status,createdAt,updatedAt) VALUES (UUID(),${row.semesterNum}, ${row.studyMode}, ${sheetM?.assignStaffId || null}, ${sessionId || null}, ${courseId || null}, ${programId || null}, ${majorId || null}, ${unitId || null}, 1, NOW(),NOW())`;
               }
            }))
            if (resp) {
               // Clean Records without StudyModes
               await ais.$executeRaw`DELETE from ais_sheet where sessionId = ${sessionId} and studyMode is null`;

               return res.status(200).json(resp)
            } else {
               return res.status(202).json({ message: `no record found` })
            }
         } else {
            return res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async sanitizeSheet(req: Request, res: Response) {
      try {
         let newData = new Map();
         let sheetData = require(path.join(__dirname, '/../../util/sheetData.json'));
         // console.log(sheetData);
         for (let dt of sheetData) {
            if (newData.has(`${dt.semesterNum}${dt.studyMode}${dt.sessionId}${dt.courseId}${dt.programId}`)) {
               let dm = newData.get(`${dt.semesterNum}${dt.studyMode}${dt.sessionId}${dt.courseId}${dt.programId}`);
               if (dm) {
                  if (!dm.unitId && dt.unitId) dm.unitId = dt.unitId;
                  if (!dm.majorId && dt.majorId) dm.majorId = dt.majorId;
                  if (!dm.assignStaffId && dt.assignStaffId) dm.assignStaffId = dt.assignStaffId;
                  if (!dm.assessorId && dt.assessorId) dm.assessorId = dt.assessorId;
                  if (!dm.certifierId && dt.certifierId) dm.certifierId = dt.certifierId;
                  if (!dm.assessed && dt.assessed) dm.assessed = dt.assessed;
                  if (!dm.certified && dt.certified) dm.certified = dt.certified;
                  if (!dm.finalized && dt.finalized) dm.finalized = dt.finalized;
                  newData.set(`${dt.semesterNum}${dt.studyMode}${dt.sessionId}${dt.courseId}${dt.programId}`, dm);
               }
            } else {
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
         const filePath = path.join(__dirname, '/../../util/sheetData2.json');
         fs.writeFile(filePath, jsonData, (err) => {
            if (err) console.error('Error writing file:', err);
            else console.log(`Array successfully written to ${filePath}`);
         });

         // Return JSON Output
         return res.status(200).json(Array.from(newData).map(([_, d]) => d));

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   async fixSheet(req: Request, res: Response) {
      try {
         let sheetData = require(path.join(__dirname, '/../../util/sheetData2.json'));
         const sessionId = `f63b1b74-0533-4a62-8510-6292cc93a9a3`;
         const sheets = await ais.sheet.findMany({
            where: {
               sessionId,
            }
         })
         // Upsert Bulk into Sheet 
         await ais.$executeRaw`set foreign_key_checks=0`;
         const resp: any = await Promise.all(sheets?.map(async (row: any) => {
            const sm = sheetData.find((r: any) => r.sessionId == sessionId && r.semesterNum == row.semesterNum && r.programId == row.programId && r.assignStaffId != null);
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
               return await ais.$executeRaw`update ais_sheet set assignStaffId=${sm.assignStaffId}, assessorId=${sm.assessorId}, certifierId=${sm.certifierId} WHERE id = ${row.id}`;
         }))
         await ais.$executeRaw`set foreign_key_checks=1`;
         console.log(resp);
         // Write to File

         // Return JSON Output
         return res.status(200).json(resp);

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async loadSheet(req: Request, res: Response) {
      try {
         // Fetch Active Semester
         const { sheetId } = req.body;
         // Fetch Session Info
         const sheet = await ais.sheet.findFirst({ where: { id: sheetId, status: true }, include: { program: true, unit: true, session: true, course: true, major: true } })
         if (sheet) {
            // Fetch Mounted Courses all Program Levels

            let mounts = await ais.assessment.findMany({
               where: {
                  semesterNum: sheet.semesterNum,
                  sessionId: sheet?.sessionId,
                  courseId: sheet?.courseId,
                  student: { programId: sheet?.programId },
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
            })

            mounts = mounts?.filter((st: any, i: number) => {
               //console.log(sheet, st?.semesterNum, st?.student?.studyMode, sheet?.studyMode)
               // if(st?.student?.semesterNum < 5) return sheet?.programId == st?.student?.programId && sheet?.studyMode == st?.student?.studyMode;
               // return sheet?.programId == st?.student?.programId && sheet?.majorId == st?.student?.majorId && sheet?.studyMode == st?.student?.studyMode;
               // if(st?.student?.semesterNum < 5) return sheet?.studyMode == st?.student?.studyMode; // Level 100 - 200 dont have majors assigned
               // return sheet?.majorId == st?.student?.majorId && sheet?.studyMode == st?.student?.studyMode; // Level 300 and Above should have Majors 
               // if(sheet?.studyMode) return sheet?.studyMode == st?.student?.studyMode; 

               if (sheet?.studyMode == null) return true;
               return sheet?.studyMode == st?.student?.studyMode;
            });

            let resp = mounts?.map((row: any) => {
               const grade = getGrade(row.totalScore, row.scheme?.gradeMeta);
               const gradepoint = getGradePoint(row.totalScore, row.scheme?.gradeMeta);
               return ({
                  ...row,
                  grade,
                  gradepoint
               })
            });

            console.log("resp: ", resp)
            if (resp) {
               res.status(200).json(resp)
            } else {
               res.status(202).json({ message: `no record found` })
            }
         } else {
            res.status(202).json({ message: `no record found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async uploadSheet(req: Request, res: Response) {
      try {
         // Fetch Active Semester
         const { id, data } = req.body;
         // const createdBy = req.userId;
         let resp, sheetId = 0;
         const sheet = await ais.sheet.findFirst({ where: { id } })

         if (data?.length && sheet && !sheet.assessed) {
            const { sessionId, courseId } = sheet;
            resp = await Promise.all(data?.map(async (row: any) => {
               let { indexno, classScore, examScore, totalScore, sheet } = row;
               classScore = classScore != '' ? classScore : null;
               examScore = examScore != '' ? examScore : null;
               totalScore = totalScore != '' ? totalScore : null;
               sheetId = sheet;
               let isExist = await ais.assessment.findFirst({ where: { sessionId, courseId, indexno } });
               if (isExist && sheetId == sheetId) {
                  return await ais.assessment.update({ where: { id: isExist?.id }, data: { classScore, examScore, totalScore } });
               }
               return null;
            }))
         } else return resp;

         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `Upload failed` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async saveSheet(req: Request, res: Response) {
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
            let classScore: any = (scoreA && scoreB && scoreC) ? (scoreA + scoreB + scoreC) : (scoreA && scoreB && !scoreC) ? (scoreA + scoreB) : parseFloat(data[`${i}_class`]);
                classScore = !isNaN(classScore) ? classScore : null;
            let examScore: any = parseFloat(data[`${i}_exam`]);
                examScore = !isNaN(examScore) ? examScore : null;
            let totalScore = classScore + examScore;
                totalScore = !isNaN(totalScore) ? totalScore : null
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
            })
         }
         // Bulk Score Update 
         const resp: any = await Promise.all(mounts?.map(async (query: any) => {
            return await ais.assessment.updateMany(query)
         }))

         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async stageAuccSheet(req: Request, res: Response) {
      try {
         // Fetch Active Semester
         const { sessionId } = req.body;
         let loopcount = 0;
         // Check whether Sheets are generated 
         const form = await ais.sheet.findFirst({ where: { sessionId, status: true } })
         if (form) res.status(202).json({ message: `no record found` });
         // Fetch Session Info
         const session = await ais.session.findFirst({ where: { id: sessionId, default: true } })
         if (session) {
            if (session?.tag?.toLowerCase() == 'main') {
               // Fetch Mounted Courses all Program Levels
               const mounts = await ais.structure.findMany({ where: { status: true, program: { status: true } }, include: { program: true } })
               if (mounts?.length) {
                  for (let meta of mounts) {
                     if (meta.semesterNum % 2 == (session.semester == 'SEM2' ? 1 : 0)) continue;
                     var sessionModes: any = [];
                     switch (meta?.program?.category) {
                        case "CP": sessionModes = ["M"]; break;
                        case "DP": sessionModes = ["M", "E", "W"]; break;
                        case "UG": sessionModes = ["M", "E", "W"]; break;
                        case "PG": sessionModes = ["W"]; break;
                     }

                     // Run Data For All Existing Session Modes
                     if (sessionModes?.length) {
                        const resp: any = await Promise.all(sessionModes?.map(async (mode: any) => {
                           let { courseId, programId, unitId, majorId } = meta;
                           return await ais.sheet.create({
                              data: {
                                 semesterNum: meta.semesterNum,
                                 studyMode: mode,
                                 ...sessionId && ({ session: { connect: { id: sessionId } } }),
                                 ...courseId && ({ course: { connect: { id: courseId } } }),
                                 ...programId && ({ program: { connect: { id: programId } } }),
                                 ...majorId && ({ major: { connect: { id: majorId } } }),
                                 ...unitId && ({ unit: { connect: { id: unitId } } }),
                              }
                           })
                        }))
                        if (resp.length) loopcount += resp.length;
                     }
                  }
               }

            } else {
               // JAN - SUB STREAM
               const code = session?.admissionPrefix;
               if (code) {  // Only Set for January Sessions - not Main Session
                  // Check Student if students admitted
                  const st: any = await ais.$queryRaw`select * from ais_student where date_format(entryDate,'%m%y') = ${code} and semesterNum < 5`;
                  // Fetch Mounted Courses all Program Levels
                  let mounts = await ais.structure.findMany({ where: { status: true, semesterNum: { lt: 5 }, program: { status: true } }, include: { program: true } })
                  // Filter Mounted to Some Specific course and programs
                  let holder: any = new Set();
                  for (const s of st) {
                     if (!holder.has(`${s.programId}${s.semesterNum}${s.studyMode ? s.studyMode : ""}`))
                        holder.add(`${s.programId}${s.semesterNum}${s.studyMode ? s.studyMode : ""}`);
                  }
                  mounts = mounts.filter((r: any) => [1, 2].includes(r.semesterNum) || ([3, 4].includes(r.semesterNum) && holder.has(`${r.programId}${r.semesterNum}${r.studyMode ? r.studyMode : ""}`)));

                  if (st?.length && mounts?.length) {
                     for (let meta of mounts) {
                        if (meta.semesterNum % 2 == (session.semester == 'SEM2' ? 1 : 0)) continue;
                        var sessionModes: any = [];
                        switch (meta?.program?.category) {
                           case "CP": sessionModes = ["M"]; break;
                           case "DP": sessionModes = ["M", "E", "W"]; break;
                           case "UG": sessionModes = ["M", "E", "W"]; break;
                           case "PG": sessionModes = ["W"]; break;
                        }

                        // Run Data For All Existing Session Modes
                        if (sessionModes?.length) {
                           const resp: any = await Promise.all(sessionModes?.map(async (mode: any) => {
                              let { courseId, programId, unitId, majorId } = meta;
                              return await ais.sheet.create({
                                 data: {
                                    semesterNum: meta.semesterNum,
                                    studyMode: mode,
                                    ...sessionId && ({ session: { connect: { id: sessionId } } }),
                                    ...courseId && ({ course: { connect: { id: courseId } } }),
                                    ...programId && ({ program: { connect: { id: programId } } }),
                                    ...majorId && ({ major: { connect: { id: majorId } } }),
                                    ...unitId && ({ unit: { connect: { id: unitId } } }),
                                 }
                              })
                           }))
                           if (resp.length) loopcount += resp.length;
                        }
                     }
                  }
               }
            }
         } else {
            // Session Not Default or Activated
            res.status(202).json({ message: `Session is not activated!` })
         }

         if (loopcount) {
            // Update Stage Status in Calendar
            await ais.session.update({ where: { id: sessionId }, data: { stageSheet: true } })
            res.status(200).json(loopcount)

         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   async fetchSheet(req: Request, res: Response) {
      try {
         const resp = await ais.sheet.findUnique({
            where: { id: paramStr(req.params.id) },
            include: {
               session: { select: { title: true, tag: true } },
               program: { select: { longName: true, category: true } },
               course: { select: { title: true, id: true, creditHour: true } },
               major: { select: { longName: true } },
               assignee: true,
               assessor: true,
               certifier: true
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postSheet(req: Request, res: Response) {
      try {
         const resp = await ais.sheet.create({
            data: {
               ...req.body,
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async submitSheet(req: any, res: Response) {
      try {
         const assessorId: any = req.userId;
         const resp = await ais.sheet.update({ where: { id: paramStr(req.params.id) }, data: { assessed: true, assessorId } });
         if (resp) {
            console.log(resp)
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async closeSheet(req: Request, res: Response) {
      try {
         const resp: any = await ais.sheet.findUnique({ where: { id: paramStr(req.params.id) } });
         if (resp) {
            let { courseId, programId, unitId, majorId, sessionId, semesterNum, studyMode } = resp;
            // Fetch Affected Students
            const assessments = await ais.assessment.findMany({
               where: {
                  ...sessionId && ({ sessionId }),
                  ...courseId && ({ courseId }),
                  ...programId && ({ student: { programId } }),
                  ...majorId && ({ student: { majorId } }),
                  ...studyMode && ({ student: { studyMode } }),
                  ...semesterNum && ({ semesterNum: Number(semesterNum) }),
                  // ... unitId && ({ unitId }),
               },
               include: { scheme: true }
            })

            // Generate Resit Data on Sheet Close
            //const rsession = await ais.resitSession.findFirst({ where: { default: true }});
            const all = await Promise.all(assessments.filter((a: any) => a.totalScore < a.scheme.passMark).map(async (r: any) => {
               const { sessionId, indexno, courseId, schemeId, semesterNum } = r;
               return await ais.resit.upsert({
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
               })
            }));

            // Update Student Assessment Publish Status
            await ais.assessment.updateMany({
               where: {
                  ...sessionId && ({ sessionId }),
                  ...courseId && ({ courseId }),
                  ...programId && ({ student: { programId } }),
                  ...majorId && ({ student: { majorId } }),
                  ...studyMode && ({ student: { studyMode } }),
                  ...semesterNum && ({ semesterNum: Number(semesterNum) }),
                  // ... unitId && ({ unitId }),
               },
               data: { status: true },
            })
            console.log(all)
            // Update Sheet
            await ais.sheet.update({ where: { id: paramStr(req.params.id) }, data: { finalized: true } })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async publishSheet(req: any, res: Response) {
      try {
         const certifierId: any = req.userId;
         const resp: any = await ais.sheet.findUnique({ where: { id: paramStr(req.params.id) } });
         if (resp) {
            let { courseId, programId, unitId, majorId, sessionId, semesterNum, studyMode } = resp
            // Update Student Assessment Publish Status
            const ups = await ais.assessment.updateMany({
               where: {
                  ...sessionId && ({ sessionId }),
                  ...courseId && ({ courseId }),
                  ...programId && ({ student: { programId } }),
                  ...majorId && ({ student: { majorId } }),
                  ...studyMode && ({ student: { studyMode } }),
                  ...semesterNum && ({ semesterNum: Number(semesterNum) }),
                  // ... unitId && ({ unitId }),
               },
               data: { status: true }
            })
            // Update Sheet
            await ais.sheet.update({ where: { id: paramStr(req.params.id) }, data: { certified: true, certifierId } })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async unpublishSheet(req: Request, res: Response) {
      try {
         const resp: any = await ais.sheet.findUnique({ where: { id: paramStr(req.params.id) } });
         if (resp) {
            let { courseId, programId, unitId, majorId, sessionId, semesterNum, studyMode } = resp
            // Update Student Assessment Publish Status
            const ups = await ais.assessment.updateMany({
               where: {
                  ...sessionId && ({ sessionId }),
                  ...courseId && ({ courseId }),
                  ...programId && ({ student: { programId } }),
                  ...majorId && ({ student: { majorId } }),
                  ...studyMode && ({ student: { studyMode } }),
                  ...semesterNum && ({ semesterNum: Number(semesterNum) }),
                  // ... unitId && ({ unitId }),
               },
               data: { status: false }
            })
            console.log(ups)
            // Update Sheet
            await ais.sheet.update({ where: { id: paramStr(req.params.id) }, data: { certified: false, certifierId: null } })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateSheet(req: Request, res: Response) {
      try {
         let { courseId, programId, unitId, majorId, sessionId, semesterNum, studyMode, assignStaffId } = req.body;
         const sheet = await ais.sheet.findUnique({ where: { id: paramStr(req.params.id) } });
         const resp = await ais.sheet.update({
            where: {
               id: paramStr(req.params.id)
            },
            data: {
               //...req.body,
               ...studyMode && ({ studyMode }),
               ...semesterNum && ({ semesterNum: Number(semesterNum) }),
               ...sessionId && ({ session: { connect: { id: sessionId } } }),
               ...courseId && ({ course: { connect: { id: courseId } } }),
               ...programId && ({ program: { connect: { id: programId } } }),
               ...unitId && ({ unit: { connect: { id: unitId } } }),
               ...majorId && majorId == 'NONE' && ({ major: { disconnect: true } }),
               ...majorId && majorId != 'NONE' && ({ major: { connect: { id: majorId } } }),
               ...assignStaffId && ({ assignee: { connect: { staffNo: assignStaffId } } }),
            }
         })
         if (resp) {
            // Send SMS 
            if (assignStaffId && (assignStaffId != sheet.assignStaffId)) {
               const st = await ais.staff.findFirst({ where: { staffNo: assignStaffId } })
               if (st?.phone) await sms(st?.phone, `Hi! You have been assigned a course with course code: ${sheet?.courseId} for Year ${Math.ceil(sheet?.semesterNum / 2)}. Please login to assess your students.`)
            }

            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async reverseSheet(req: Request, res: Response) {
      try {
         const sheet = await ais.sheet.findUnique({ where: { id: paramStr(req.params.id) } });
         const resp = await ais.sheet.update({
            where: { id: paramStr(req.params.id) },
            data: {
               assigned: false,
               certified: false,
               finalized: false
            }
         })
         if (resp) {
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteSheet(req: Request, res: Response) {
      try {
         const resp = await ais.sheet.delete({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }



   /* Backlog */
   async fetchBacklogs(req: Request, res: Response) {
      const { page = 1, pageSize = 6, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { title: { contains: keyword } },
                  { session: { title: { contains: keyword } } },
               ],
            },
         }
         const resp = await ais.$transaction([
            ais.activityBacklog.count({
               ...(searchCondition),
            }),
            ais.activityBacklog.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
               include: {
                  session: true
               }
            })
         ]);

         if (resp && resp[1]?.length) {
            return res.status(200).json({
               totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
               totalData: resp[1]?.length,
               data: resp[1],
            })
         } else {
            return res.status(202).json({ message: `no records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchBacklog(req: Request, res: Response) {
      try {
         const resp = await ais.activityBacklog.findUnique({
            where: { id: paramStr(req.params.id) },
            include: { session: true }
         })
         if (resp) {
            return res.status(200).json(resp)
         } else {
            return res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async approveBacklog(req: any, res: Response) {
      try {
         const approvedBy = req.userId;
         const rs = await ais.activityBacklog.findUnique({
            where: { id: req.body?.backlogId },
         })

         if (rs) {
            const { id, type, meta, sessionId, schemeId } = rs;
            let data = [], resp;

            if (type == 'ASSESSMENT') { // BACKLOG ASSESSMENT
               data = await Promise.all(meta.map(async (r: any) => {
                  const as = await ais.assessment.findFirst({ where: { sessionId, courseId: r.courseId, indexno: r.indexno.trim() } });
                  const cs = await ais.course.findUnique({ where: { id: r.courseId } });
                  // Log Existing Data
                  await ais.log.create({ data: { action: `BACKLOG_${type}`, user: req.userId, student: r.indexno.trim(), meta: as } });
                  // Upsert New Data
                  return await ais.assessment.upsert({
                     where: {
                        id: as?.id ?? ''
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
                        credit: cs?.creditHour,
                        sessionId,
                        schemeId
                     },
                     update: {
                        semesterNum: Number(r.semesterNum),
                        classScore: r.scoreClass,
                        examScore: r.scoreExam,
                        totalScore: r.scoreTotal,
                        type: r.scoreType,
                        credit: cs?.creditHour,
                        schemeId
                     },

                  })
               }))
               resp = { count: data?.length };


            } else if (type == 'REGISTRATION') { // BACKLOG REGISTRATION
               data = await Promise.all(meta.map(async (r: any) => {
                  const cs = await ais.course.findUnique({ where: { id: r.courseId } });
                  return ({
                     indexno: r.indexno.trim(),
                     courseId: r.courseId,
                     semesterNum: Number(r.semesterNum),
                     type: r.scoreType,
                     status: true,
                     credit: cs?.creditHour,
                     sessionId,
                     schemeId
                  })
               }))
               resp = await ais.assessment.createMany({ data });

            } else if (type == 'DELETION') { // BACKLOG DELETION
               data = await Promise.all(meta.map(async (r: any) => {
                  const as = await ais.assessment.findFirst({ where: { sessionId, courseId: r.courseId, indexno: r.indexno } });
                  // Log Existing Data
                  await ais.log.create({ data: { action: `BACKLOG_${type}`, user: req.userId, student: r.indexno, meta: as } });
                  // Upsert New Data
                  return ais.assessment.deleteMany({ where: { indexno: r.indexno, courseId: r.courseId, sessionId } })
               }))
               resp = { count: data?.length };
            }
            console.log(resp)
            if (resp?.count) {
               // Update Backlog Status
               await ais.activityBacklog.update({ where: { id }, data: { approvedBy, status: true } });
               // Return Response
               res.status(200).json({ success: true, data: resp })

            } else {
               res.status(202).json({ message: `no records found` })
            }

         }
         else throw ("Invalid Backlog Id")

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async uploadBacklog(req: any, res: Response) {
      try {
         const data = req.body;
         let resp;
         if (data?.length) {

            const createdBy: any = req.userId;
            let sessionId = data[0].sessionId, schemeId = data[0].schemeId;
            let meta: any = [];

            data?.map(async (row: any) => {
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

               meta.push({ indexno, courseId, semesterNum, scoreType: type, scoreClass: classScore, scoreExam: examScore, scoreTotal: totalScore })
            })

            resp = await ais.activityBacklog.create({
               data: {
                  title: `UPLOAD - ${moment().format('LLL')?.toUpperCase()} - ${createdBy}`,
                  type: `ASSESSMENT`,
                  meta,
                  ...createdBy && ({ creator: { connect: { staffNo: createdBy } } }),
                  ...sessionId && ({ session: { connect: { id: sessionId } } }),
                  ...schemeId && ({ scheme: { connect: { id: schemeId } } }),
               },
            })

         } else return resp;


         if (resp) {
            console.log(resp)
            res.status(200).json({ success: true, data: resp })
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(202).json({ message: error.message })
      }
   }

   async postBacklog(req: any, res: Response) {
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
                  meta.push({ indexno, courseId, semesterNum, scoreType })
               else if (type == 'ASSESSMENT')
                  meta.push({ indexno, courseId, semesterNum, scoreType, scoreClass, scoreExam, scoreTotal })
               else
                  meta.push({ indexno, courseId, semesterNum })
            }

         const resp = await ais.activityBacklog.create({
            data: {
               title: `ENTRY - ${moment().format('LLL')?.toUpperCase()} - ${createdBy}`,
               type,
               meta,
               ...createdBy && ({ creator: { connect: { staffNo: createdBy } } }),
               ...sessionId && ({ session: { connect: { id: sessionId } } }),
               ...schemeId && ({ scheme: { connect: { id: schemeId } } }),
            },
         })

         if (resp) {
            res.status(200).json({ success: true, data: resp })
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateBacklog(req: any, res: Response) {
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
                  meta.push({ indexno, courseId, semesterNum, scoreType })
               else if (type == 'ASSESSMENT')
                  meta.push({ indexno, courseId, semesterNum, scoreType, scoreClass, scoreExam, scoreTotal })
               else
                  meta.push({ indexno, courseId, semesterNum })
            }

         const resp = await ais.activityBacklog.update({
            where: { id: paramStr(req.params.id) },
            data: {
               // title,
               type,
               meta,
               // ...createdBy && ({ creator: { connect: { staffNo: createdBy } } }),
               ...sessionId && ({ session: { connect: { id: sessionId } } }),
               ...schemeId && ({ scheme: { connect: { id: schemeId } } }),
            },
         })
         if (resp) {
            res.status(200).json({ success: true, data: resp })
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteBacklog(req: Request, res: Response) {
      try {
         const resp = await ais.activityBacklog.delete({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   /* Resit */
   async fetchResits(req: Request, res: Response) {
      const { page = 1, pageSize = 6, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
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
         }
         const resp = await ais.$transaction([
            ais.resit.count({
               ...(searchCondition),
            }),
            ais.resit.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
               include: {
                  resitSession: true,
                  trailSession: true,
                  registerSession: true,
                  course: true,
                  student: { include: { program: true } },

               }
            })
         ]);

         //if(resp && resp[1]?.length){
         return res.status(200).json({
            totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
            totalData: resp[1]?.length,
            data: resp[1],
         })
         // } else {
         //    return res.status(202).json({ message: `no records found` })
         // }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchResit(req: Request, res: Response) {
      try {
         const resp = await ais.resit.findUnique({
            where: { id: paramStr(req.params.id) },
            include: { session: true }
         })
         if (resp) {
            return res.status(200).json(resp)
         } else {
            return res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postResit(req: any, res: Response) {
      try {
         const createdBy = req.userId;
         const { sessionId, schemeId, type, title } = req.body;
         const resp = await ais.resit.create({
            data: {
               title,
               type,
               ...createdBy && ({ creator: { connect: { staffNo: createdBy } } }),
               ...sessionId && ({ resitSession: { connect: { id: sessionId } } }),
               ...schemeId && ({ scheme: { connect: { id: schemeId } } }),
            },
         })
         if (resp) {
            res.status(200).json({ success: true, data: resp })
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateResit(req: any, res: Response) {
      try {
         const createdBy = req.userId
         const { sessionId, schemeId, type, title } = req.body;
         const resp = await ais.resit.update({
            where: { id: paramStr(req.params.id) },
            data: {
               title,
               type,
               ...createdBy && ({ creator: { connect: { staffNo: createdBy } } }),
               ...sessionId && ({ resitSession: { connect: { id: sessionId } } }),
               ...schemeId && ({ scheme: { connect: { id: schemeId } } }),
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteResit(req: Request, res: Response) {
      try {
         const resp = await ais.resit.delete({ where: { id: paramStr(req.params.id) } })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   /* Resit Session */
   async fetchResitSessions(req: Request, res: Response) {
      const { page = 1, pageSize = 6, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { title: { contains: keyword } },
               ],
            },
         }
         const resp = await ais.$transaction([
            ais.resitSession.count({
               ...(searchCondition),
            }),
            ais.resitSession.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
            })
         ]);

         //if(resp && resp[1]?.length){
         return res.status(200).json({
            totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
            totalData: resp[1]?.length,
            data: resp[1],
         })
         // } else {
         //    return res.status(202).json({ message: `no records found` })
         // }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchResitSessionsList(req: Request, res: Response) {
      try {
         const resp = await ais.resitSession.findMany({
            orderBy: { createdAt: 'desc' }
         })
         // Return Response
         return res.status(200).json(resp)
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchResitSessionList(req: Request, res: Response) {
      try {
         const resp = await ais.resit.findMany({
            where: { resitSessionId: paramStr(req.params.id) },
            include: { course: true, student: true, scheme: true }
         })
         if (resp.length) {
            const grades: any = resp[0].scheme?.gradeMeta;
            const dm = await Promise.all(resp.map(async (r: any) => {
               return ({ ...r, grade: await getGrade(r?.totalScore, grades) })
            }));

            let courseMap = new Map();
            for (let d of dm) {
               if (courseMap.has(`${d?.course?.id} - ${d?.course?.title}`)) {
                  let cs = courseMap.get(`${d?.course?.id} - ${d?.course?.title}`);
                  cs.push(d);
                  courseMap.set(`${d?.course?.id} - ${d?.course?.title}`, cs);

               } else {
                  courseMap.set(`${d?.course?.id} - ${d?.course?.title}`, [d]);
               }
            }

            // Return Response
            return res.status(200).json(Array.from(courseMap))
         } else {
            return res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   async fetchResitSession(req: Request, res: Response) {
      try {
         const resp = await ais.resitSession.findUnique({
            where: { id: paramStr(req.params.id) },
         })
         if (resp) {
            return res.status(200).json(resp)
         } else {
            return res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async saveResitSession(req: Request, res: Response) {
      try {
         // Fetch Active Semester
         const { count, data } = req.body;
         console.log(req.body)
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
            })
         }
         // Bulk Score Update 
         const resp: any = await Promise.all(mounts?.map(async (query: any) => {
            return await ais.resit.updateMany(query)
         }))

         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   async postResitSession(req: any, res: Response) {
      try {
         const resp = await ais.resitSession.create({
            data: req.body,
         })
         if (resp) {
            res.status(200).json({ success: true, data: resp })
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateResitSession(req: any, res: Response) {
      try {
         const resp = await ais.resitSession.update({
            where: { id: paramStr(req.params.id) },
            data: req.body,
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteResitSession(req: Request, res: Response) {
      try {
         const resp = await ais.resitSession.delete({ where: { id: paramStr(req.params.id) } })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   /* Graduate Session */
   async fetchGraduateLogs(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { indexno: { contains: keyword } },
                  { graduateSession: { contains: keyword } },
                  { reason: { contains: keyword } },
               ],
            }
         }
         const resp = await ais.$transaction([
            ais.graduateLog.count({
               ...(searchCondition),
            }),
            ais.graduateLog.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
            })
         ]);

         //if(resp && resp[1]?.length){
         res.status(200).json({
            totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
            totalData: resp[1]?.length,
            data: resp[1],
         })
         //} else {
         //res.status(202).json({ message: `no records found` })
         //}
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }



   /* Graduate Session */
   async fetchGraduateSessions(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { title: { contains: keyword } },
                  { description: { contains: keyword } },
               ],
            }
         }
         const resp = await ais.$transaction([
            ais.graduateSession.count({
               ...(searchCondition),
            }),
            ais.graduateSession.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
               include: {
                  _count: {
                     select: { graduate: true }
                  }
               }

            })
         ]);

         //if(resp && resp[1]?.length){
         res.status(200).json({
            totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
            totalData: resp[1]?.length,
            data: resp[1],
         })
         //} else {
         //res.status(202).json({ message: `no records found` })
         //}
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchGraduateSessionsList(req: Request, res: Response) {
      try {
         const resp = await ais.graduateSession.findMany()
         // Return Response
         return res.status(200).json(resp)
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchGraduateSessionList(req: Request, res: Response) {
      try {
         const resp = await ais.graduate.findMany({
            where: { graduateSessionId: paramStr(req.params.id) },
            include: { student: { include: { program: true } } },
            orderBy: {
               student: { lname: 'asc' }
            }
         })
         if (resp.length) {
            const dm = resp;

            let programMap = new Map();
            for (let d of dm) {
               if (programMap.has(d?.student?.program?.longName)) {
                  let cs = programMap.get(d?.student?.program?.longName);
                  cs.push(d);
                  programMap.set(d?.student?.program?.longName, cs);

               } else {
                  programMap.set(d?.student?.program?.longName, [d]);
               }
            }
            // Return Response
            return res.status(200).json(Array.from(programMap))
         } else {
            res.status(202).json([])
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async generateGraduateSessionList(req: Request, res: Response) {
      try {
         const resp = await ais.graduateSession.findFirst({ where: { default: true } });
         if (resp) {
            // Clean Graduates
            const dels = await ais.graduate.deleteMany({
               where: { graduateSessionId: resp?.id }
            })
            // Fetch All students with Completed Status, Graduated Status with Program link
           
            let sts = await ais.student.findMany({
               where: { 
                  completeStatus: true, 
                  graduateStatus: false, 
                  indexno: { not: null },
                  semesterNum: 0
               },
               include: { program: true },
            })


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


            sts = await Promise.all(sts.map(async (st: any) => {
               let verified = true;
               let verifiedRemark:any = [];
               let incompleteCount = 0;
               // Get Credit Total
               const as = await ais.assessment.aggregate({ _sum: { credit: true }, where: { indexno: st.indexno } }); // Credit Total
               // Get CGPA for Student
               let ax = await ais.assessment.findMany({ where: { indexno: st.indexno }, include: { scheme: true } });
               let az = ax.reduce((acc: any, r: any) => {
                  // Check for IC
                  if(r.totalScore === undefined || r.totalScore == null) incompleteCount+= 1;
                  // Compute Gragepoint
                  const grades: any = r.scheme?.gradeMeta;
                  const gv = getGradePoint((r.totalScore || 0), grades);
                  return acc + (gv * r.credit);

               }, 0);

               const cgpa = (az / (as?._sum?.credit || 0)).toFixed(2);
               const classes: any = ax?.length ? ax[0].scheme?.classMeta : null;
               const graduateClass = getClass(cgpa, classes);

               // #1. Check From Resit Table, whether Student doesnt have Pending and Untaken Resits
               // const rs = await ais.resit.count({ where: { indexno: st.indexno, taken: false } });
               // const isPassedResit = !Boolean(rs);   
               const isPassedResit = true;
               if (!isPassedResit){
                  verified = false;
                  verifiedRemark.push(`Untaken Resit(s)`)
               } 
              
               // #2. Check Whether Total Credit hours in assessment is greater or equal to Program Credit Minimum
               const isPassedCreditTotal = (as?._sum?.credit || 0) >= st?.program?.creditTotal;
               if (!isPassedCreditTotal){
                  verified = false;
                  verifiedRemark.push(`Program Credit Minimum Not Met`);
               } 

               // #3. Check Whether IC or Incomplete Courses exist.
               if (incompleteCount > 0){
                  verified = false;
                  verifiedRemark.push(`${incompleteCount} IC(s) Identified`);
               } 

               if(isPassedCreditTotal && isPassedResit)
                  return await ais.graduate.upsert({
                     where: { indexno: st?.indexno },
                     create: { cgpa, verified, verifiedRemark: verifiedRemark ? verifiedRemark?.join(", "): null, class: graduateClass, indexno: st?.indexno, graduateSessionId: resp?.id },
                     update: { cgpa, verified, verifiedRemark: verifiedRemark ? verifiedRemark?.join(", "): null, class: graduateClass }
                  })
               return
               
            }));

            // Return Response
            return res.status(200).json(resp)
         } else {
            return res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchGraduateSession(req: Request, res: Response) {
      try {
         const resp = await ais.graduateSession.findUnique({
            where: { id: paramStr(req.params.id) },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postGraduateSession(req: Request, res: Response) {
      try {

         const resp = await ais.graduateSession.create({
            data: {
               ...req.body,
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateGraduateSession(req: Request, res: Response) {
      try {
         const resp = await ais.graduateSession.update({
            where: {
               id: paramStr(req.params.id)
            },
            data: {
               ...req.body,
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteGraduateSession(req: Request, res: Response) {
      try {
         const resp = await ais.graduateSession.delete({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }



   /* Graduate */
   async fetchGraduates(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
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
         }
         const resp = await ais.$transaction([
            ais.graduate.count({
               ...(searchCondition),
            }),
            ais.graduate.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
               include: {
                  student: { include: { program: true } },
                  graduateSession: true
               }
            })
         ]);

         //if(resp && resp[1]?.length){
         res.status(200).json({
            totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
            totalData: resp[1]?.length,
            data: resp[1],
         })
         //} else {
         //res.status(202).json({ message: `no records found` })
         //}
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchGraduateList(req: Request, res: Response) {
      try {
         const resp = await ais.graduate.findMany({
            where: { status: true },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchGraduate(req: Request, res: Response) {
      try {
         const resp = await ais.graduate.findUnique({
            where: {
               id: paramStr(req.params.id)
            },
            include: { program: true }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   async uploadGraduate(req: any, res: Response) {
      try {
         const data = req.body;
         let resp: any;
         console.log("Data: ", data?.length)
         if (data?.length) {
            let logs:any = [];
            const certPrintedBy: any = req.userId;
            let count = 0;
            // for(let row of data){
            await Promise.all(data.map( async(row: any) => {
               let { certno: certNo, indexno, year, cgpa } = row;
               // Log Record
               logs.push({ indexno, graduateSession: `${year} GRADUATION `})
               // Get Student Data - Check If  student Exist
               const st = await ais.student.findFirst({ 
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
               if(!st) count += 1;

               if(st?.indexno){
                    console.log("st: ", !!st), st?.fname
                  try {
                     let graduateSessionId;
                     const classes: any = st?.program?.scheme?.classMeta || null;
                     const graduateClass = getClass(cgpa, classes);
                     // Upsert Graduation Session, 
                     const gs = await ais.graduateSession.findFirst({ where: { title: `${year} GRADUATION` }});
                     if(gs){
                        graduateSessionId = gs?.id
                     } else {
                        const insGs = await ais.graduateSession.create({ data: { title: `${year} GRADUATION`, description: `${year} GRADUATION`, start: new Date(`${year}-11-15`), end: new Date(`${year}-11-20`), status: true, default: false  }});
                        console.log("insGs: ",insGs); 
                        graduateSessionId = insGs?.id;
                     }
                     // Update Graduation Data and Status
                     const gst = await ais.graduate.upsert({
                        where: { indexno: st?.indexno?.trim() },
                        create: { cgpa: String(cgpa), certNo: String(certNo), class: graduateClass, certPrinted: true, certPrintedAt: new Date(`${year}-11-01`), certPrintedBy, indexno: st?.indexno?.trim(), graduateSessionId },
                        update: { cgpa: String(cgpa), certNo: String(certNo), class: graduateClass }
                     })

                     if(gst){
                        // Remove from Log
                        logs = logs?.filter((r:any) => r.indexno != indexno);
                        // Update CGPA, Graduate Status, Complete Status in Student Model
                        await ais.student.update({ where: { id: st?.id }, data: { graduateStatus: true, completeStatus: true, completeType: 'GRADUATION' } });
                     }
                     
                  } catch (error: any) {
                     // Remove from Log
                     logs = logs?.filter((r:any) => r.indexno != indexno);
                     const lg = await ais.graduateLog.upsert({
                        where: { indexno_graduateSession: { indexno, graduateSession: `${year} GRADUATION` } },
                        create: { indexno, graduateSession: `${year} GRADUATION`, reason: error?.code?.toUpperCase() },
                        update: { reason: error?.code?.toUpperCase()  }
                     })
                     console.log(`LOG ${indexno}: `,lg)
                  }
                 
               } else {
                  // Remove from Log
                  logs = logs?.filter((r:any) => r.indexno != indexno);
                  // const lg = await ais.graduateLog.create({ data: { indexno, graduateSession: `${year} GRADUATION`, reason: `STUDENT NOT FOUND - CHECK INDEXNO`  }});
                  const lg = await ais.graduateLog.upsert({
                     where: { indexno_graduateSession: { indexno, graduateSession: `${year} GRADUATION` } },
                     create: { indexno, graduateSession: `${year} GRADUATION`, reason: `STUDENT NOT FOUND` },
                     update: { reason: `STUDENT NOT FOUND` }
                  })
                  console.log(`LOG ${indexno}: `,lg)
               }

              
            })) 

            // 
            console.log("MAIN LOGS: ", logs?.length);
            
            // Commit Skipped Logs
            await Promise.all(logs.map( async(row: any) => {
               const lg = await ais.graduateLog.upsert({
                  where: { indexno_graduateSession: { indexno: row.indexno, graduateSession: row.graduateSession  } },
                  create: { indexno: row.indexno, graduateSession: row.graduateSession , reason: 'STUDENT SKIPPED' },
                  update: { reason: 'STUDENT SKIPPED' }
               })
               console.log(`MAIN LOG ${row.indexno}: `,lg)
            }));

            resp = data?.length;
         
         } 


         if (resp) {
            console.log(resp)
            res.status(200).json({ success: true, data: resp })
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log("Return Error", error.message)
         return res.status(202).json({ message: error.message })
      }
   }


   async uploadGraduateSupplement(req: any, res: Response) {
      try {
         const data = req.body;
         let resp: any;
         console.log("Data: ", data?.length)
         if (data?.length) {
            const certPrintedBy: any = req.userId;
            let count = 0;
            // for(let row of data){
            await Promise.all(data.map( async(row: any) => {
               let { indexno } = row;
               const st = await ais.student.updateMany({ 
                  where: { indexno: String(indexno)},
                  data: { graduateStatus: false }
               });
              
               if(st?.count) count += 1;
            })) 
            resp = count; 
         } 

         if (resp) {
            return res.status(200).json({ success: true, data: resp })
         } else {
            return res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log("Return Error", error.message)
         return res.status(202).json({ message: error.message })
      }
   }


   async excludeGraduate(req: Request, res: Response) {
      console.log("body: ",req.body)
      try {
         const resp = await ais.student.updateMany({
            where: {
               indexno: paramStr(req?.params?.id)
            },
            data: {
               ...req.body,
            }
         })
         console.log("resp: ", resp);
         if (resp) {
            res.status(200).json({ success: true, data: resp })
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }



   async postGraduate(req: Request, res: Response) {
      try {

         const resp = await ais.graduate.create({
            data: {
               ...req.body,
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateGraduate(req: Request, res: Response) {
      try {
         const resp = await ais.graduate.update({
            where: {
               id: paramStr(req.params.id)
            },
            data: {
               ...req.body,
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteGraduate(req: Request, res: Response) {
      try {
         const resp = await ais.graduate.delete({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   /* Academic Broadsheet */
   async fetchBroadsheetOld(req: Request, res: Response) {
      try {
         const workbook = new ExcelJS.Workbook();
         const worksheet = workbook.addWorksheet('Final Year Broadsheet');

         let students: any = [], courseData = new Map();
         // Get Final and Completing Student
         let finalStudents = await ais.$queryRaw`select s.fname,s.mname,s.lname,s.indexno,p.longName as program,semesterNum,s.completeStatus,s.deferStatus from ais_student s left join ais_program p on s.programId = p.id where s.semesterNum = p.semesterTotal`;
         const indexnos = finalStudents.filter((r: any) => r.indexno).map((r: any) => r.indexno);
         let results = await ais.assessment.findMany({
            where: { indexno: { in: indexnos } },
            include: { course: true }
         })

         results.map((row: any) => {
            if (courseData.has(`${row.course?.title} (${row.courseId})`)) {
               let courseRecs = courseData.get(`${row.course?.title} (${row.courseId})`);
               if (courseRecs[row.indexno])
                  courseRecs[row.indexno].push(row)
               else
                  courseRecs[row.indexno] = [row];
               courseData.set(`${row.course?.title} (${row.courseId})`, courseRecs)

            } else {
               let courseRecs = { [row.indexno]: [row] };
               courseData.set(`${row.course?.title} (${row.courseId})`, courseRecs)
            }
         })

         students = finalStudents.map((row: any) => {
            let studentData: any = {
               'INDEX NUMBER': row.indexno,
               'NAME OF STUDENT': row.fname + ' ' + (row.mname ? row.mname + ' ' : '') + row.lname,
               'PROGRAM OF STUDY': row.program,
            }

            const cs = Object.keys(Object.fromEntries(courseData));
            for (const key of cs) {
               // const hasData:any = Array.from(courseData).map(([key, data]: any) => { console.log(Object.values(data)); return Object.values(data) }).flat(1).filter((r: any) => r.indexno == row.indexno && r.courseId == key);
               const hasData: any = Array.from(courseData).map(([key, data]: any) => { console.log(Object.values(data)); return Object.values(data) }).flat(2);
               // studentData[key] = hasData.length > 1 ? hasData.join(',') : hasData.length == 1 ? (hasData[0].totalScore || ''):'';
               // studentData[key] = hasData.length > 0 ?  hasData[0].totalScore:'';
               console.log('hasData: ', hasData);
            }
            return studentData;
         })

         // Excel Column names
         const columnNames = Object.keys(students[0]);
         worksheet.columns = columnNames.map((column) => ({ header: column, key: column }));
         // Excel Data
         students.map((student: any) => worksheet.addRow(student));
         console.log("results: ", Array.from(courseData));

         if (students) {
            // Excel File
            //   const buffer = await workbook.xlsx.writeBuffer();
            const filename = 'Final Year Broadsheet.xlsx';
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
            // Write the workbook to the response stream
            await workbook.xlsx.write(res);
            res.end();
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   // VIEW SCRIPT:  create view broadsheet as select x.*,o.title,o.semester,o.year,o.createdAt as sessionCreatedAt,m.gradeMeta,m.classMeta,c.title as courseTitle,upper(s.fname) as fname,upper(s.mname) as mname,upper(s.lname) as lname,p.longName as program,p.shortName as programShortName,j.longName as major,j.shortName as majorShortName,p.stype,p.category,s.semesterNum as curSemesterNum,s.completeStatus,s.deferStatus,s.graduateStatus,s.gender,s.entryDate,s.programId,s.majorId,g.cgpa,g.class,s.id as studentId from ais_assessment x left join ais_course c on x.courseId = c.id left join ais_student s on s.indexno = x.indexno left join ais_program p on s.programId = p.id left join ais_major j on s.majorId = j.id left join ais_session o on x.sessionId = o.id left join ais_scheme m on x.schemeId = m.id left join ais_graduate g on s.indexno = g.indexno left join ais_graduate_session n on g.graduateSessionId = n.id where x.indexno in (select s.indexno from ais_student s left join ais_program p on s.programId = p.id where s.semesterNum = 0 and s.completeStatus = 1 order by s.programId,s.indexno,x.semesterNum);


   async fetchBroadsheet(req: Request, res: Response) {
      try {
         const { program } = req.body;
         let students: any = [], courseData = new Map(), finalStudents = new Map();
         let results = await ais.broadsheet.findMany({
            where: {
               ... (program && program != 'all' && ({ programId: program }))
            },
            orderBy: [
               { program: 'asc' },
               { majorId: 'asc' },
               { lname: 'asc' }
            ]
         });
         results.map((row: any) => {
            // Set Final Year Student Bio
            if (!finalStudents.has(row.indexno))
               finalStudents.set(row.indexno, { fname: row.fname, mname: row.mname, lname: row.lname, indexno: row.indexno, semesterNum: row.curSemesterNum, program: row.program, major: row.major, fgpa: row.cgpa, class: row.class })

            // Set Course & Assessment Data
            if (courseData.has(`${row.courseTitle} (${row.courseId})`)) {
               let courseRecs = courseData.get(`${row.courseTitle} (${row.courseId})`);
               if (courseRecs[row.indexno])
                  courseRecs[row.indexno].push(row)
               else
                  courseRecs[row.indexno] = [row];
               courseData.set(`${row.courseTitle} (${row.courseId})`, courseRecs)

            } else {
               let courseRecs = { [row.indexno]: [row] };
               courseData.set(`${row.courseTitle} (${row.courseId})`, courseRecs)
            }
         })

         // Populate Final Year Broadsheet
         students = Object.keys(Object.fromEntries(finalStudents)).map((rowKey: any) => {
            const studentBio: any = finalStudents.get(rowKey);

            let studentData: any = {
               'INDEX NUMBER': studentBio.indexno,
               'STUDENT NAME': studentBio.lname + ', ' + studentBio.fname + ' ' + (studentBio.mname ? studentBio.mname + ' ' : ''),
               // 'SURNAME': studentBio.lname,
               // 'OTHERNAME(S)': studentBio.fname + ' ' + (studentBio.mname ? studentBio.mname + ' ' : ''),
               'STUDY PROGRAM': studentBio.program,
               'STUDY MAJOR ': studentBio.major,
               'FGPA': studentBio.fgpa,
               'CLASS': studentBio.class,
            }

            const cs = Object.keys(Object.fromEntries(courseData));
            for (const cskey of cs) {
               const hasData2 = Array.from(courseData)?.filter(([key, _]: any) => key == cskey)?.map(([_, data]: any) => data)[0][rowKey] ?? null;
               studentData[cskey] = hasData2?.length ? hasData2.map((m: any) => m.totalScore).join(" | ") : '';
            }
            return studentData;
         })

         if (students) {
            res.status(200).json({ type: req.body?.type, data: students })
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }



   /* Circulars */
   async fetchNotices(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { reference: { contains: keyword } },
                  { title: { contains: keyword } },
                  { receiver: { contains: keyword } },
               ],
            }
         }
         const resp = await ais.$transaction([
            ais.informer.count({
               ...(searchCondition),
            }),
            ais.informer.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
            })
         ]);

         //if(resp && resp[1]?.length){
         res.status(200).json({
            totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
            totalData: resp[1]?.length,
            data: resp[1],
         })
         //} else {
         //res.status(202).json({ message: `no records found` })
         //}
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async sendNotice(req: Request, res: Response) {
      try {
         const resp = await ais.informer.findUnique({
            where: { id: req.body.noticeId }
         })
         if (resp) {
            let receivers: any = [];

            if (resp.receiver == 'APPLICANT') {
               const rs = await ais.applicant.findMany({
                  where: { session: { default: true }, profileId: { not: null } },
                  include: { profile: { select: { phone: true } } }
               })
               receivers = rs?.map((r: any) => r?.profile?.phone);

            } else if (resp.receiver == 'FRESHER') {
               const rs = await ais.student.findMany({
                  where: { completeStatus: false, deferStatus: false, phone: { not: null } },
                  select: { semesterNum: true, entrySemesterNum: true, phone: true },
               })
               receivers = rs?.filter((r: any) => ((r.semesterNum == r.entrySemesterNum) || (r.semesterNum == r.entrySemesterNum + 1))).map((r: any) => r?.phone);

            } else if (resp.receiver == 'FINAL') {
               const rs = await ais.student.findMany({
                  where: { completeStatus: false, deferStatus: false, phone: { not: null } },
                  select: { semesterNum: true, phone: true, program: { select: { semesterTotal: true } } },
               })
               receivers = rs?.filter((r: any) => ((r.semesterNum == r.program.semesterTotal) || (r.semesterNum == r.program.semesterTotal - 1))).map((r: any) => r?.phone);

            } else if (resp.receiver == 'STUDENT') {
               const rs = await ais.student.findMany({
                  where: { completeStatus: false, deferStatus: false, phone: { not: null } },
                  select: { phone: true },
               })
               receivers = rs?.map((r: any) => r?.phone);

            } else if (resp.receiver == 'UNDERGRAD') {
               const rs = await ais.student.findMany({
                  where: { completeStatus: false, deferStatus: false, program: { category: 'UG' }, phone: { not: null } },
                  select: { phone: true },
               })
               receivers = rs?.map((r: any) => r?.phone);

            } else if (resp.receiver == 'POSTGRAD') {
               const rs = await ais.student.findMany({
                  where: { completeStatus: false, deferStatus: false, program: { category: 'PG' }, phone: { not: null } },
                  select: { phone: true },
               })
               receivers = rs?.map((r: any) => r?.phone);

            } else if (resp.receiver == 'ALUMNI') {
               const rs = await ais.student.findMany({
                  where: { completeStatus: true, graduateStatus: true, phone: { not: null } },
                  select: { phone: true },
               })
               receivers = rs?.map((r: any) => r?.phone);

            } else if (resp.receiver == 'STAFF') {
               const rs = await ais.staff.findMany({
                  where: { status: true, phone: { not: null } },
                  select: { phone: true },
               })
               receivers = rs?.map((r: any) => r?.phone);

            } else if (resp.receiver == 'HOD') {
               const rs = await ais.unit.findMany({
                  where: { type: 'ACADEMIC', levelNum: 2 },
                  select: { phone: true, headStaffNo: true },
               })
               receivers = await Promise.all(rs?.map(async (r: any) => {
                  const st = await ais.staff.findFirst({ where: { staffNo: r?.headStaffNo, phone: { not: null } } });
                  return st?.phone
               }));

            } else if (resp.receiver == 'DEAN') {
               const rs = await ais.unit.findMany({
                  where: { type: 'ACADEMIC', levelNum: 1 },
                  select: { phone: true, headStaffNo: true },
               })
               receivers = await Promise.all(rs?.map(async (r: any) => {
                  const st = await ais.staff.findFirst({ where: { staffNo: r?.headStaffNo, phone: { not: null } } });
                  return st?.phone
               }));

            } else if (resp.receiver == 'ASSESSOR') {
               const rs = await ais.unit.findMany({
                  where: { type: 'ACADEMIC', levelNum: 1 },
                  select: { phone: true, headStaffNo: true },
               })
               receivers = await Promise.all(rs?.map(async (r: any) => {
                  const st = await ais.staff.findFirst({ where: { staffNo: r?.headStaffNo, phone: { not: null } } });
                  return st?.phone
               }));

            } else if (resp.receiver == 'DEBTOR') {
               const rs = await ais.student.findMany({
                  where: { completeStatus: true, deferStatus: true, accountNet: { gt: 0 }, phone: { not: null } },
                  select: { phone: true },
               })
               receivers = rs?.map((r: any) => r?.phone);
            }

            // Clean Receivers phone numbers
            const send = receivers?.map(async (phone: string) => {
               const mobile: any = phone.replace('-', '').replace(' ', '').replace('+233', '0').replace('.', '').replace('_', '');
               console.log(mobile);
               if (mobile?.length == 10 || mobile?.length == 11)
                  return await sms(mobile, resp.smsContent);
               return;
            })
            // Return Response
            res.status(200).json(send)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchNotice(req: Request, res: Response) {
      try {
         const resp = await ais.informer.findUnique({
            where: {
               id: paramStr(req.params.id)
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postNotice(req: Request, res: Response) {
      try {

         const resp = await ais.informer.create({
            data: {
               ...req.body,
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateNotice(req: Request, res: Response) {
      try {
         const resp = await ais.informer.update({
            where: {
               id: paramStr(req.params.id)
            },
            data: {
               ...req.body,
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteNotice(req: Request, res: Response) {
      try {
         const resp = await ais.informer.delete({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }



   /* Deferments */
   async fetchDeferments(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { student: { id: { contains: keyword } } },
                  { student: { indexno: { contains: keyword } } },
                  { student: { fname: { contains: keyword } } },
                  { student: { lname: { contains: keyword } } },
                  { session: { title: { contains: keyword } } },
               ],
            }
         }
         const resp = await ais.$transaction([
            ais.activityDefer.count({
               ...(searchCondition),
            }),
            ais.activityDefer.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
               include: {
                  student: { include: { program: true } },
                  session: true
               }
            })
         ]);

         //if(resp && resp[1]?.length){
         res.status(200).json({
            totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
            totalData: resp[1]?.length,
            data: resp[1],
         })
         //} else {
         //res.status(202).json({ message: `no records found` })
         //}
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchDefermentList(req: Request, res: Response) {
      try {
         const resp = await ais.activityDefer.findMany({
            where: { status: true },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchDeferment(req: Request, res: Response) {
      try {
         let resp = await ais.activityDefer.findUnique({
            where: { id: paramStr(req.params.id) },
            include: { student: { include: { program: true } }, session: true }
         })
         if (resp) {
            // Calculate Resumption 
            const year = Number(moment(resp.letterDate).add(resp?.durationInYears, "years").format("YYYY"));
            const academicYear = `${year}/${year + 1}`;

            // Fetch Deferment Letter
            const letter = await ais.letter.findFirst({ where: { tag: resp.status == 'RESUMED' ? 'res' : 'def' } });
            resp.letter = { ...letter, academicYear, student: resp?.student };

            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postDeferment(req: Request, res: Response) {
      try {
         const { indexno, sessionId, semesterNum, reason, durationInYears, start, end, letterDate } = req.body;
         const resp = await ais.activityDefer.create({
            data: {
               semesterNum: Number(semesterNum),
               reason,
               durationInYears: Number(durationInYears),
               start,
               end,
               letterDate,
               ...indexno && ({ student: { connect: { indexno } } }),
               ...sessionId && ({ session: { connect: { id: sessionId } } }),
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateDeferment(req: Request, res: Response) {
      try {
         let { indexno, sessionId, semesterNum, reason, durationInYears, status, start, end, letterDate } = req.body;
         delete req.body.indexno;
         delete req.body.sessionId;

         let deferStatus = status == 'APPROVED' ? true : false;
         start = ['APPROVED', 'RESUMED'].includes(status) ? (start != null ? start : new Date()) : null;
         end = ['RESUMED'].includes(status) ? (end != null ? end : new Date()) : null;

         const resp = await ais.activityDefer.update({
            where: { id: paramStr(req.params.id) },
            data: {
               semesterNum: Number(semesterNum),
               reason,
               durationInYears: Number(durationInYears),
               status,
               start,
               end,
               letterDate,
               ...indexno && ({ student: { connect: { indexno } } }),
               ...sessionId && ({ session: { connect: { id: sessionId } } }),
            }
         })
         if (resp) {
            // Update Student Status
            await ais.student.update({ where: { indexno }, data: { deferStatus } })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async upgradeDeferment(req: Request, res: Response) {
      try {
         let { indexno, status } = req.body;
         let deferStatus = status == 'APPROVED' ? true : false;
         let start = ['APPROVED'].includes(status) ? new Date() : null;
         let end = ['RESUMED'].includes(status) ? new Date() : null;

         const resp = await ais.activityDefer.update({
            where: { id: paramStr(req.params.id) },
            data: {
               status,
               ...end && ({ end }),
               ...start && ({ start }),
            }
         })
         if (resp) {
            // Update Student Status
            await ais.student.update({ where: { indexno }, data: { deferStatus } })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteDeferment(req: Request, res: Response) {
      try {
         const resp = await ais.activityDefer.delete({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }



   /* Service Letters */
   async fetchLetters(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { tag: { contains: keyword } },
                  { title: { contains: keyword } },
               ],
            }
         }
         const resp = await ais.$transaction([
            ais.letter.count({
               ...(searchCondition),
            }),
            ais.letter.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
            })
         ]);

         //if(resp && resp[1]?.length){
         res.status(200).json({
            totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
            totalData: resp[1]?.length,
            data: resp[1],
         })
         //} else {
         //res.status(202).json({ message: `no records found` })
         //}
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchLetterList(req: Request, res: Response) {
      try {
         const resp = await ais.letter.findMany({
            where: { status: true },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchLetter(req: Request, res: Response) {
      try {
         const resp = await ais.letter.findFirst({
            where: {
               OR: [
                  { id: paramStr(req.params.id) },
                  { tag: paramStr(req.params.id) },
               ]
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postLetter(req: Request, res: Response) {
      try {

         const resp = await ais.letter.create({
            data: {
               ...req.body,
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateLetter(req: Request, res: Response) {
      try {
         const resp = await ais.letter.update({
            where: {
               id: paramStr(req.params.id)
            },
            data: {
               ...req.body,
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteLetter(req: Request, res: Response) {
      try {
         const resp = await ais.letter.delete({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }




   /* Transwift  */
   async fetchTranswifts(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
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
         }
         const resp = await ais.$transaction([
            ais.transwift.count({
               ...(searchCondition),
            }),
            ais.transwift.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
               orderBy: { 'createdAt': 'desc' },
               include: {
                  student: { include: { program: true } },
                  issuer: true,
                  transact: { include: { transtype: true } }
               }
            })
         ]);

         //if(resp && resp[1]?.length){
         res.status(200).json({
            totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
            totalData: resp[1]?.length,
            data: resp[1],
         })
         //} else {
         //res.status(202).json({ message: `no records found` })
         //}
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchTranswiftList(req: Request, res: Response) {
      try {
         const resp = await ais.transwift.findMany({
            where: { status: true },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchTranswiftByStudent(req: Request, res: Response) {
      try {
         const resp = await ais.transwift.findMany({
            where: { studentId: paramStr(req.params.id) },
            include: {
               student: { include: { program: true } },
               transact: { include: { transtype: true } }
            },
            orderBy: { 'createdAt': 'desc' }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchTranswift(req: Request, res: Response) {
      try {
         const resp = await ais.transwift.findUnique({
            where: { id: paramStr(req.params.id) },
            include: {
               student: { include: { program: true } },
               issuer: true,
               transact: { include: { transtype: true } }
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postTranswift(req: Request, res: Response) {
      try {

         const resp = await ais.transwift.create({
            data: {
               ...req.body,
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async upgradeTranswift(req: Request, res: Response) {
      try {
         const { } = req.body;
         const resp = await ais.transwift.update({
            where: { id: paramStr(req.params.id) },
            data: {
               ...req.body,
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   async updateTranswift(req: Request, res: Response) {
      try {
         const resp = await ais.transwift.update({
            where: {
               id: paramStr(req.params.id)
            },
            data: {
               ...req.body,
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteTranswift(req: Request, res: Response) {
      try {
         const resp = await ais.transwift.delete({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }



   /* Evaluations */
   async fetchEvaluations(req: Request, res: Response) {
      const { page = 1, pageSize = 10, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      try {
         let searchCondition: any = {};

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

         const resp = await ais.$transaction([
            ais.courseEvaluation.groupBy({
               by: ['sessionId', 'indexno'],
               _count: {
                  indexno: true
               },
               ...(searchCondition)
            }),
            ais.courseEvaluation.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
               include: {
                  student: { include: { program: true } },
                  session: true,
               },
               distinct: ['sessionId', 'indexno'],
               orderBy: { createdAt: 'desc' }
            })
         ]);

         console.log('Evals: ', resp[0].length);

         if (resp && resp[1]?.length) {
            console.log('Evals: ', resp);
            res.status(200).json({
               totalPages: Math.ceil(resp[0] / pageSize) || 0,
               totalData: resp[1]?.length,
               data: resp[1]
            });
         } else {
            res.status(204).json({ message: "No evaluations found" });
         }
      } catch (error: any) {
         console.log(error);
         return res.status(500).json({ message: error.message });
      }
   }





   /* App Roles */

   async fetchARoleList(req: Request, res: Response) {
      try {
         const resp = await ais.appRole.findMany({
            where: { status: true },
            include: {
               app: { select: { title: true } }
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   /* User Roles */

   async fetchURoleList(req: Request, res: Response) {
      try {
         const { staffId } = req.body
         const resp = await ais.userRole.findMany({
            where: { user: { tag: staffId.toString() } },
            include: { appRole: { select: { title: true, app: true } } }
         })
         if (resp?.length) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json(error)
      }
   }


   async fetchURoles(req: Request, res: Response) {
      const { page = 1, pageSize = 6, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { title: { contains: keyword } },
                  { id: { contains: keyword } },
               ],
            },
            include: {
               level1: { select: { title: true, code: true } }
            },
         }
         const resp = await ais.$transaction([
            ais.userRole.count({
               ...(searchCondition),
            }),
            ais.userRole.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
            })
         ]);

         if (resp && resp[1]?.length) {
            res.status(200).json({
               totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
               totalData: resp[1]?.length,
               data: resp[1],
            })
         } else {
            res.status(202).json({ message: `no records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   async fetchURole(req: Request, res: Response) {
      try {
         const resp = await ais.userRole.findUnique({
            where: {
               id: Number(paramStr(req.params.id))
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postURole(req: Request, res: Response) {
      try {
         const { appRoleId, staffNo } = req.body
         delete req.body.appRoleId; delete req.body.staffNo;
         let allowRole = true; let resp;

         const user = await ais.user.findFirst({ where: { tag: staffNo.toString() } })
         const uroles = await ais.userRole.findMany({ where: { userId: user?.id }, include: { appRole: { select: { app: true } } } })
         const urole = await ais.appRole.findFirst({ where: { id: Number(appRoleId) }, include: { app: true } })

         if (uroles.length && uroles.find((r: any) => [urole?.app?.tag].includes(r?.appRole?.app?.tag))) allowRole = false;
         if (!allowRole) throw (`Privilege exists for app`)

         resp = await ais.userRole.create({
            data: {
               ...req.body,
               ...appRoleId && ({ appRole: { connect: { id: Number(appRoleId) } } }),
               ...user && ({ user: { connect: { id: user?.id } } }),
            },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateURole(req: Request, res: Response) {
      try {
         const resp = await ais.userRole.update({
            where: {
               id: Number(paramStr(req.params.id))
            },
            data: {
               ...req.body,
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteURole(req: Request, res: Response) {
      try {
         const resp = await ais.userRole.delete({
            where: { id: Number(paramStr(req.params.id)) }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async checkUser(req: Request, res: Response) {
      try {
         const { userId } = req.body
         const resp = await ais.user.findFirst({ where: { tag: userId?.toString() } })
         res.status(200).json(!!resp)

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }



   /* Staff */
   async fetchStaffs(req: Request, res: Response) {
      const { page = 1, pageSize = 6, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { staffNo: { contains: keyword } },
                  { fname: { contains: keyword } },
                  { lname: { contains: keyword } },
                  { phone: { contains: keyword } },
                  { email: { contains: keyword } },
               ],
            }
         }
         const resp = await ais.$transaction([
            ais.staff.count({
               ...(searchCondition),
            }),
            ais.staff.findMany({
               ...(searchCondition),
               skip: offset,
               take: Number(pageSize),
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
            })
         ]);

         if (resp && resp[1]?.length) {
            res.status(200).json({
               totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
               totalData: resp[1]?.length,
               data: resp[1],
            })
         } else {
            res.status(202).json({ message: `no records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchStaff(req: Request, res: Response) {
      try {
         const resp = await ais.staff.findUnique({
            where: {
               staffNo: paramStr(req.params.id)
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
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async stageStaff(req: Request, res: Response) {
      try {
         const { staffId } = req.body;
         const password = pwdgen();
         const st = await ais.staff.findFirst({ where: { staffNo: staffId.toString() } })
         const isUser = await ais.user.findFirst({ where: { tag: staffId.toString(), groupId: 2 } })
         if (isUser) throw ("Staff User Account Exists!")
         const ssoData = { tag: staffId.toString(), username: st?.instituteEmail ? st?.instituteEmail.trim() : staffId.toString(), password: sha1(password) }  // Others
         // Populate SSO Account
         const resp = await ais.user.create({
            data: {
               ...ssoData,
               group: { connect: { id: 2 } },
            },
         })
         if (resp) {
            // Send Password By SMS
            if (st?.phone) await sms(st?.phone, `Hi! Your new credentials are Username: ${st?.instituteEmail ?? staffId}, Password: ${password}`)
            // Send Password By Email
            res.status(200).json({ ...resp, password })
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json(error)
      }
   }

   async resetStaff(req: Request, res: Response) {
      try {
         const { staffId } = req.body
         const password = pwdgen();
         const st = await ais.staff.findFirst({ where: { staffNo: staffId.toString() } })
         const resp = await ais.user.updateMany({
            where: { tag: staffId.toString(), groupId: 2 },
            data: { password: sha1(password) },
         })
         if (resp?.count) {
            if (st?.phone) await sms(st?.phone, `Hi! Your credentials are Username: ${st?.instituteEmail ?? staffId}, Password: ${password}`)
            res.status(200).json({ password })
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json(error)
      }
   }

   async staffRole(req: Request, res: Response) {
      try {
         const { staffId } = req.body
         const resp = await ais.userRole.findMany({
            where: { user: { tag: staffId.toString() } },
            include: { appRole: { select: { title: true, app: true } } }
         })
         if (resp?.length) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json(error)
      }
   }

   async changeStaffPhoto(req: Request, res: Response) {
      try {
         const { staffId } = req.body
         const password = pwdgen();
         const resp = await ais.user.updateMany({
            where: { tag: staffId },
            data: { password: sha1(password) },
         })
         if (resp) {
            res.status(200).json({ password })
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json(error)
      }
   }


   async postStaff(req: Request, res: Response) {
      try {
         const st = await ais.staff.findFirst({ where: { staffNo: { notIn: ['16000', '15666'] } }, orderBy: { 'staffNo': 'desc' } });
         const { titleId, maritalId, countryId, regionId, religionId, unitId, jobId } = req.body
         req.body.staffNo = req.body.staffNo ? req.body.staffNo?.toString() : (parseInt(st.staffNo) + 1).toString();
         delete req.body.titleId; delete req.body.maritalId;
         delete req.body.countryId; delete req.body.regionId;
         delete req.body.religionId; delete req.body.unitId;
         delete req.body.jobId;
         req.body.exitDate = req.body.exitDate ? moment(req.body.exitDate).toDate() : null;
         req.body.phone = req.body.phone ? req.body.phone : null;
         req.body.email = req.body.email ? req.body.email : null;
         req.body.ssnitNo = req.body.ssnitNo ? req.body.ssnitNo : null;
         req.body.ghcardNo = req.body.ghcardNo ? req.body.ghcardNo : null;

         const resp = await ais.staff.create({
            data: {
               ...req.body,
               ...maritalId && ({ marital: { connect: { id: maritalId } } }),
               ...titleId && ({ title: { connect: { id: titleId } } }),
               ...countryId && ({ country: { connect: { id: countryId } } }),
               ...regionId && ({ region: { connect: { id: regionId } } }),
               ...religionId && ({ religion: { connect: { id: religionId } } }),
               ...unitId && ({ unit: { connect: { id: unitId } } }),
               ...jobId && ({ job: { connect: { id: jobId } } }),
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateStaff(req: Request, res: Response) {
      try {
         const st = await ais.staff.findFirst({ where: { staffNo: { notIn: ['16000', '15666'] } }, orderBy: { 'staffNo': 'desc' } });
         const { titleId, maritalId, countryId, regionId, religionId, unitId, jobId, instituteEmail } = req.body
         delete req.body.titleId; delete req.body.maritalId;
         delete req.body.countryId; delete req.body.regionId;
         delete req.body.religionId; delete req.body.unitId;
         delete req.body.jobId; //   
         req.body.staffNo = req.body.staffNo > 0 ? req.body.staffNo?.toString() : (parseInt(st?.staffNo) + 1).toString();
         req.body.exitDate = req.body.exitDate ? moment(req.body.exitDate).toDate() : null;
         req.body.phone = req.body.phone ? req.body.phone : null;
         req.body.email = req.body.email ? req.body.email : null;
         req.body.ssnitNo = req.body.ssnitNo ? req.body.ssnitNo : null;
         req.body.ghcardNo = req.body.ghcardNo ? req.body.ghcardNo : null;



         const resp = await ais.staff.update({
            where: { staffNo: paramStr(req.params.id) },
            data: {
               ...req.body,
               ...maritalId && ({ marital: { connect: { id: maritalId } } }),
               ...titleId && ({ title: { connect: { id: titleId } } }),
               ...countryId && ({ country: { connect: { id: countryId } } }),
               ...regionId && ({ region: { connect: { id: regionId } } }),
               ...religionId && ({ religion: { connect: { id: religionId } } }),
               ...unitId && ({ unit: { connect: { id: unitId } } }),
               ...jobId && ({ job: { connect: { id: jobId } } }),
            }
         })
         if (resp) {
            if (paramStr(req.params.id) != req.body.staffNo) {
               // Update SSO User with New (Tag/Username)
               await ais.user.updateMany({ where: { tag: paramStr(req.params.id), groupId: 2 }, data: { tag: req.body.staffNo, username: instituteEmail ? instituteEmail : req.body.staffNo?.toString() } });
               // Update Photo FileName
               const tag = paramStr(req.params.id)?.toString().split("/").join("").trim().toLowerCase();
               const dtag = req.body.staffNo.split("/").join("").trim().toLowerCase();
               var file = path.join(__dirname, "/../../public/cdn/photo/staff/", tag + '.jpg');
               var dfile = path.join(__dirname, "/../../public/cdn/photo/staff/", dtag + '.jpg');
               var stats = fs.statSync(file);
               if (stats) fs.renameSync(file, dfile);

            } else {
               // Update Email as tag in sso_user
               if (instituteEmail) await ais.user.updateMany({ where: { tag: paramStr(req.params.id) }, data: { username: instituteEmail } });
            }
            // Return Response
            res.status(200).json(resp)

         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteStaff(req: Request, res: Response) {
      try {
         // Remove User Account
         await ais.user.deleteMany({ where: { tag: paramStr(req.params.id) } })
         // Hard Delete Staff Record
         const resp = await ais.staff.delete({ where: { staffNo: paramStr(req.params.id) } })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   /* Helpers */
   async fetchCountries(req: Request, res: Response) {
      try {
         const resp = await ais.country.findMany({
            where: { status: true },
            orderBy: { createdAt: 'asc' }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchRegions(req: Request, res: Response) {
      try {
         const resp = await ais.region.findMany({
            where: { status: true },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchReligions(req: Request, res: Response) {
      try {
         const resp = await ais.religion.findMany({
            where: { status: true },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchDisabilities(req: Request, res: Response) {
      try {
         const resp = await ais.disability.findMany({
            where: { status: true },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchCategories(req: Request, res: Response) {
      try {
         const resp = await ais.category.findMany({
            where: { status: true },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchRelations(req: Request, res: Response) {
      try {
         const resp = await ais.relation.findMany({
            where: { status: true },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchMarital(req: Request, res: Response) {
      try {
         const resp = await ais.marital.findMany({
            where: { status: true },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchTitles(req: Request, res: Response) {
      try {
         const resp = await ais.title.findMany({
            where: { status: true },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchVendors(req: Request, res: Response) {
      try {
         const resp = await ais.vendor.findMany({
            where: { status: true },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchCollectors(req: Request, res: Response) {
      try {
         const resp = await ais.collector.findMany()
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchAppRoles(req: Request, res: Response) {
      try {
         const resp = await ais.appRole.findMany()
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }










   async runData(req: Request, res: Response) {
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
            res.status(200).json(vouchers)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async runAccount(req: Request, res: Response) {
      try {
         let resp = [];
         const students = await ais.student.findMany();
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
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   async academicStatus(req: Request, res: Response) {
      try {
         const id = paramStr(req.params.id);
         // Get Student Info
         const student: any = await ais.student.findUnique({ include: { program: { select: { schemeId: true, hasMajor: true } } }, where: { id } })
         const indexno = student?.indexno;
         // Get Active Sessions Info
         const sessions: any = await ais.session.findMany({ where: { default: true } })
         const session: any = sessions.find((row: any) => {
            const streamTag = (moment(student?.entryDate).format("MM") == '01' && ((student?.entrySemesterNum == 1 && ['1', '2'].includes(student?.semesterNum)) || (student?.entrySemesterNum == 3 && ['3', '4'].includes(student?.semesterNum)))) ? 'SUB' : 'MAIN';
            return row?.tag?.toUpperCase() == streamTag;
         });

         const assessment: any = await ais.assessment.findFirst({ where: { sessionId: id, indexno } });

         const events: any = {
            'medicals': { start: session.medicalStart, end: session.medicalEnd },
            'orientation': { start: session.orientStart, end: session.orientEnd },
            'matriculation': { start: session.matriculateStart, end: session.matriculateStart },
            'registration': { start: session.registerStart, end: session.registerEndLate },
            'examination': { start: session.examStart, end: session.examEnd },
            'evaluation': { start: session.evaluationStart, end: session.evaluationEnd },
         }

         const event = Object.entries(events).find(([title, row]: any) => moment(new Date()).isBetween(moment(row?.start), moment(row?.end)));
         return res.status(200).json({ success: true, data: { student, session, events, event, isRegistered: !!assessment } })

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async nextClass(req: Request, res: Response) {
      try {
         let resp = [];
         const students = await ais.student.findMany();

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }






}