import { Request, Response } from "express";
import { db } from "../drizzle/mysqlAdapter";
import { eq, and, or, inArray, gt, sql, asc, desc, ne, count, like, isNotNull } from "drizzle-orm";
import { 
   election, activityRegister, activityDefer, 
   student, session, program, major, 
   category,
   staff,
   resit,
   log,
   assessment,
   studentAccount,
   user
} from "../drizzle/schema"; // Update paths to your schema
import { redisClient } from "../config/redis"; 
import { getGrade, getGradePoint } from "../util/helper";
import { paramStr } from "../util/paramStr";
import moment from "moment";
const sha1 = require('sha1');
const { customAlphabet } = require("nanoid");
const pwdgen = customAlphabet("1234567890abcdefghijklmnopqrstuvwzyx", 6);
const sms = require('../config/sms');
const ExcelJS = require('exceljs');
const CACHE_TTL = 3600; // 1 hour

export default class AisController {

   // Helper to handle Redis caching
   async getOrSetCache(key: string, cb: () => Promise<any>) {
      const cachedData = await redisClient.get(key);
      if (cachedData) return JSON.parse(cachedData);
      const freshData = await cb();
      if (freshData) {
         await redisClient.setEx(key, CACHE_TTL, JSON.stringify(freshData));
      }
      return freshData;
   }

   async fetchTest(req: Request, res: Response) {
      try {
         const tag = '24010001';
         const cacheKey = `test_election_${tag}`;

         const resp = await this.getOrSetCache(cacheKey, async () => {
            // Using JSON_CONTAINS for MySQL JSON array search
            return await db.select().from(election).where(
               sql`JSON_CONTAINS(voterData, JSON_OBJECT('tag', ${tag}), '$')`
            );
         });

         if (resp?.length) {
            res.status(200).json(resp);
         } else {
            res.status(202).json({ message: `no record found` });
         }
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      }
   }

   async loadReport(req: Request, res: Response) {
      try {
         const { type, program: pId, major: mId, year, mode } = req.body;
         const cacheKey = `report:${type}:${JSON.stringify(req.body)}`;
         
         const result = await this.getOrSetCache(cacheKey, async () => {
            let data: any[] = [];

            if (type === 'student_registration') {
               const yearFilters = year ? [Number(year) * 2, (Number(year) * 2) - 1] : null;

               const regs = await db.query.activityRegister.findMany({
                  where: (table, { and, eq, inArray }) => and(
                     // join logic handled by findMany with relations
                     sql`${table.sessionId} IN (SELECT id FROM session WHERE \`default\` = true)`,
                     pId ? eq(sql`student.programId`, pId) : undefined,
                     yearFilters ? inArray(table.semesterNum, yearFilters) : undefined,
                  ),
                  with: {
                     student: { with: { program: true, major: true } },
                     session: true
                  },
                  orderBy: [asc(activityRegister.createdAt)]
               });

               data = regs.map(r => ({
                  'LAST NAME': r.student?.lname?.toUpperCase(),
                  'FIRST NAME': r.student?.fname?.toUpperCase(),
                  'INDEX NUMBER': r.student?.indexno,
                  'YEAR': Math.ceil(r.semesterNum / 2),
                  'PROGRAM': r.student?.program?.shortName,
                  'REGISTRATION DATE': r.createdAt
               }));
            }

            if (type === 'student_debtor') {
               const regs = await db.query.student.findMany({
                  where: (table, { and, eq, gt, inArray }) => and(
                     gt(table.accountNet, 0),
                     pId ? eq(table.programId, pId) : undefined,
                     mId ? eq(table.majorId, mId) : undefined,
                     year ? inArray(table.semesterNum, [Number(year)*2, (Number(year)*2)-1]) : undefined
                  ),
                  with: { program: true, major: true },
                  orderBy: [asc(student.lname)]
               });

               data = regs.map(r => ({
                  'LAST NAME': r.lname?.toUpperCase(),
                  'INDEX NUMBER': r.indexno,
                  'STUDENT ACCOUNT NET': r.accountNet,
                  'PROGRAM': r.program?.shortName
               }));
            }

            if (type === 'exam_eligible') {
               const yearFilters = year ? [Number(year) * 2, (Number(year) * 2) - 1] : null;
               
               const regs = await db.query.student.findMany({
                  where: (table, { and, or, eq, inArray, lte }) => and(
                     or(lte(table.accountNet, 0), 
                     eq(table.flagPardon, 1)),
                     eq(table.completeStatus, 1),
                     pId ? eq(table.programId, pId) : undefined,
                     mId ? eq(table.majorId, mId) : undefined,
                     mode ? eq(table.studyMode, mode) : undefined,
                     yearFilters ? inArray(table.semesterNum, yearFilters) : undefined
                  ),
                  with: { program: true, major: true },
                  orderBy: [desc(student.programId), asc(student.lname)]
               });

               data = regs.map((r:any) => ({
                  'LAST NAME': r.lname?.toUpperCase(),
                  'INDEX NUMBER': r.indexno,
                  'YEAR': Math.ceil(r.semesterNum / 2),
                  'PROGRAM': r.program?.shortName,
                  'STATUS': r.deferStatus === 1 ? 'DEFERRED' : 'ACTIVE',
               }));

            } else if (type === 'resit') {
               const regs = await db.query.resit.findMany({
                  where: (table, { or, sql }) => or(
                     sql`${table.sessionId} IN (SELECT id FROM session WHERE \`default\` = true)`,
                     sql`${table.trailSessionId} IN (SELECT id FROM session WHERE \`default\` = true)`
                  ),
                  with: { 
                     course: true, 
                     student: { with: { program: true, major: true } } 
                  },
                  orderBy: [asc(sql`student.lname`)]
               });

               data = regs.map(r => ({
                  'LAST NAME': r.student?.lname?.toUpperCase(),
                  'INDEX NUMBER': r.student?.indexno,
                  'COURSE': `${r.course?.title} - ${r.course?.id}`,
                  'PAYMENT STATUS': r.paid ? 'YES' : 'NO',
               }));

            } else if (type === 'staff') {
               const regs = await db.query.staff.findMany({
                  where: (table, { eq, sql }) => category 
                     ? sql`${table.unitId} IN (SELECT id FROM unit WHERE type = ${category})` 
                     : undefined,
                  with: { job: true, unit: true },
                  orderBy: [asc(staff.staffNo)]
               });

               data = regs.map(r => ({
                  'LAST NAME': r.lname?.toUpperCase(),
                  'STAFF NUMBER': r.staffNo,
                  'UNIT': r.unit?.title?.toUpperCase(),
                  'DESIGNATION': r.job?.title?.toUpperCase(),
               }));
            }

            return { type, data };
         });

         res.status(200).json(result);
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      }
   }



