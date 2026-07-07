import { and, asc, count, desc, eq, inArray, like, or, sql } from "drizzle-orm";
import { Request, Response } from "express";
import fs from "fs";
import moment from "moment";
import path from "path";
import { db } from "../drizzle/mysqlAdapter";
import { candidate, election, elector, portfolio, staff, student, user } from "../drizzle/schema"; // Your schema definitions
import { paramStr } from "../util/paramStr";

export default class EvsController {

   // Elections
   async fetchAdminElections(req: Request, res: Response) {
      const { page = 1, pageSize = 6, keyword = '' }: any = req.query;
      const limit = Number(pageSize);
      const offset = (Number(page) - 1) * limit;
      try {
         const searchFilter = keyword ? or(like(election.title, `%${keyword}%`)) : undefined;
         const [totalCount, data] = await db.transaction(async (tx) => {
            // const countResult = await tx.select({ value: count() }).from(election).where(searchFilter);
            const countResult = await tx.$count(election, searchFilter);
            const items = await tx.query.election.findMany({
               where: searchFilter,
               with: { group: true },
               limit: limit,
               offset: offset,
               orderBy: [desc(election.createdAt)]
            });
            // return [countResult[0].value, items];
            return [countResult, items];
         });

         if (data.length) {
            res.status(200).json({
               totalPages: Math.ceil(totalCount / limit),
               totalData: data.length,
               data: data,
            });
         } else {
            res.status(204).json({ message: `no records found` });
         }
      } catch (error: any) {
         console.error(error);
         return res.status(500).json({ message: error.message });
      }
   }

