import { prisma } from "../prisma/client";
import { Request, Response } from "express";
import moment from "moment";
import { getSemesterFromCode } from "../util/helper";
import { paramStr } from "../util/paramStr";

const sms = require('../config/sms');
const fms = prisma;

export default class FmsController {

   /* Reports */
   async loadReport(req: Request, res: Response) {
      try {
         let { type, program, major, year, mode, session, service, start, end } = req.body;
         let resp: any = { type };

         if (type == 'payments') {

            let regs: any = await fms.$queryRaw`select s.id,s.fname,s.lname,s.mname,s.indexno,s.gender,s.semesterNum,s.studyMode,t.amount,t.currency,t.transtag,t.createdAt,r.title as transtitle from fms_transaction t left join ais_student s on t.studentId = s.id left join fms_transtype r on t.transtypeId = r.id where t.transtypeId = ${service} and (date(t.createdAt) between date(${start}) and date(${end})) order by t.createdAt ASC`;
            if (regs.length) {
               regs = regs.map((r: any) => ({
                  'SERVICE TYPE': r?.transtitle,
                  'LAST NAME': r?.lname,
                  'FIRST NAME': r?.fname,
                  'MIDDLE NAME(S)': r?.mname,
                  'INDEX NUMBER': r?.indexno,
                  'STUDENT ID': r?.id,
                  'GENDER': r?.gender,
                  'YEAR': Math.ceil(r.semesterNum / 2),
                  'AMOUNT': r?.amount,
                  'CURRENCY': r?.currency,
                  'PAID ON': r.createdAt
               }))
               resp = { ...resp, data: regs }
            }

         } else if (type == 'bills') {
            let regs: any = await fms.$queryRaw`select s.id,s.fname,s.lname,s.mname,s.indexno,s.gender,s.semesterNum,s.studyMode,s.entryGroup,t.amount,t.currency,t.createdAt,r.narrative as billtitle from fms_studaccount t left join ais_student s on t.studentId = s.id left join ais_program p on s.programId = p.id left join fms_bill r on t.billId = r.id where s.programId = ${program} and r.sessionId = ${session} order by t.createdAt asc`;

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
               regs = regs.map((r: any) => ({
                  'LAST NAME': r?.lname,
                  'FIRST NAME': r?.fname,
                  'MIDDLE NAME(S)': r?.mname,
                  'INDEX NUMBER': r?.indexno,
                  'STUDENT ID': r?.id,
                  'STUDY MODE': r?.studyMode,
                  'GENDER': r.student?.gender,
                  'YEAR': Math.ceil(r?.semesterNum / 2),
                  'PROGRAM': r?.program?.shortName,
                  'BILL NAME': r.billtitle,
                  'BILL AMOUNT': r?.amount,
                  'BILL CURRENCY': r?.currency,
                  'STUDENT CATEGORY': r?.entryGroup
               }))
               resp = { ...resp, data: regs }
            }

         } else if (type == 'charges') {
            let regs: any = await fms.$queryRaw`select s.id,s.fname,s.lname,s.mname,s.indexno,s.gender,s.semesterNum,s.studyMode,t.amount,t.currency,t.createdAt,t.title as chargetitle from fms_charge t left join ais_student s on t.studentId = s.id left join ais_program p on p.id = s.id where (date(t.createdAt) between date(${start}) and date(${end})) order by t.createdAt ASC`;

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
               regs = regs.map((r: any) => ({
                  'LAST NAME': r?.lname,
                  'FIRST NAME': r?.fname,
                  'MIDDLE NAME(S)': r?.mname,
                  'INDEX NUMBER': r?.indexno,
                  'STUDENT ID': r?.id,
                  'YEAR': Math.ceil(r?.semesterNum / 2),
                  'PROGRAM': r?.shortName,
                  'CHARGE NAME': r.chargetitle,
                  'CHARGE AMOUNT': r?.amount,
                  'CHARGE CURRENCY': r?.currency,
                  'CHARGE DATE': r?.createdAt,
               }))
               resp = { ...resp, data: regs }
            }

         } else if (type == 'debtors') {
            let regs: any = await fms.student.findMany({
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
                  'LAST NAME': r.lname,
                  'FIRST NAME': r.fname,
                  'MIDDLE NAME(S)': r.mname,
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

         } else if (type == 'eligible') {
            let regs: any = await fms.student.findMany({
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
                  'LAST NAME': r.lname,
                  'FIRST NAME': r.fname,
                  'MIDDLE NAME(S)': r.mname,
                  'INDEX NUMBER': r.indexno,
                  'STUDENT ID': r.id,
                  'STUDY MODE': r.studyMode,
                  'GENDER': r.gender,
                  'YEAR': Math.ceil(r.semesterNum / 2),
                  'PROGRAM': r.program?.shortName,
                  'MAJOR': r.major?.shortName,
                  'STATUS': r.deferStatus == 1 ? 'Deferred' : 'Active',
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
         // Academics fees
         const ac_today: any = await fms.$queryRaw`select ifnull(sum(amount),0) as total from fms_transaction t where transtypeId = 2 and date(createdAt) = date(now())`;
         const ac_week: any = await fms.$queryRaw`select ifnull(sum(amount),0) as total from fms_transaction t where transtypeId = 2 and yearweek(createdAt) = yearweek(now())`;
         const ac_month: any = await fms.$queryRaw`select ifnull(sum(amount),0) as total from fms_transaction t where transtypeId = 2 and (month(createdAt) = month(now()) and year(createdAt) = year(now()))`;
         const ac_year: any = await fms.$queryRaw`select ifnull(sum(amount),0) as total from fms_transaction t where transtypeId = 2 and year(createdAt) = year(now())`;

         // Academic Session Statistics
         const types: any = await fms.transtype.findMany({ where: { id: { notIn: [2] } } }); // Transaction Types
         const trans = await Promise.all(types.map(async (s: any) => {
            const label = (s.title?.replaceAll('FEES', '').replaceAll('FEE', ''))?.trim()?.toLowerCase() + ' payments';
            const today: any = await fms.$queryRaw`select ifnull(sum(amount),0) as total from fms_transaction t where transtypeId = ${s?.id} and date(createdAt) = date(now())`;
            const week: any = await fms.$queryRaw`select ifnull(sum(amount),0) as total from fms_transaction t where transtypeId = ${s?.id} and yearweek(createdAt) = yearweek(now())`;
            const month: any = await fms.$queryRaw`select ifnull(sum(amount),0) as total from fms_transaction t where transtypeId = ${s?.id} and (month(createdAt) = month(now()) and year(createdAt) = year(now()))`;
            const year: any = await fms.$queryRaw`select ifnull(sum(amount),0) as total from fms_transaction t where transtypeId = ${s?.id} and year(createdAt) = year(now())`;

            return ({
               label,
               today: today[0].total,
               week: week[0].total,
               month: month[0].total,
               year: year[0].total
            })
         }));

         let data = {
            feesPayment: {
               today: ac_today[0].total,
               week: ac_week[0].total,
               month: ac_month[0].total,
               year: ac_year[0].total
            },
            otherPayment: trans
         }

         if (data) res.status(200).json(data)
         else res.status(204).json({ message: `no record found` })

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   /* Bills */
   async fetchBillList(req: Request, res: Response) {
      try {
         const resp = await fms.bill.findMany({
            where: { status: true },
            include: { session: true, program: true, bankacc: true },
            orderBy: { createdAt: 'desc' }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchBills(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { id: { contains: keyword } },
                  { narrative: { contains: keyword } },
                  { session: { title: { contains: keyword } } },
                  { program: { shortName: { contains: keyword } } },
               ],
            }
         }
         const resp = await fms.$transaction([
            fms.bill.count({
               ...(searchCondition),
            }),
            fms.bill.findMany({
               ...(searchCondition),
               include: { session: true, program: true, bankacc: true },
               skip: offset,
               take: Number(pageSize),
               orderBy: { createdAt: 'desc' }
            })
         ]);

         if (resp && resp[1]?.length) {
            res.status(200).json({
               totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
               totalData: resp[1]?.length,
               data: resp[1],
            })
         } else {
            res.status(204).json({ message: `no records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchBill(req: Request, res: Response) {
      try {
         const resp = await fms.bill.findUnique({
            where: { id: paramStr(req.params.id) },
            include: { session: true, program: true, bankacc: true },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async includeBill(req: Request, res: Response) {
      try {
         const { tag, action } = req.body;
         let resp;
         const bs: any = await fms.bill.findUnique({ where: { id: paramStr(req.params.id) } })

         if (action == 'create') {
            const stdata: any = { studentId: tag, sessionId: bs?.sessionId, billId: bs?.id, type: 'BILL', narrative: bs?.narrative, currency: bs?.currency, amount: bs?.amount }
            // Save into Student Account
            const st = await fms.studentAccount.findFirst({ where: { studentId: tag, billId: bs?.id } })
            if (st) await fms.studentAccount.updateMany({ where: { studentId: tag, billId: bs?.id }, data: stdata });
            else await fms.studentAccount.create({ data: stdata });
            // Update Bill IncludeStudentIds Records
            const includeStudentIds: any = bs?.includeStudentIds ? [tag, ...bs?.includeStudentIds] : [tag];
            resp = await fms.bill.update({ where: { id: paramStr(req.params.id) }, data: { includeStudentIds } });
         } else {
            // Delete Bill from Student Account
            await fms.studentAccount.deleteMany({ where: { studentId: tag, billId: bs?.id } })
            // Update Bill IncludeStudentIds Records
            const includeStudentIds: any = bs?.includeStudentIds?.filter((r: any) => r != tag);
            resp = await fms.bill.update({ where: { id: paramStr(req.params.id) }, data: { includeStudentIds } });
         }

         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(202).json({ message: error.message })
      }
   }

   async excludeBill(req: Request, res: Response) {
      try {
         const { tag, action } = req.body;
         let resp;
         if (action == 'create')
            resp = await fms.bill.update({
               where: { id: paramStr(req.params.id) },
               data: { excludeStudentIds: { jsonb_set: { path: '$', value: { tag }, append: true } } }
            })
         else
            resp = await fms.bill.update({
               where: { id: paramStr(req.params.id), excludeStudentIds: { path: '$', array_contains: tag } },
               data: {
                  excludeStudentIds: { jsonb_remove: { path: '$' } }
               }
            })

         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(202).json({ message: error.message })
      }
   }

   async billReceivers(req: Request, res: Response) {
      try {
         const resp = await fms.studentAccount.findMany({
            where: {
               billId: paramStr(req.params.id)
            },
            include: { student: true }
         })

         console.log(resp)
         if (resp?.length) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         //console.log(error)
         //return res.status(500).json({ message: error.message }) 
         return res.status(202).json({ message: error.message })
      }
   }

   async billActivity(req: Request, res: Response) {
      try {
         const resp = await fms.activityBill.findMany({
            where: { billId: paramStr(req.params.id) }
         })
         if (resp?.length) {
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(204).json({ message: error.message })
      }
   }

   async activateBill(req: Request, res: Response) {
      try {
         const bs: any = await fms.bill.findUnique({ where: { id: paramStr(req.params.id) }, include: { session: true } });
         if (bs) {
            let students: any = [];
            // Locate Students that Bill should Apply
            const semesters = await getSemesterFromCode(bs.session?.semester, bs.mainGroupCode);
            const st: any = bs?.tag == 'sub'
               ? await fms.$queryRaw`select id from ais_student where programId = ${bs?.programId} and ((date_format(entryDate,'%m') = '01' and semesterNum <= 2) or (date_format(entryDate,'%m') = '01' and semesterNum <= 4 and entrySemesterNum in (3))) and entryGroup = ${bs?.type} and semesterNum in (${semesters}) and deferStatus = 0 and completeStatus = 0`
               : await fms.$queryRaw`select id from ais_student where programId = ${bs?.programId} and ((date_format(entryDate,'%m') = '01' and semesterNum > 2) or (date_format(entryDate,'%m') = '01' and semesterNum <= 4 and entrySemesterNum not in (1,3)) or (date_format(entryDate,'%m') <> '01')) and entryGroup = ${bs?.type} and semesterNum in (${semesters}) and deferStatus = 0 and completeStatus = 0`;
            if (st?.length) students = [...st.map((r: any) => r.id)];
            // Locate Included Students
            if (bs?.includeStudentIds?.length) students = [...students, ...bs?.includeStudentIds];
            // Remove Excluded Students
            if (bs?.excludeStudentIds?.length) students = students?.filter((r: any) => !bs?.excludeStudentIds?.includes(r));
            // Insert bills in student accounts
            if (students?.length) {
               // @ts-ignore
               students = Array.from(new Set(students.map(JSON.stringify))).map(JSON.parse);
               const stdata = await Promise.all(students?.map(async (r: any) => {
                  const ss = await fms.student.findFirst({ where: { OR: [{ id: r }, { indexno: r }] } });
                  const studentId = ss?.id;
                  // Sanitize Bill
                  //const bi = await fms.studentAccount.findFirst({ where: { studentId, billId: bs?.id }});
                  //if(bi) return null;
                  return ({
                     studentId,
                     sessionId: bs?.sessionId,
                     billId: bs?.id,
                     type: 'BILL',
                     narrative: bs?.narrative,
                     currency: bs?.currency,
                     amount: bs?.amount
                  })
               }));

               const ups = await fms.studentAccount.createMany({ data: stdata })
               if (ups?.count) {
                  // Retire Student Accounts
                  await Promise.all(students?.map(async (studentId: any) => {
                     const bal: any = await fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId } });
                     await fms.student.update({ where: { id: studentId }, data: { accountNet: bal?._sum?.amount } })
                  }))
               }
            }
            // Update bill Status
            const ds = await fms.bill.update({ where: { id: paramStr(req.params.id) }, data: { posted: true } })
            if (ds) {
               // Log Publish Activity & Receipients
               await fms.activityBill.create({ data: { billId: bs?.id, amount: bs?.amount, discount: bs?.discount, receivers: students } })
               // Return Response
               res.status(200).json(bs)
            } else {
               res.status(204).json({ message: `something happened, No bill created` })
            }

         } else {
            res.status(204).json({ message: `no bill found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async revokeBill(req: Request, res: Response) {
      try {
         const sts = await fms.studentAccount.findMany({ where: { billId: paramStr(req.params.id) } })
         // Update Bill status
         const resp = await fms.bill.update({ where: { id: paramStr(req.params.id) }, data: { posted: false } })
         if (sts?.length && resp) {
            // Remove Bill from student accounts
            await fms.studentAccount.deleteMany({ where: { billId: paramStr(req.params.id) } })
            // Retire Student Accounts
            await Promise.all(sts?.map(async (account: any) => {
               const { studentId } = account;
               const bal: any = await fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId } });
               await fms.student.update({ where: { id: studentId }, data: { accountNet: bal?._sum?.amount } })
            }))
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postBill(req: Request, res: Response) {
      try {
         const { programId, bankaccId, sessionId } = req.body
         delete req.body.sessionId; delete req.body.bankaccId;
         delete req.body.programId;

         const resp = await fms.bill.create({
            data: {
               ...req.body,
               ...sessionId && ({ session: { connect: { id: sessionId } } }),
               ...bankaccId && ({ bankacc: { connect: { id: bankaccId } } }),
               ...programId && ({ program: { connect: { id: programId } } }),
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateBill(req: Request, res: Response) {
      try {
         const { programId, bankaccId, sessionId } = req.body
         delete req.body.sessionId; delete req.body.bankaccId;
         delete req.body.programId;

         const resp = await fms.bill.update({
            where: {
               id: paramStr(req.params.id)
            },
            data: {
               ...req.body,
               ...sessionId && ({ session: { connect: { id: sessionId } } }),
               ...bankaccId && ({ bankacc: { connect: { id: bankaccId } } }),
               ...programId && ({ program: { connect: { id: programId } } }),
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteBill(req: Request, res: Response) {
      try {
         const bs = await fms.bill.update({
            where: { id: paramStr(req.params.id) },
            data: {
               studentAccount: { deleteMany: { billId: paramStr(req.params.id) } }
            }
         })
         if (bs) {
            const resp = await fms.bill.delete({ where: { id: paramStr(req.params.id) } })
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `No records deleted` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   /* Charges */
   async fetchCharges(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
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
         }
         const resp = await fms.$transaction([
            fms.charge.count({
               ...(searchCondition),
            }),
            fms.charge.findMany({
               ...(searchCondition),
               include: { student: { include: { program: true } } },
               skip: offset,
               take: Number(pageSize),
               orderBy: { createdAt: 'desc' }
            })
         ]);

         if (resp && resp[1]?.length) {
            res.status(200).json({
               totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
               totalData: resp[1]?.length,
               data: resp[1],
            })
         } else {
            res.status(204).json({ message: `no records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchCharge(req: Request, res: Response) {
      try {
         const resp = await fms.charge.findUnique({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async lateCharge(req: Request, res: Response) {
      try {
         const { studentId } = req.body;
         const st: any = await fms.student.findUnique({ where: { id: studentId } });
         const charge: any = await fms.transtype.findFirst({ where: { id: 8 } })
         if (st && charge) {
            const fine = st?.entryGroup == 'GH' ? charge?.amountInGhc : charge?.amountInUsd;
            const resp = await fms.charge.create({
               data: {
                  title: `LATE REGISTRATION FINE`,
                  type: 'FINE',
                  currency: st.entryGroup == 'GH' ? 'GHC' : 'USD',
                  amount: parseFloat(fine),
                  posted: true,
                  ...studentId && ({ student: { connect: { id: studentId } } }),
                  studentAccount: {
                     createMany: {
                        data: { studentId: st?.id, currency: st.entryGroup == 'GH' ? 'GHC' : 'USD', amount: parseFloat(fine), type: 'CHARGE', narrative: `LATE REGISTRATION FINE` }
                     }
                  }
               }
            })
            // Retire Accounts
            const bal: any = await fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId } });
            await fms.student.update({ where: { id: studentId }, data: { accountNet: bal?._sum?.amount } })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postCharge(req: Request, res: Response) {
      try {
         const { studentId } = req.body
         delete req.body.studentId;
         console.log(req.body)
         const resp = await fms.charge.create({
            data: {
               ...req.body,
               ...studentId && ({ student: { connect: { id: studentId } } }),
               studentAccount: {
                  createMany: {
                     data: [{
                        studentId,
                        narrative: "test",
                        amount: req?.body?.amount,
                        type: 'CHARGE',
                        currency: req?.body?.currency,
                     }]
                  }
               }
            }
         })
         if (resp) {
            // Retire Account
            const bal: any = await fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId } });
            await fms.student.update({ where: { id: studentId }, data: { accountNet: bal?._sum?.amount } })
            // Create record in student account
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateCharge(req: Request, res: Response) {
      try {
         const { studentId } = req.body
         delete req.body.studentId;

         const resp = await fms.charge.update({
            where: { id: paramStr(req.params.id) },
            data: {
               ...req.body,
               ...studentId && ({ student: { connect: { id: studentId } } }),
               studentAccount: {
                  updateMany: {
                     where: { studentId },
                     data: {
                        studentId,
                        narrative: req?.body?.title,
                        amount: req?.body?.amount,
                        type: 'CHARGE',
                        currency: req?.body?.currency,
                     }
                  }
               }
            }
         })
         if (resp) {
            // Retire Accounts
            const bal: any = await fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId } });
            await fms.student.update({ where: { id: studentId }, data: { accountNet: bal?._sum?.amount } })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteCharge(req: Request, res: Response) {
      try {
         const bs = await fms.charge.update({
            where: { id: paramStr(req.params.id) },
            data: { studentAccount: { deleteMany: { chargeId: paramStr(req.params.id) } } }
         })
         if (bs) {
            const { studentId }: any = bs;
            const resp = await fms.charge.delete({ where: { id: paramStr(req.params.id) } })
            // Retire Account
            const bal: any = await fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId } });
            await fms.student.update({ where: { id: studentId }, data: { accountNet: bal?._sum?.amount } })
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `No records deleted` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   /* Payments */
   async fetchPayments(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition: any = { where: { transtypeId: { in: [2] } } }
      try {
         if (keyword) searchCondition = {
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
         }
         const resp = await fms.$transaction([
            fms.transaction.count({
               ...(searchCondition),
            }),
            fms.transaction.findMany({
               ...(searchCondition),
               include: { student: { include: { program: true } }, transtype: true },
               skip: offset,
               take: Number(pageSize),
               orderBy: { createdAt: 'desc' }
            })
         ]);

         if (resp && resp[1]?.length) {
            res.status(200).json({
               totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
               totalData: resp[1]?.length,
               data: resp[1],
            })
         } else {
            res.status(204).json({ message: `no records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchPaymentOthers(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition: any = { where: { transtypeId: { notIn: [1, 2] } } }
      try {
         if (keyword) searchCondition = {
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
         }
         const resp = await fms.$transaction([
            fms.transaction.count({
               ...(searchCondition),
            }),
            fms.transaction.findMany({
               ...(searchCondition),
               include: { student: { include: { program: true } }, transtype: true },
               skip: offset,
               take: Number(pageSize),
               orderBy: { createdAt: 'desc' }
            })
         ]);

         if (resp && resp[1]?.length) {
            res.status(200).json({
               totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
               totalData: resp[1]?.length,
               data: resp[1],
            })
         } else {
            res.status(204).json({ message: `no records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchPaymentVouchers(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition: any = { where: { transtypeId: { in: [1] } } }
      try {
         if (keyword) searchCondition = {
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
         }
         const resp = await fms.$transaction([
            fms.transaction.count({
               ...(searchCondition),
            }),
            fms.transaction.findMany({
               ...(searchCondition),
               include: { transtype: true, activityFinanceVoucher: true },
               skip: offset,
               take: Number(pageSize),
               orderBy: { createdAt: 'desc' }
            })
         ]);

         if (resp && resp[1]?.length) {
            res.status(200).json({
               totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
               totalData: resp[1]?.length,
               data: resp[1],
            })
         } else {
            res.status(204).json({ message: `no records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchPayment(req: Request, res: Response) {
      try {
         const resp = await fms.transaction.findUnique({
            where: { id: paramStr(req.params.id) },
            include: { student: { include: { program: true } }, transtype: true },
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async convertPayment(req: Request, res: Response) {
      try {
         const { transactId, transtypeId } = req.body
         delete req.body.transactId; delete req.body.transactId;
         const narrative = `Payment of ${transtypeId == 8 ? 'Graduation' : transtypeId == 3 ? 'Resit' : transtypeId == 8 ? 'Late Registration' : 'Academic'} Fees`
         const resp = await fms.transaction.update({
            where: { id: transactId },
            data: {
               ...transtypeId && ({ transtype: { connect: { id: transtypeId } } }),
               // If Fees,Late,Resit,Graduation transaction
               ...transtypeId && [2, 3, 4, 8].includes(Number(transtypeId)) && ({ studentAccount: { updateMany: { data: { narrative } } } }),
            }
         })
         if (resp) {
            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postPayment(req: Request, res: Response) {
      try {
         const { studentId, transtypeId, bankaccId, collectorId, amount } = req.body
         delete req.body.studentId; delete req.body.transtypeId;
         delete req.body.bankaccId; delete req.body.collectorId;
         const narrative = `Payment of ${transtypeId == 8 ? 'Graduation' : transtypeId == 3 ? 'Resit' : transtypeId == 8 ? 'Late Registration' : 'Academic'} Fees`

         const st: any = await fms.student.findUnique({ where: { id: studentId }, select: { entryGroup: true, indexno: true } })
         const resp: any = await fms.transaction.create({
            data: {
               ...req.body,
               ...collectorId && ({ collector: { connect: { id: collectorId } } }),
               ...bankaccId && ({ bankacc: { connect: { id: bankaccId } } }),
               ...studentId && ({ student: { connect: { id: studentId } } }),
               ...transtypeId && ({ transtype: { connect: { id: transtypeId } } }),
               // If Fees,Late,Resit,Graduation transaction
               ...transtypeId && [2, 3, 4, 8].includes(Number(transtypeId)) && ({ studentAccount: { createMany: { data: [{ studentId, narrative, amount: (-1 * req?.body?.amount), type: 'PAYMENT', currency: req?.body?.currency }] } } }),
            }
         })
         if (resp) {
            // Retire Student Account Balance after Fees,Late,Resit,Graduation transaction
            if ([2, 3, 4, 8].includes(Number(transtypeId))) {
               const bal: any = await fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId } });
               await fms.student.update({ where: { id: studentId }, data: { accountNet: bal?._sum?.amount } })
            }

            // If Resit - Run Resit operations
            if (transtypeId == 3) {
               // Retire Number of Resit Papers
               const resit_charge: any = await fms.transtype.findUnique({ where: { id: Number(transtypeId) } });
               const pay_count = amount / Math.floor((st?.entryGroup == 'INT' ? resit_charge?.amountInUsd : resit_charge?.amountInGhc));
               const resits: any = await fms.resit.findMany({ where: { indexno: st?.indexno, paid: false }, take: pay_count })
               const filters: any = resits?.map((r: any) => ({ indexno: r.indexno }))
               // Update Paid Status of resit_data or papers
               const ups = await fms.resit.updateMany({ where: { OR: filters, AND: [{ paid: false }] }, data: { paid: true } })
               // Get Paid Balance for Extra Resit
               const unsorted_courses = pay_count - ups?.count;
               const resit_balance = pay_count - ups?.count;
            }

            // If Transwift Transtypes - Run Transwift( Attestation, Proficiency, Introductory, Transcript) operations
            if ([5, 6, 9, 10].includes(Number(transtypeId))) {
               // Retire Number of Resit Papers
               const charge: any = await fms.transtype.findUnique({ where: { id: Number(transtypeId) } });
               const count = amount / Math.floor((st?.entryGroup == 'INT' ? charge?.amountInUsd : charge?.amountInGhc));
               // Create Transwift Requests for Payment
               const tw = await fms.transwift.upsert({
                  where: { transactId: resp?.id },
                  create: {
                     studentId,
                     transactId: resp?.id,
                     quantity: count
                  },
                  update: {}
               })
            }

            // If Late fine - Run Late fine operations

            // Return Response
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updatePayment(req: Request, res: Response) {
      try {
         const { studentId, transtypeId, bankaccId, collectorId } = req.body
         delete req.body.studentId; delete req.body.transtypeId;
         delete req.body.bankaccId; delete req.body.collectorId;
         let voucher;
         const narrative = `Payment of ${transtypeId == 8 ? 'Graduation' : transtypeId == 3 ? 'Resit' : transtypeId == 8 ? 'Late Registration' : 'Academic'} Fees`
         if (transtypeId == '1') voucher = await fms.voucher.findFirst({ where: {}, include: { admission: true } });
         const resp = await fms.transaction.update({
            where: { id: paramStr(req.params.id) },
            data: {
               ...req.body,
               ...collectorId && ({ collector: { connect: { id: collectorId } } }),
               ...bankaccId && ({ bankacc: { connect: { id: bankaccId } } }),
               ...studentId && ({ student: { connect: { id: studentId } } }),
               ...transtypeId && ({ transtype: { connect: { id: transtypeId } } }),
               // If Fees,Late,Resit,Graduation transaction
               ...transtypeId && ['2', '3', '4', '8'].includes(transtypeId) && ({ studentAccount: { updateMany: { data: { studentId, narrative, amount: (-1 * req?.body?.amount), type: 'PAYMENT', currency: req?.body?.currency } } } }),
               // If Voucher transaction
               //... transtypeId && transtypeId == '1' && ({ activityFinanceVoucher: { update: { data: {  } }}}),
            }
         })
         if (resp) {
            // Retire Student Account Balance after Fees,Late,Resit,Graduation transaction
            if (['2', '3', '4', '8'].includes(transtypeId)) {
               const bal: any = await fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId } });
               await fms.student.update({ where: { id: studentId }, data: { accountNet: bal?._sum?.amount } })
            }
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deletePayment(req: Request, res: Response) {
      try {
         const bs = await fms.transaction.update({
            where: { id: paramStr(req.params.id) },
            data: {
               studentAccount: { deleteMany: { transactId: paramStr(req.params.id) } },
               activityFinanceVoucher: { deleteMany: { transactId: paramStr(req.params.id) } }
            }
         })
         if (bs) {
            const resp = await fms.transaction.delete({ where: { id: paramStr(req.params.id) } })
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `No records deleted` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   /* Bank API Transactions  */

   async loadPayServices(req: Request, res: Response) {
      // LOAD_API_SERVICES
      try {
         const resp = await fms.transtype.findMany({
            where: { status: true, visibility: 'PUBLIC' },
            include: { bankacc: true }
         })
         if (resp?.length) {
            const data = resp?.map((row: any) => {
               return ({ serviceId: row.id, serviceName: row.title, serviceChargeInGHC: row.amountInGhc || 0, serviceChargeInUSD: row.amountInUsd || 0, bankAccount: row.bankacc ? row.bankacc.bankAccount : row.bankaccMeta || 'NONE' });
            });
            res.status(200).json({ success: true, data })
         } else {
            res.status(204).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async loadPayService(req: Request, res: Response) {
      try {
         const type: any = paramStr(req.params.type);
         const refno = paramStr(req.params.refno);
         if (refno && type != 1) {
            var dt, ft = 0;
            const st: any = await fms.student.findFirst({
               where: { OR: [{ id: refno }, { indexno: refno }] },
               include: { program: { select: { shortName: true, category: true } } }
            });
            if (st) {
               let bankAccount = "NONE";
               const sv: any = await fms.transtype.findFirst({ where: { id: 2 } });
               if (sv) {
                  bankAccount = sv?.bankaccMeta?.find((r: any) => r.category == st?.program?.category)?.bankAccount || 'NONE';
               }

               dt = {
                  studentId: st.id,
                  indexno: st.indexno,
                  name: `${st.fname} ${st.mname && st.mname + ' '}${st.lname}`,
                  program: st?.program?.shortName,
                  year: st.semesterNum ? Math.ceil(st.semesterNum / 2) : 'none',
                  serviceId: type,
                  bankAccount
               }

               if (type == 2) { /* Student Account Balance */
                  ft = st?.accountNet;

               } else if ([4, 8].includes(type)) { /* Graduation, Late Fine  Charges */
                  const ac = await fms.transtype.findUnique({ where: { id: Number(type) } });
                  if (ac) ft = st?.entryGroup == 'INT' ? (ac?.amountInUsd || 0) : (ac?.amountInGhc || 0);

               } else if (type == 3) { /* Resit Charges */
                  const rs: any = await fms.resit.count({ where: { paid: false, indexno: st?.indexno } });
                  const ac = await fms.transtype.findUnique({ where: { id: Number(type) } });
                  if (ac && rs) ft = st.entryGroup == 'INT' ? rs?.count * (ac.amountInUsd || 0) : rs?.count * (ac.amountInGhc || 0);
               }
               // Return Information
               return res.status(200).json({ success: true, data: { ...dt, serviceCharge: ft } });

            } else {
               return res.status(200).json({ success: false, data: null, msg: "Invalid Student ID or Index Number" });
            }


         } else if (type == 1) {
            // LOAD_VOUCHER_FORMS
            const pr = await fms.amsPrice.findMany({ where: { status: true } });
            const sm = await fms.admission.findFirst({ where: { default: true } });
            if (pr && sm) {
               const forms = pr?.map((r: any) => ({ formId: r.id, formName: r.title, currency: r.currency, serviceCharge: r.amount }))
               return res.status(200).json({ success: true, data: { serviceId: type, sessionId: sm?.id, title: sm?.title, forms } });
            }
            return res.status(403).json({ success: false, data: null, msg: "Invalid request" });

         } else {
            return res.status(403).json({ success: false, data: null, msg: "Invalid request" });
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async payService(req: Request, res: Response) {
      try {

         const api = req.query.api;
         const cl: any = await fms.vendor.findFirst();
         let { serviceId, amountPaid, currency, studentId, refNote, transRef, buyerName, buyerPhone, formId, sessionId } = req.body;
         serviceId = Number(serviceId)
         amountPaid = parseFloat(amountPaid?.toString()?.replace(",", ""))
         const tr = await fms.transaction.findFirst({ where: { transtag: transRef } })

         let data: any = {
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
            if (!sessionId || sessionId == "") return res.status(200).json({ success: false, data: null, msg: `No Admission Session indicated!` }); // Check for Required but Empty field and return error
            // Create Transaction
            console.log("TR: ", tr)
            if (!tr) {
               const pr = await fms.amsPrice.findUnique({ where: { id: formId } });
               if (!pr) return res.status(200).json({ success: false, data: null, msg: `No Form Category indicated!` });
               // const vc: any = await fms.voucher.findFirst({ where: { admissionId: sessionId, vendorId: cl?.id, categoryId: pr?.categoryId, sellType: pr?.sellType, soldAt: null, sold: false } });
               // if (!vc) return res.status(200).json({ success: false, data: null, msg: `Voucher quota exhausted` });

               const vs: any = await fms.$queryRaw`SELECT * FROM ams_voucher WHERE admissionId = ${sessionId} AND vendorId = ${cl?.id} AND categoryId = ${pr?.categoryId} AND sellType = ${pr?.sellType} AND soldAt IS NULL AND sold = 0 order by createdAt asc LIMIT 1`;
               console.log("Bank API Key: ", api);
               console.log("VS: ", vs);

               if (!vs?.length) return res.status(200).json({ success: false, data: null, msg: `Voucher quota exhausted` });
               const vc = vs[0] || null;
               // Send SMS to Buyer
               const msg = `Hi! Your AUCB Applicant Voucher info are SERIAL: ${vc?.serial}, PIN: ${vc?.pin} Goto https://portal.aucb.edu.gh to apply!`;
               const send = await sms(buyerPhone, msg);
               console.log("Send: ", send)
               // let send = { code: 1001 };
               const ins = await fms.transaction.create({
                  data: {
                     ...data,
                     activityFinanceVoucher: {
                        createMany: {
                           data: { serial: vc.serial, pin: vc?.pin, buyerName, buyerPhone, admissionId: sessionId, smsCode: send?.code ? Number(send?.code) : 0 }
                        }
                     }
                  }
               });

               console.log("Voucher Transaction Created: ", ins)
               if (ins) {
                  // Update Voucher with details
                  const vs: any = await fms.$queryRaw`UPDATE ams_voucher SET applicantName = ${buyerName}, applicantPhone = ${buyerPhone}, soldAt = now(), sold = 1, soldBy = ${'API'} WHERE serial = ${vc?.serial}`;
                  // Send Response
                  return res.status(200).json({ success: true, data: { voucherSerial: vc?.serial, voucherPin: vc?.pin, buyerName, buyerPhone, transId: ins?.id, serviceId } });
               }

            } else {
               const vc: any = await fms.activityFinanceVoucher.findFirst({ where: { transactId: tr.id } });
               if (vc) {
                  // Delete same serials not belonging to same transactId
                  await fms.$executeRaw`DELETE FROM fms_activity_voucher WHERE serial = ${vc?.serial} AND transactId <> ${tr?.id}`;
                  // Resend Already Generated Voucher
                  const msg = `Hi! AUCB Voucher info are, Serial: ${vc?.serial}, Pin: ${vc?.pin} Goto https://portal.aucb.edu.gh to apply!`;
                  const send = await sms(buyerPhone, msg);
                  //let send = { code: 1001 };
                  await fms.activityFinanceVoucher.update({ where: { id: vc.id }, data: { smsCode: send?.code ? Number(send?.code) : 0 } })
                  return res.status(200).json({
                     success: true,
                     data: {
                        voucherSerial: vc?.serial,
                        voucherPin: vc?.pin,
                        buyerName,
                        buyerPhone,
                        transId: tr?.id,
                        serviceId,
                     },
                  });
               }
               return res.status(200).json({ success: false, data: null, msg: `Transaction failed` });
            }

            /* OTHER PAYMENT SERVICE (ACADEMIC FEES, RESIT, GRADUATION, ATTESTATION, PROFICIENCY, TRANSCRIPT, LATE FINE ) */
         } else {
            /* PAY FOR SERVICES */
            const st: any = await fms.student.findFirst({ where: { OR: [{ id: studentId }, { indexno: studentId }] }, include: { program: { select: { prefix: true } } } });
            if (!tr) {
               const narrative = `Payment of ${serviceId == 8 ? 'Graduation' : serviceId == 3 ? 'Resit' : serviceId == 8 ? 'Late Registration' : 'Academic'} Fees`
               data = { ...data, studentId: st?.id }
               studentId = st?.id;
               const ins = await fms.transaction.create({
                  data: {
                     ...data,
                     ...serviceId && [2, 3, 4, 8].includes(serviceId) && ({ studentAccount: { createMany: { data: { studentId, narrative, currency, amount: (-1 * amountPaid), type: 'PAYMENT' } } } }),
                  }
               })

               if (ins) {
                  if ([2, 3, 4, 8].includes(serviceId)) {
                     const bal: any = await fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId } });
                     await fms.student.update({ where: { id: studentId }, data: { accountNet: bal?._sum?.amount || 0 } })
                  }
                  /* For Resit Payments */
                  if (serviceId == 3) {
                     // Retire Number of Resit Papers
                     const resit_charge: any = await fms.transtype.findUnique({ where: { id: Number(serviceId) } });
                     const pay_count = Math.floor(amountPaid / (st?.entryGroup == 'INT' ? resit_charge?.amountInUsd : resit_charge?.amountInGhc));
                     const resits: any = await fms.resit.findMany({ where: { indexno: st?.indexno, paid: false }, take: pay_count })
                     const filters: any = resits?.map((r: any) => ({ indexno: r.indexno }))
                     // Update Paid Status of resit_data or papers
                     const ups = await fms.resit.updateMany({ where: { OR: filters, AND: [{ paid: false }] }, data: { paid: true } })
                  }

                  /* If Transwift Transtypes - Run Transwift( Attestation, Proficiency, Introductory, Transcript) operations */
                  if ([5, 6, 9, 10].includes(Number(serviceId))) {
                     // Retire Number of Documents
                     const charge: any = await fms.transtype.findUnique({ where: { id: Number(serviceId) } });
                     const count = amountPaid / Math.floor((st?.entryGroup == 'INT' ? charge?.amountInUsd : charge?.amountInGhc));
                     // Create Transwift Requests for Payment
                     const tw = await fms.transwift.upsert({
                        where: { transactId: ins?.id },
                        create: { studentId, transactId: ins?.id, quantity: count },
                        update: {}
                     })
                     // Send Follow-up SMS to Student
                     const msg = `Hi! Your document request has been processed, Please go into your portal [https://portal.aucb.edu.gh] to update receipient and required information. Thank you.`;
                     const send = await sms(st?.phone, msg);
                  }

                  /* Index Number Generation For Freshers  */
                  if (serviceId == 2 && (st.semesterNum == st.entrySemesterNum)) {
                     // Get student account transaction & Bill + Quota
                     const cx: any = await fms.studentAccount.findFirst({ where: { studentId, type: 'BILL' }, include: { bill: { select: { quota: true } } } });
                     const px: any = await fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId, type: 'PAYMENT' } })
                     // Compare All Payments to Bill Quota
                     const isPassedIndex = (px?._sum?.amount >= (cx?.bill?.quota || 0) * cx?.amount);
                     // Generate Index 
                     if (!st?.indexno && isPassedIndex) {
                        let indexno;
                        // const students:any = await fms.$queryRaw`select * from fms_student where date_format(entryDate,'%m%y') = ${moment(st?.entryDate).format("mmyyyy")} and programId = ${st?.programId}`;
                        const students: any = await fms.$queryRaw`select * from ais_student where date_format(entryDate,'%m%y') = ${moment(st?.entryDate).format("MMYY")} and programId = ${st?.programId} and indexno is not null and (semesterNum = entrySemesterNum)`;

                        let studentCount = students?.length + 1;
                        let loop = true;
                        while (loop) {
                           // Compute Index Number
                           const count = studentCount.toString().length == 1 ? `000${studentCount}` : studentCount.toString().length == 2 ? `00${studentCount}` : studentCount.toString().length == 3 ? `0${studentCount}` : studentCount;
                           indexno = `${st?.program?.prefix}${moment(st?.entryDate || new Date()).format("MMYY")}${count}`
                           // Check If Index Number Exists
                           const ck = await fms.student.findFirst({ where: { indexno } });
                           if (ck) {
                              studentCount = studentCount + 1;
                           } else {
                              loop = false;
                           }
                        }

                        await fms.student.update({ where: { id: studentId }, data: { indexno } });
                        // Send Notfication
                        const msg = `Hi ${st.fname}! Your AUCB Index number has been generated: ${indexno}, Thank you!`;
                        await sms(st?.phone, msg);
                     }
                  }
                  // Retire Account

                  // Return Response
                  return res.status(200).json({ success: true, data: { transId: ins?.id, studentId, serviceId } });
               } else {
                  return res.status(200).json({ success: false, data: null, msg: `Transaction failed` });
               }
            } else {
               return res.status(200).json({ success: true, data: { transId: tr?.id, studentId: st?.id, serviceId } });
            }
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   /* Student Accounts & Debtors */

   async fetchAccounts(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition: any = {}
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { id: { contains: keyword } },
                  { indexno: { contains: keyword } },
                  { fname: { contains: keyword } },
                  { lname: { contains: keyword } },
               ]
            }
         }
         const resp = await fms.$transaction([
            fms.student.count({
               ...(searchCondition),
            }),
            fms.student.findMany({
               ...(searchCondition),
               include: { program: true },
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
            res.status(204).json({ message: `no records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchAccount(req: Request, res: Response) {
      try {
         const resp = await fms.studentAccount.findMany({
            where: { studentId: paramStr(req.params.id) },
            include: {
               student: { select: { fname: true, mname: true, lname: true, indexno: true, program: { select: { longName: true } } } },
               bill: { select: { narrative: true } },
               charge: { select: { title: true } },
               session: { select: { title: true } },
               transaction: { select: { transtag: true } },
            },
            orderBy: { createdAt: 'asc' }
         })
         if (resp.length) {
            res.status(200).json(resp)
         } else {
            res.status(202).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   async fetchDebts(req: Request, res: Response) {
      console.log("Depts")
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition: any = { where: { accountNet: { gt: 0 } } }
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { id: { contains: keyword } },
                  { indexno: { contains: keyword } },
                  { fname: { contains: keyword } },
                  { lname: { contains: keyword } },
               ],
               AND: [{ accountNet: { gt: 0 } }]
            }
         }
         const resp = await fms.$transaction([
            fms.student.count({
               ...(searchCondition),
            }),
            fms.student.findMany({
               ...(searchCondition),
               include: { program: true },
               skip: offset,
               take: Number(pageSize),
            })
         ]);
         console.log(resp)

         if (resp && resp[1]?.length) {
            res.status(200).json({
               totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
               totalData: resp[1]?.length,
               data: resp[1],
            })
         } else {
            res.status(204).json({ message: `no records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async retireAccount(req: Request, res: Response) {
      try {
         const st = await fms.student.findFirst({ where: { OR: [{ id: paramStr(req.params.tag) }, { indexno: paramStr(req.params.tag) }] } })
         if (st) {
            // const pays = await fms.transaction.findMany({ where: { studentId: st?.id } });
            const mt: any = await fms.$queryRaw`select sum(amount) as amount from fms_studaccount where studentId = ${st?.id}`;
            console.log("Accounts: ", mt)

            /* Clean Student Account Payments & Repopulate */
            // Delete Any Transaction Payment in Student Account
            //  await fms.studentAccount.deleteMany({ where: { 
            //    studentId: st?.id , transactId: { not: null }
            //  }})
            const del: any = st?.indexno
               ? await fms.studentAccount.deleteMany({
                  where: {
                     OR: [{ studentId: st?.id }, { studentId: st?.indexno }],
                     AND: [{ transactId: { not: null } }]
                  }
               })
               : await fms.studentAccount.deleteMany({
                  where: {
                     studentId: st?.id, transactId: { not: null }
                  }
               });

            // const pays = st?.indexno 
            //    ? await fms.transaction.findMany({ where: { 
            //        OR: [ { studentId: st?.id }, { studentId: st?.indexno } ],
            //        AND: [ { transtypeId: { in: [2,3,4,8] } } ]
            //      },
            //    }) 
            //    : await fms.transaction.findMany({ where: {  studentId: st?.id, transtypeId: { in: [2,3,4,8] }} });

            const pays: any = st?.indexno
               ? await fms.$queryRaw`select t.* from fms_transaction t left join ais_student s on ( s.id = t.studentId or s.indexno = t.studentId ) where (t.studentId = ${st?.id} or t.studentId = ${st?.indexno}) and t.transtypeId in (2,3,4,8)`
               : await fms.transaction.findMany({ where: { studentId: st?.id, transtypeId: { in: [2, 3, 4, 8] } } });

            if (pays?.length) {
               const response = await Promise.all(pays?.map(async (r: any, i: number) => {
                  // Check If in Student Account
                  const narrative = `Payment of ${r.transtypeId == 8 ? 'Graduation' : r.transtypeId == 3 ? 'Resit' : r.transtypeId == 8 ? 'Late Registration' : 'Academic'} Fees - ${r.transtag}`
                  const isExist = await fms.studentAccount.findFirst({ where: { transactId: r?.id } });
                  if (!isExist && [2, 3, 4, 8].includes(r.transtypeId)) {
                     const ins: any = await fms.studentAccount.create({ data: { studentId: st?.id, narrative, currency: r.currency, amount: (-1 * r.amount), type: 'PAYMENT', transactId: r.id, createdAt: r.createdAt } });
                  }
               }))

               if (response) {
                  const bal: any = await fms.studentAccount.aggregate({ _sum: { amount: true }, where: { studentId: st?.id } });
                  const ups = await fms.student.update({ where: { id: st?.id }, data: { accountNet: bal?._sum?.amount } })
               }
            }
            // Return New Balance
            res.status(200).json(pays?.length)
         } else {
            res.status(204).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   /* Service charges */
   async fetchServiceList(req: Request, res: Response) {
      try {
         const resp = await fms.transtype.findMany({
            where: { status: true },
            orderBy: { createdAt: 'desc' }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   async fetchServices(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition: any = {
         where: { id: { notIn: [1, 2, 7] } },
         // select: { bankacc: { bankAccount: true } }
      }
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { title: { contains: keyword } },
               ],
               AND: [
                  { id: { notIn: [1, 2, 7] } }
               ]
            },
            // select: { bankacc: { bankAccount: true } }
         }
         const resp = await fms.$transaction([
            fms.transtype.count({
               ...(searchCondition),
            }),
            fms.transtype.findMany({
               ...(searchCondition),
               include: { bankacc: true },
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
            res.status(204).json({ message: `no records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchService(req: Request, res: Response) {
      try {
         const resp = await fms.transtype.findUnique({
            where: { id: Number(paramStr(req.params.id)) }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postService(req: Request, res: Response) {
      try {
         delete req.body.transtypeId;
         const resp = await fms.transtype.create({
            data: {
               ...req.body,
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateService(req: Request, res: Response) {
      try {
         delete req.body.transtypeId;
         const resp = await fms.transtype.update({
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
            res.status(204).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteService(req: Request, res: Response) {
      try {
         const resp = await fms.transtype.delete({ where: { id: Number(paramStr(req.params.id)) } })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `No records deleted` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   /* Voucher Costs */
   async fetchVsales(req: Request, res: Response) {
      const { page = 1, pageSize = 9, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { title: { contains: keyword } },
                  { category: { title: { contains: keyword } } },
               ],
            }
         }
         const resp = await fms.$transaction([
            fms.amsPrice.count({
               ...(searchCondition),
            }),
            fms.amsPrice.findMany({
               ...(searchCondition),
               include: { category: true },
               skip: offset,
               take: Number(pageSize),
               orderBy: { createdAt: 'desc' }
            })
         ]);

         if (resp && resp[1]?.length) {
            res.status(200).json({
               totalPages: Math.ceil(resp[0] / pageSize) ?? 0,
               totalData: resp[1]?.length,
               data: resp[1],
            })
         } else {
            res.status(204).json({ message: `no records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchVsale(req: Request, res: Response) {
      try {
         const resp = await fms.amsPrice.findUnique({
            where: { id: paramStr(req.params.id) }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postVsale(req: Request, res: Response) {
      try {
         const { categoryId } = req.body
         delete req.body.categoryId;
         const resp = await fms.amsPrice.create({
            data: {
               ...req.body,
               ...categoryId && ({ category: { connect: { id: categoryId } } }),
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateVsale(req: Request, res: Response) {
      try {
         const { categoryId } = req.body
         delete req.body.categoryId;
         const resp = await fms.amsPrice.update({
            where: { id: paramStr(req.params.id) },
            data: {
               ...req.body,
               ...categoryId && ({ category: { connect: { id: categoryId } } }),
            }
         })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteVsale(req: Request, res: Response) {
      try {
         const resp = await fms.amsPrice.delete({ where: { id: paramStr(req.params.id) } })
         if (resp) {
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `No records deleted` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }


   async fetchBanks(req: Request, res: Response) {
      try {
         const resp = await fms.bankacc.findMany({
            where: { status: true },
            orderBy: { createdAt: 'desc' }
         })
         if (resp?.length) {
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

}