   /* Dashboard & Statistics with Redis */
   async loadDashboard(req: Request, res: Response) {
      try {
         const cacheKey = "dashboard_stats";
         
         const stats = await this.getOrSetCache(cacheKey, async () => {
            // 1. Get Default Sessions
            const activeSessions = await db.query.session.findMany({
               where: eq(session.default, 1)
            });

            // 2. Academic Session Statistics
            const academic = await Promise.all(activeSessions.map(async (s) => {
               // Registered Count
               const regCount = await db.select({ count: sql<number>`count(*)` })
                  .from(activityRegister)
                  .where(eq(activityRegister.sessionId, s.id));

               // Unregistered - Direct SQL for complex date/subquery logic
               const unregQuery = s.tag === 'MAIN' 
                  ? sql`SELECT count(id) as count FROM ais_student WHERE (DATE_FORMAT(entryDate,'%m') = '09' OR (DATE_FORMAT(entryDate,'%m') = '01' AND ((entrySemesterNum = 1 AND semesterNum > 2) OR (entrySemesterNum = 3 AND semesterNum > 4)))) AND completeStatus = 0 AND deferStatus = 0 AND indexno NOT IN (SELECT indexno FROM ais_activity_register WHERE sessionId = ${s.id})`
                  : sql`SELECT count(id) as count FROM ais_student WHERE DATE_FORMAT(entryDate,'%m') = '01' AND ((entrySemesterNum = 1 AND semesterNum < 3) OR (entrySemesterNum = 3 AND semesterNum < 5)) AND completeStatus = 0 AND deferStatus = 0 AND indexno NOT IN (SELECT indexno FROM ais_activity_register WHERE sessionId = ${s.id})`;
               
               const unregCount: any = await db.execute(unregQuery);

               return {
                  label: `${s.title} - ${s.tag}`,
                  register: regCount[0].count,
                  unregister: unregCount[0][0]?.count || 0
               };
            }));

            // 3. Resit Statistics
            const resitStats = await db.select({ 
               reg_resit: sql<number>`count(CASE WHEN registeredAt IS NOT NULL AND taken = 0 THEN 1 END)`,
               all_resit: sql<number>`count(CASE WHEN sessionId IS NULL THEN 1 END)`
            }).from(resit);

            return { academic, resitStats: resitStats[0] };
         });

         res.status(200).json(stats);
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      }
   }