   async fetchElections(req: Request, res: Response) {
      try {
         const resp = await db.query.election.findMany({
            where: eq(election.status, 1),
            orderBy: [desc(election.createdAt)]
         });
         resp.length ? res.status(200).json(resp) : res.status(204).json({ message: `no record found` });
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async fetchMyElections(req: Request, res: Response) {
      try {
         const tag = paramStr(req.params.tag);
         const en = await db.select().from(election).where(
            and(
               eq(election.status, 1),
               or(
                  sql`JSON_CONTAINS(${election.voterData}, JSON_OBJECT('tag', ${tag}))`,
                  sql`JSON_CONTAINS(${election.admins}, JSON_QUOTE(${tag}))`
               )
            )
         );

         if (en.length) {
            const resp = await Promise.all(en.map(async (r: any) => {
               const ts = await db.select().from(elector).where(eq(elector.electionId, r.id));
               const rs = await db.query.elector.findFirst({
                  where: and(eq(elector.electionId, r.id), eq(elector.tag, tag))
               });
               return { ...r, turnout: ts.length, voters: ts, voteStatus: !!rs };
            }));
            res.status(200).json(resp);
         } else {
            res.status(204).json({ message: `no record found` });
         }
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async fetchElection(req: Request, res: Response) {
      try {
         const id = Number(paramStr(req.params.id));
         const resp = await db.query.election.findFirst({
            where: eq(election.id, id),
            with: { group: true },
         });

         if (resp) {
            const tsResult = await db.select({ value: count() }).from(elector).where(eq(elector.electionId, id));
            const turnout = tsResult[0].value;

            const voterData: any = resp.voterData;
            const tm = voterData && await Promise.all(voterData.map(async (r: any) => {
               const ts = await db.query.elector.findFirst({
                  where: and(eq(elector.electionId, id), eq(elector.tag, r?.tag))
               });
               return { ...r, voteStatus: !!ts };
            }));

            res.status(200).json({ ...resp, voterData: tm, turnout });
         } else {
            res.status(204).json({ message: `no record found` });
         }
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async postElection(req: Request, res: Response) {
      try {
         let data = { ...req.body };
         delete data.logo;

         if (data.startAt) data.startAt = new Date(data.startAt);
         if (data.endAt) data.endAt = new Date(data.endAt);
         if (data.groupId) data.groupId = Number(data.groupId);
         if (data.voterList) data.voterList = JSON.parse(data.voterList);
         
         const booleanFields = ['status', 'allowMonitor', 'allowVip', 'allowResult', 'allowMask', 'allowEcMonitor', 'allowEcVip', 'allowEcResult', 'autoStop'];
         booleanFields.forEach(field => {
            if (data[field] !== undefined) data[field] = Boolean(Number(data[field]));
         });

         const logo: any = req?.files?.logo;
         const [newElection] = await db.insert(election).values(data);
         
         if (newElection) {
            const folderPath = path.join(__dirname, "/../../public/cdn/evs", String(newElection.insertId));
            if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

            if (logo) {
               const dest = path.join(__dirname, "/../../public/cdn/photo/evs/", `${newElection.insertId}.png`);
               logo.mv(dest, (err: any) => err && console.log(err));
            }
            res.status(200).json(newElection);
         }
      } catch (error: any) {
         console.log(error)
         // return res.status(500).json({ message: error.message });
      }
   }

   async updateElection(req: Request, res: Response) {
      try {
         const id = Number(paramStr(req.params.id));
         let data = { ...req.body };
         delete data.logo;
         if (data.startAt) data.startAt = new Date(data.startAt);
         if (data.endAt) data.endAt = new Date(data.endAt);
         if (data.groupId) data.groupId = Number(data.groupId);
         if (data.voterList) data.voterList = JSON.parse(data.voterList);

         const booleanFields = ['status', 'allowMonitor', 'allowVip', 'allowResult', 'allowMask', 'allowEcMonitor', 'allowEcVip', 'allowEcResult', 'autoStop'];
         booleanFields.forEach(field => {
            if (data[field] !== undefined) data[field] = Boolean(Number(data[field]));
         });

         const logo: any = req?.files?.logo;
         await db.update(election).set(data).where(eq(election.id, id));
         const updated = await db.query.election.findFirst({ where: eq(election.id, id) });

         if (updated) {
            if (logo) {
               const dest = path.join(__dirname, "/../../public/cdn/photo/evs/", `${id}.png`);
               logo.mv(dest, (err: any) => err && console.log(err));
            }
            res.status(200).json(updated);
         } else {
            res.status(204).json({ message: `No records found` });
         }
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async deleteElection(req: Request, res: Response) {
      try {
         const id = Number(paramStr(req.params.id));
         const [resp] = await db.delete(election).where(eq(election.id, id));
         resp ? res.status(200).json(resp) : res.status(204).json({ message: `No records found` });
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async actionReset(req: Request, res: Response) {
      try {
         const { electionId } = req.body;
         const eid = Number(electionId);

         await db.transaction(async (tx) => {
            await tx.update(candidate)
               .set({ votes: 0 })
               .where(
                  inArray(
                     candidate.portfolioId,
                     tx.select({ id: portfolio.id }).from(portfolio).where(eq(portfolio.electionId, eid))
                  )
               );

            // Delete Electors
            await tx.delete(elector).where(eq(elector.electionId, eid));
         });

         res.status(200).json({ success: true });
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async actionAdmin(req: Request, res: Response) {
      try {
         const { tag, electionId } = req.body;
         const eid = Number(electionId);
         const electionRes = await db.query.election.findFirst({ where: eq(election.id, eid) });

         if (electionRes) {
            const admins = (electionRes.admins as string[]) || [];
            const exists = admins.find((r: any) => r?.toLowerCase() === tag?.toLowerCase());
            const newAdmins = exists
               ? admins.filter((r: any) => r?.toLowerCase() !== tag?.toLowerCase())
               : [...admins, tag];

            const [resp] = await db.update(election)
               .set({ admins: newAdmins })
               .where(eq(election.id, eid));

            return resp ? res.status(200).json(resp) : res.status(202).json({ message: `No record found!` });
         }
         return res.status(202).json({ message: `Election not staged!` });
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   // Voters & Votes
   async postVotes(req: Request, res: Response) {
      try {
         const result = await db.transaction(async (tx) => {
            let { id, tag, votes } = req.body;
            const ip = req.headers['x-forwarded-for'] ? Array.isArray(req.headers['x-forwarded-for']) ? req.headers['x-forwarded-for'][0] : (req.headers['x-forwarded-for'] as string).split(',')[0] : req.socket.remoteAddress;

            const eid = Number(id);
            if (!tag || !id) throw new Error(`Request user or ID not found`);

            // Check if elector is in voterData JSON array
            const [en] = await tx.select().from(election).where(
               and(
                  eq(election.id, eid),
                  eq(election.status, 1),
                  sql`JSON_CONTAINS(${election.voterData}, JSON_OBJECT('tag', ${tag}))`
               )
            );
            if (!en) throw new Error(`Elector not qualified!`);

            const ev = await tx.query.elector.findFirst({
               where: and(eq(elector.electionId, eid), eq(elector.tag, tag))
            });
            if (ev) throw new Error(`Elector already voted`);

            const isGracePeriod = en.action === 'ENDED' && moment().diff(moment(en.endAt), 'seconds') <= 120;
            if (en.status && (en.action === 'STARTED' || isGracePeriod)) {

               if (!votes?.length) throw new Error(`Votes invalid!`);

               //# Increment candidate votes
               // for (const cid of votes) {
               //    await tx.update(candidate)
               //       .set({ votes: sql`${candidate.votes} + 1` })
               //       .where(eq(candidate.id, Number(cid)));
               // }
               const cs = await tx.update(candidate).set({ votes: sql`${candidate.votes} + 1` }).where(inArray(candidate.id, votes.map((cid: number) => Number(cid))));
               console.log('cs: ', cs);
               const vs = (en.voterData as any[])?.find((r: any) => r.tag === tag);
               const data: any = {
                  voteStatus: true,
                  voteSum: votes.join(","),
                  voteTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                  voteIp: ip,
                  name: vs?.name,
                  tag,
                  electionId: eid
               }

               const [electorRes] = await tx.insert(elector).values(data);
               const newElector = await tx.query.elector.findFirst({ where: eq(elector.id, Number(electorRes.insertId)) });

               // Handle Socket Broadcast
               const allPortfolios = await db.query.portfolio.findMany({
                  where: eq(portfolio.electionId, eid),
                  with: {
                     candidate: {
                        where: eq(candidate.status, 1),
                        with: { portfolio: true },
                        orderBy: [desc(candidate.votes), asc(candidate.orderNo)]
                     }
                  }
               });

               const allElectors = await db.select().from(elector).where(eq(elector.electionId, eid));

               if (req.app?.locals?.broadcastElection) {
                  req.app.locals.broadcastElection(eid, { election: en, portfolio: allPortfolios, elector: allElectors });
               }

               return newElector;
            } else {
               throw new Error(`Election is closed!`);
            }
         });

         res.status(200).json(result);
      } catch (error: any) {
         console.log(error)
         return res.status(203).json({ message: error.message });
      }
   }

   async fetchVotes(req: Request, res: Response) {
      try {
         const eid = Number(paramStr(req.params.id));

         const electionRes = await db.query.election.findFirst({ where: eq(election.id, eid) });
         const electors = await db.select().from(elector).where(eq(elector.electionId, eid));
         let portfolios: any = await db.query.portfolio.findMany({
            where: eq(portfolio.electionId, eid),
            with: {
               candidate: {
                  where: eq(candidate.status, 1),
                  with: { portfolio: true },
                  orderBy: [desc(candidate.votes), asc(candidate.orderNo)]
               }
            }
         });
         portfolios = portfolios.map((r: any) => ({ ...r, candidates: r.candidate }));

         if (electionRes && portfolios) {
            res.status(200).json({
               election: electionRes,
               portfolios,
               electors
            });
         } else {
            res.status(204).json({ message: `no records found` });
         }
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async fetchVoters(req: Request, res: Response) {
      try {
         const resp = await db.query.election.findFirst({
            where: eq(election.id, Number(paramStr(req.params.id))),
            columns: { voterData: true }
         });
         resp ? res.status(200).json(resp.voterData) : res.status(204).json({ message: `no record found` });
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async fetchVoter(req: Request, res: Response) {
      try {
         const tag = paramStr(req.params.tag);
         const id = Number(paramStr(req.params.id));

         const resp = await db.query.election.findFirst({
            where: eq(election.id, id),
         });

         if (resp) {
            const voterData = (resp.voterData as any[]) || [];
            const voter = voterData.find((r: any) => r.tag == tag);

            // Check Vote Status
            const vs = await db.query.elector.findFirst({
               where: and(eq(elector.electionId, id), eq(elector.tag, tag))
            });

            res.status(200).json({ ...resp, voter, voteStatus: !!vs });
         } else {
            res.status(204).json({ message: `no record found` });
         }
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async setupVoters(req: Request, res: Response) {
      try {
         const eid = Number(req.body.electionId);
         const en = await db.query.election.findFirst({
            where: eq(election.id, eid),
            columns: { voterList: true, groupId: true }
         });

         if (en && (en.voterList as any[])?.length) {
            const list = en.voterList as any[];
            const voters = await Promise.all(list.map(async (r: any) => {
               let ts: any;
               if (en.groupId === 1) {
                  ts = await db.query.student.findFirst({
                     where: eq(student.id, r),
                     columns: { fname: true, mname: true, lname: true, id: true, phone: true }
                  });
               } else {
                  ts = await db.query.staff.findFirst({
                     where: eq(staff.staffNo, r),
                     columns: { fname: true, mname: true, lname: true, staffNo: true, phone: true }
                  });
               }

               const us = await db.query.user.findFirst({ where: eq(user.tag, r) });

               return {
                  tag: ts?.id || ts?.staffNo,
                  name: `${ts?.fname} ${ts?.mname ? ts?.mname + ' ' : ''}${ts?.lname}`,
                  username: us?.username,
                  pin: us?.unlockPin,
                  phone: ts?.phone
               };
            }));

            const [updated] = await db.update(election)
               .set({ voterData: voters })
               .where(eq(election.id, eid));

            return res.status(200).json(updated);
         }
         return res.status(202).json({ message: `Voter register not populated` });
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async postVoter(req: Request, res: Response) {
      try {
         const { tag, name } = req.body;
         const id = Number(paramStr(req.params.id));
         const [resp] = await db.update(election)
            .set({
               voterData: sql`JSON_ARRAY_APPEND(COALESCE(${election.voterData}, '[]'), '$', CAST(${JSON.stringify({ tag, name })} AS JSON))`
            })
            .where(eq(election.id, id));
         resp ? res.status(200).json(resp) : res.status(204).json({ message: `no record found` });
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async deleteVoter(req: Request, res: Response) {
      try {
         const tag = paramStr(req.params.tag);
         const id = Number(paramStr(req.params.id));
         const en = await db.query.election.findFirst({ where: eq(election.id, id) });
         if (en) {
            const currentVoters = (en.voterData as any[]) || [];
            const newVoters = currentVoters.filter((v: any) => v.tag !== tag);
            const [resp] = await db.update(election)
               .set({ voterData: newVoters })
               .where(eq(election.id, id));
            res.status(200).json(resp);
         } else {
            res.status(204).json({ message: `no record found` });
         }
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async fetchReceipt(req: Request, res: Response) {
      try {
         const tag = paramStr(req.params.tag);
         const id = paramStr(req.params.id);
         const resp = await db.query.elector.findFirst({
            where: and(eq(elector.tag, tag), eq(elector.electionId, Number(id)))
         });
         resp ? res.status(200).json(resp) : res.status(204).json({ message: `no record found` });
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async fetchPortfolios(req: Request, res: Response) {
      try {
         const resp = await db.query.portfolio.findMany({
            where: eq(portfolio.electionId, Number(paramStr(req.params.id))),
            with: {
               election: true,
               candidate: true,
            }
         });

         if (resp?.length) {
            const formatted = resp?.map(p => ({
               ...p,
               _count: { candidate: p?.candidate?.length }
            }));
            res.status(200).json(formatted);
         } else {
            res.status(204).json({ message: `no records found` });
         }
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async fetchPortfolioList(req: Request, res: Response) {
      try {
         const resp = await db.query.portfolio.findMany({
            where: and(eq(portfolio.status, true), eq(portfolio.electionId, Number(req.query.electionId)))
         });
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

   async fetchPortfolio(req: Request, res: Response) {
      try {
         const resp = await db.query.portfolio.findFirst({
            where: eq(portfolio.id, Number(paramStr(req.params.id))),
            extras: {
               // Replicates Prisma's _count: { candidate: true }
               candidateCount: sql<number>`(
                  SELECT count(*) FROM ${candidate} 
                  WHERE ${candidate.portfolioId} = ${portfolio.id}
               )`.as('candidate_count'),
            },
         });
         resp ? res.status(200).json(resp) : res.status(204).json({ message: `no record found` });

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postPortfolio(req: Request, res: Response) {
      try {
         const [result] = await db.insert(portfolio).values(req.body);
         const insertId = result.insertId;

         if (insertId) {
            await db.insert(candidate).values({
               tag: 'Skip',
               name: 'No / Skip',
               votes: 0,
               orderNo: 0,
               status: true,
               portfolioId: insertId
            } as any);
            res.status(200).json(insertId);
         } else {
            res.status(204).json({ message: `no records found` });
         }
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async updatePortfolio(req: Request, res: Response) {
      try {
         const id = Number(paramStr(req.params.id));
         const [resp] = await db.update(portfolio)
            .set(req.body)
            .where(eq(portfolio.id, id));

         resp ? res.status(200).json(resp) : res.status(204).json({ message: `No records found` });
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async deletePortfolio(req: Request, res: Response) {
      try {
         const id = Number(paramStr(req.params.id));
         await db.delete(candidate).where(eq(candidate.portfolioId, id));

         const [resp] = await db.delete(portfolio).where(eq(portfolio.id, id));
         resp ? res.status(200).json(resp) : res.status(204).json({ message: `No records found` });
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   // Candidates
   async fetchCandidates(req: Request, res: Response) {
      try {
         const pid = Number(paramStr(req.params.id));
         const resp = await db.query.candidate.findMany({
            where: eq(candidate.portfolioId, pid),
            with: { portfolio: true },
            orderBy: [asc(candidate.orderNo)]
         });

         resp.length ? res.status(200).json(resp) : res.status(204).json({ message: `no records found` });
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async fetchCandidate(req: Request, res: Response) {
      try {
         const resp = await db.query.candidate.findFirst({
            where: eq(candidate.id, Number(paramStr(req.params.id))),
            with: { portfolio: true }
         });
         resp ? res.status(200).json(resp) : res.status(204).json({ message: `no record found` });
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async postCandidate(req: Request, res: Response) {
      try {
         const data = { ...req.body };
         if (data.portfolioId) data.portfolioId = Number(data.portfolioId);
         if (data.orderNo) data.orderNo = Number(data.orderNo);

         const [resp] = await db.insert(candidate).values(data);
         resp?.insertId ? res.status(200).json(resp) : res.status(204).json({ message: `could not create candidate` });
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async updateCandidate(req: Request, res: Response) {
      try {
         const id = Number(paramStr(req.params.id));
         const [resp] = await db.update(candidate)
            .set(req.body)
            .where(eq(candidate.id, id));

         resp ? res.status(200).json(resp) : res.status(204).json({ message: `No records found` });
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }

   async deleteCandidate(req: Request, res: Response) {
      try {
         const [resp] = await db.delete(candidate)
            .where(eq(candidate.id, Number(paramStr(req.params.id))));
         resp ? res.status(200).json(resp) : res.status(204).json({ message: `No records found` });
      } catch (error: any) {
         return res.status(500).json({ message: error.message });
      }
   }


}