   // Helper to clear session-related cache
   async clearSessionCache() {
      const keys = await redisClient.keys('sessions:*');
      if (keys.length > 0) await redisClient.del(keys);
      await redisClient.del('dashboard_stats_full');
   }

   async fetchSessionList(req: Request, res: Response) {
      try {
         const cacheKey = 'sessions:list_active';
         const cached = await redisClient.get(cacheKey);
         if (cached) return res.status(200).json(JSON.parse(cached));

         const resp = await db.query.session.findMany({
            where: eq(session.status, 1),
            orderBy: [desc(session.createdAt)]
         });

         await redisClient.setEx(cacheKey, 3600, JSON.stringify(resp));
         res.status(200).json(resp);
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      }
   }

   async fetchSessions(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (Number(page) - 1) * Number(pageSize);

      try {
         // Define Search Condition
         const whereClause = keyword 
            ? or(
               like(session.title, `%${keyword}%`), 
               eq(session.id, keyword)
            ) 
            : undefined;

         // Execute count and data fetch in parallel (Transaction equivalent)
         const [totalCountResult, data] = await Promise.all([
            db.select({ value: count() }).from(session).where(whereClause),
            db.query.session.findMany({
               where: whereClause,
               limit: Number(pageSize),
               offset: offset,
               orderBy: [desc(session.createdAt)]
            })
         ]);

         const totalDataCount = totalCountResult[0].value;

         res.status(200).json({
            totalPages: Math.ceil(totalDataCount / Number(pageSize)),
            totalData: data.length,
            data: data,
         });
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      }
   }

   async fetchSession(req: Request, res: Response) {
      try {
         const resp = await db.query.session.findFirst({
            where: eq(session.id, paramStr(req.params.id))
         });

         if (resp) {
            res.status(200).json(resp);
         } else {
            res.status(202).json({ message: `no record found` });
         }
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      }
   }

   async activateSession(req: Request, res: Response) {
      try {
         const { sessionId } = req.body;
         const targetSession:any = await db.query.session.findFirst({
            where: eq(session.id, sessionId)
         });
         if (!targetSession) return res.status(202).json({ message: "Session not found" });

         await db.transaction(async (tx) => {
            await tx.update(session)
               .set({ default: 0 })
               .where(and(
                  ne(session.id, sessionId),
                  eq(session.tag, targetSession.tag)));

            await tx.update(session)
               .set({ default: 1 })
               .where(eq(session.id, sessionId));
         });

         await this.clearSessionCache();
         res.status(200).json({ message: "Session activated" });
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      }
   }

   async postSession(req: Request & any, res: Response) {
      try {
         const [newSession] = await db.insert(session).values(req.body);
         // Logging
         await db.insert(log).values({
            action: `CALENDAR_CREATED`,
            user: req?.userId,
            meta: JSON.stringify(req.body)
         } as any);

         await this.clearSessionCache();
         res.status(200).json(newSession);
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      }
   }

   async updateSession(req: Request & any, res: Response) {
      try {
         await db.update(session)
            .set(req.body)
            .where(eq(session.id, paramStr(req.params.id)));

         await db.insert(log).values({
            action: `CALENDAR_UPDATED`,
            user: req?.userId,
            meta: JSON.stringify(req.body)
         } as any);

         await this.clearSessionCache();
         res.status(200).json({ message: "Updated successfully" });
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      }
   }

   async deleteSession(req: Request & any, res: Response) {
      try {
         await db.delete(session).where(eq(session.id, paramStr(req.params.id)));

         await db.insert(log).values({
            action: `CALENDAR_DELETED`,
            user: req?.userId,
            meta: JSON.stringify({ id: paramStr(req.params.id) })
         } as any);

         await this.clearSessionCache();
         res.status(200).json({ message: "Deleted successfully" });
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      }
   }

   /* Student List with Pagination */
   async fetchStudents(req: Request, res: Response) {
      const { page = 1, pageSize = 6, keyword = '' }: any = req.query;
      const offset = (Number(page) - 1) * Number(pageSize);

      try {
         const whereClause = keyword ? or(
            like(student.fname, `%${keyword}%`),
            like(student.lname, `%${keyword}%`),
            like(student.id, `%${keyword}%`),
            like(student.phone, `%${keyword}%`),
            like(student.email, `%${keyword}%`),
            like(student.indexno, `%${keyword}%`)
         ) : undefined;

         // Parallel execution for count and data
         const [totalCountResult, data] = await Promise.all([
            db.select({ value: count() }).from(student).where(whereClause),
            db.query.student.findMany({
               where: whereClause,
               limit: Number(pageSize),
               offset: offset,
               with: {
                  title: true,
                  // country: true,
                  region: true,
                  religion: true,
                  disability: true,
                  program:  true ,
                  // program: { with: { department: true } },
               },
               orderBy: [asc(student.completeStatus), asc(student.semesterNum)]
            })
         ]);

         res.status(200).json({
            totalPages: Math.ceil(totalCountResult[0].value / Number(pageSize)),
            totalData: data.length,
            data: data,
         });
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      }
   }

   /* Single Student Profile */
   async fetchStudent(req: Request, res: Response) {
      try {
         const resp = await db.query.student.findFirst({
            where: eq(student.id, paramStr(req.params.id)),
            with: {
               title: true,
               // country: true,
               region: true,
               religion: true,
               disability: true,
               program: true,
               major: true,
            }
         });

         if (resp) res.status(200).json(resp);
         else res.status(202).json({ message: `no record found` });
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      }
   }

   /* Transcript Logic with Heavy Caching */
   async fetchStudentTranscript(req: Request, res: Response) {
      try {
         const studentIdOrIndex = paramStr(req.params.id);
         const cacheKey = `transcript:${studentIdOrIndex}`;
         
         const cachedTranscript = await redisClient.get(cacheKey);
         if (cachedTranscript) return res.status(200).json(JSON.parse(cachedTranscript));

         const st = await db.query.student.findFirst({
            where: or(
               and(isNotNull(student.indexno), eq(student.id, studentIdOrIndex)),
               eq(student.indexno, studentIdOrIndex)
            ),
            with: { program: true }
         });

         if (!st || !st.indexno) throw new Error("No valid student or index number found");

         const assessments = await db.query.assessment.findMany({
            where: eq(assessment.indexno, st.indexno),
            with: {
               scheme: true,
               session: true,
               course: true,
            },
            orderBy: [asc(sql`session.createdAt`)]
         });

         // 3. Process Transcript Data
         const mdata = new Map();
         for (const sv of assessments) {
            const sessionTitle = sv.session?.title ?? 'none';
            const grades = sv.scheme?.gradeMeta;
            
            const processedEntry = {
               ...sv,
               student: st,
               grade: await getGrade(sv.totalScore, grades),
               gradepoint: await getGradePoint(sv.totalScore, grades),
               classes: sv.scheme?.classMeta
            };

            if (mdata.has(sessionTitle)) {
               mdata.get(sessionTitle).push(processedEntry);
            } else {
               mdata.set(sessionTitle, [processedEntry]);
            }
         }

         const finalData = Array.from(mdata);
         // Cache for 24 hours (transcripts don't change often)
         await redisClient.setEx(cacheKey, 86400, JSON.stringify(finalData));
         return res.status(200).json(finalData);
         
      } catch (error: any) {
         return res.status(202).json({ message: error.message });
      }
   }

   /* Finance Records */
   async fetchStudentFinance(req: Request, res: Response) {
      try {
         const resp = await db.query.studentAccount.findMany({
            where: eq(studentAccount.studentId, paramStr(req.params.id)),
            with: {
               student: { with: { program: true } },
               bill: true,
               charge: true,
               session: true,
               transaction: true,
            }
         });

         if (resp.length) res.status(200).json(resp);
         else res.status(202).json({ message: `no record found` });
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      }
   }


   async fetchStudentActivity(req: Request, res: Response) {
      try {
         const resp = await db.query.student.findFirst({
            where: eq(student.id, paramStr(req.params.id)),
            with: {
               // country: true,
               program: true, // select: { longName: true } handled via schema config or manual mapping
            },
         });
         
         if (resp) res.status(200).json(resp);
         else res.status(202).json({ message: `no record found` });
      } catch (error: any) {
         res.status(500).json({ message: error.message });
      }
   }

   async stageStudent(req: Request & any, res: Response) {
      try {
         const { studentId } = req.body;
         const password = pwdgen();
         
         const isUser = await db.query.user.findFirst({ where: eq(user.tag, studentId) });
         if (isUser) throw new Error("Student Portal Account Exists!");

         const ssoData:any = { 
            tag: studentId, 
            username: studentId, 
            password: sha1(password), 
            unlockPin: password,
            groupId: 1 // Assuming groupId replaces group: { connect: { id: 1 } }
         };

         const [resp] = await db.insert(user).values(ssoData);

         if (resp) {
            const st = await db.query.student.findFirst({ where: eq(student.id, studentId) });
            if (st?.phone) {
               await sms(st.phone, `Hi! Your new credentials is username: ${st.instituteEmail ?? studentId}, password: ${password}`);
            }
            
            await db.insert(log).values({ action: `STUDENT_ACCOUNT_STAGED`, user: req?.userId, meta: JSON.stringify(ssoData) } as any);
            
            // Invalidate student profile cache
            await redisClient.del(`student_profile:${studentId}`);
            res.status(200).json(resp);
         } else {
            res.status(202).json({ message: `no records found` });
         }
      } catch (error: any) {
         res.status(500).json({ message: error instanceof Error ? error.message : error });
      }
   }

   async generateIndex(req: Request & any, res: Response) {
      try {
         const { studentId } = req.body;
         let indexno = "";

         const st = await db.query.student.findFirst({
            where: eq(student.id, studentId),
            with: { program: true },
         });

         if (!st) throw new Error("Student not found");
         if (st.indexno) throw new Error("Index number exists for student!");

         // Native SQL for specific Date Formatting (MMYY)
         const dateTag = moment(st.entryDate).format("MMYY");
         const existingStudents = await db.execute(sql`
            SELECT id FROM ais_student 
            WHERE DATE_FORMAT(entryDate, '%m%y') = ${dateTag} 
            AND programId = ${st.programId} 
            AND indexno IS NOT NULL 
            AND semesterNum = entrySemesterNum
         `);

         const students: any = existingStudents[0];
         let studentCount = (students?.length || 0) + 1;
         let loop = true;

         while (loop) {
            const countStr = studentCount.toString().padStart(4, '0');
            indexno = `${st.program?.prefix}${dateTag}${countStr}`;

            const ck = await db.query.student.findFirst({ where: eq(student.indexno, indexno) });
            if (ck) studentCount++;
            else loop = false;
         }

         await db.update(student).set({ indexno }).where(eq(student.id, studentId));

         // Notification & Logging
         const msg = `Hi ${st.fname}! Your AUCB Index number has been generated: ${indexno}`;
         if (st.phone) await sms(st.phone, msg);
         
         await db.insert(log).values({ 
            action: `INDEX_NUMBER_GENERATED`, 
            user: req?.userId, 
            meta: JSON.stringify({ indexno }) 
         } as any);

         res.status(200).json({ indexno });
      } catch (error: any) {
         res.status(500).json({ message: error instanceof Error ? error.message : error });
      }
   }

   async generateEmail(req: Request & any, res: Response) {
      try {
         const { studentId } = req.body;
         const st = await db.query.student.findFirst({ where: eq(student.id, studentId) });

         if (st?.instituteEmail) {
            await db.update(user).set({ username: st.instituteEmail }).where(eq(user.tag, studentId));
            throw new Error("mail already exists !");
         }

         let baseUsername = `${st?.fname?.replace(/\s/g, '')}.${st?.lname}`.toLowerCase();
         let isNew = true;
         let countNum = 1;
         let finalUsername = baseUsername;

         while (isNew) {
            let checkEmail = `${finalUsername}${countNum > 1 ? countNum : ''}`;
            const ck = await db.query.student.findFirst({ 
               where: like(student.instituteEmail, `${checkEmail}%`) 
            });
            if (ck) countNum++;
            else {
               finalUsername = checkEmail;
               isNew = false;
            }
         }

         const instituteEmail = `${finalUsername}@${process.env.UMS_MAIL}`;
         
         // Update Database
         await db.transaction(async (tx) => {
            await tx.update(student).set({ instituteEmail }).where(eq(student.id, studentId));
            await tx.update(user).set({ username: instituteEmail }).where(eq(user.tag, studentId));
            await tx.insert(log).values({ 
               action: `STUDENT_EMAIL_GENERATED`, 
               user: req?.userId, 
               meta: JSON.stringify({ instituteEmail }) 
            } as any);
         });

         res.status(200).json({ instituteEmail });
      } catch (error: any) {
         res.status(500).json({ message: error instanceof Error ? error.message : error });
      }
   }




}