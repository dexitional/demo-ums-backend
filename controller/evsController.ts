import { prisma } from "../prisma/client";
import { paramStr } from "../util/paramStr";
import { Request, Response } from "express";
import fs from "fs";
import moment from "moment";
import path from "path";
const evs = prisma;


export default class EvsController {

   // Elections
   async fetchAdminElections(req: Request, res: Response) {
      const { page = 1, pageSize = 6, keyword = '' }: any = req.query;
      const offset = (page - 1) * pageSize;
      let searchCondition = {}
      try {
         if (keyword) searchCondition = {
            where: {
               OR: [
                  { title: { contains: keyword } },
                  //{ id: { contains: keyword } },
               ],
            },
         }
         const resp = await evs.$transaction([
            evs.election.count({
               ...(searchCondition),
            }),
            evs.election.findMany({
               ...(searchCondition),
               include: {
                  group: true,
               },
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

   async fetchElections(req: Request, res: Response) {
      try {
         const resp = await evs.election.findMany({ where: { status: true }, orderBy: { createdAt: 'desc' } })
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

   async fetchMyElections(req: Request, res: Response) {
      try {
         const tag = paramStr(req.params.tag);
         //const tag = '24010001';
         const en = await evs.election.findMany({
            where: {
               status: true,
               OR: [
                  { voterData: { path: '$[*].tag', array_contains: tag } },
                  { admins: { path: '$[*]', array_contains: tag } },
               ]
            },
         })
         if (en?.length) {
            const resp: any = await Promise.all(en?.map(async (r: any) => {
               const ts = await evs.elector.findMany({ where: { electionId: r.id } })
               const rs = await evs.elector.findFirst({ where: { electionId: r.id, tag } })
               return { ...r, turnout: ts.length, voters: ts, voteStatus: !!rs }
            }))

            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchElection(req: Request, res: Response) {
      try {
         const resp: any = await evs.election.findUnique({
            where: { id: Number(paramStr(req.params.id)) },
            include: { group: true },
         })
         if (resp) {
            const ts: any = await evs.elector.count({ where: { electionId: Number(paramStr(req.params.id)) } })
            const tm: any = resp?.voterData && await Promise.all(resp?.voterData?.map(async (r: any) => {
               const ts = await evs.elector.findFirst({ where: { electionId: Number(paramStr(req.params.id)), tag: r?.tag } })
               return { ...r, voteStatus: !!ts }
            }))
            res.status(200).json({ ...resp, voterData: tm, turnout: ts })
         } else {
            res.status(204).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postElection(req: Request, res: Response) {
      try {
         const data = req.body;
         delete data?.logo;
         if (data?.startAt) data.startAt = new Date(data.startAt)
         if (data?.endAt) data.endAt = new Date(data?.endAt)
         if (data?.groupId) data.groupId = Number(data?.groupId)
         if (data?.voterList) data.voterList = JSON.parse(data?.voterList)
         if (data?.status) data.status = !!data?.status
         if (data?.allowMonitor) data.allowMonitor = !!data?.allowMonitor
         if (data?.allowVip) data.allowVip = !!data?.allowVip
         if (data?.allowResult) data.allowResult = !!data?.allowResult
         if (data?.allowMask) data.allowMask = !!data?.allowMask
         if (data?.allowEcMonitor) data.allowEcMonitor = !!data?.allowEcMonitor
         if (data?.allowEcVip) data.allowEcVip = !!data?.allowEcVip
         if (data?.allowEcResult) data.allowEcResult = !!data?.allowEcResult
         if (data?.autoStop) data.autoStop = !!data?.autoStop
         const logo: any = req?.files?.logo;
         const resp = await evs.election.create({ data: data })
         if (resp) {
            // Create Upload Folder
            fs.mkdirSync(path.join(__dirname, "/../../public/cdn/evs") + `/${resp.id}`)
            // Upload Logo
            const eid = resp?.id;
            const dest = path.join(__dirname, "/../../public/cdn/photo/evs/", (eid?.toString()?.trim()?.toLowerCase()) + ".png");
            if (logo)
               logo.mv(dest, function (err: any) {
                  if (err) console.log(err);
               })
            // Return Response Data
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async updateElection(req: Request, res: Response) {
      try {
         let data: any = req.body;

         delete data?.logo;
         if (data?.startAt) data.startAt = new Date(data.startAt)
         if (data?.endAt) data.endAt = new Date(data?.endAt)
         if (data?.groupId) data.groupId = Number(data?.groupId)
         if (data?.voterList) data.voterList = JSON.parse(data?.voterList)
         if (data?.status) data.status = Boolean(Number(data?.status))
         if (data?.allowMonitor) data.allowMonitor = Boolean(Number(data?.allowMonitor))
         if (data?.allowVip) data.allowVip = Boolean(Number(data?.allowVip))
         if (data?.allowResult) data.allowResult = Boolean(Number(data?.allowResult))
         if (data?.allowMask !== undefined) data.allowMask = Boolean(Number(data?.allowMask))
         if (data?.allowEcMonitor) data.allowEcMonitor = Boolean(Number(data?.allowEcMonitor))
         if (data?.allowEcVip) data.allowEcVip = Boolean(Number(data?.allowEcVip))
         if (data?.allowEcResult) data.allowEcResult = Boolean(Number(data?.allowEcResult))
         if (data?.autoStop) data.autoStop = Boolean(Number(data?.autoStop))
         
         const logo: any = req?.files?.logo;
         const resp = await evs.election.update({
            where: { id: Number(paramStr(req.params.id)) },
            data: data
         })
         if (resp) {
            // Upload Logo
            const eid = resp?.id;
            const dest = path.join(__dirname, "/../../public/cdn/photo/evs/", (eid?.toString()?.trim()?.toLowerCase()) + ".png");
            if (logo)
               logo.mv(dest, function (err: any) {
                  if (err) console.log(err);
               })
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `No records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async deleteElection(req: Request, res: Response) {
      try {
         const resp = await evs.election.delete({
            where: { id: Number(paramStr(req.params.id)) }
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

   // Action
   async actionReset(req: Request, res: Response) {
      try {
         const { electionId } = req.body;
         // Reset Candidates votes
         await evs.candidate.updateMany({
            where: { portfolio: { electionId: Number(electionId) } },
            data: { votes: 0 }
         })
         // Delete Voted Users
         const resp = await evs.elector.deleteMany({
            where: { electionId: Number(electionId) }
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

   async actionAdmin(req: Request, res: Response) {
      try {
         const { tag, electionId } = req.body
         const election: any = await evs.election.findUnique({ where: { id: Number(electionId) } })
         if (election) {
            const { admins } = election;
            const vt = admins.find((r: any) => r?.toLowerCase() == tag?.toLowerCase())
            let newAdmins;
            if (vt) {
               newAdmins = admins.filter((r: any) => r?.toLowerCase() != tag?.toLowerCase())
            } else {
               newAdmins = [...admins, tag]
            }

            const resp = await evs.election.update({
               where: { id: Number(electionId) },
               data: {
                  admins: newAdmins
               }
            })

            if (resp) {
               return res.status(200).json(resp)
            } else {
               return res.status(202).json({ message: `No record found!` })
            }
         }
         else return res.status(202).json({ message: `Election not staged!` })

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async actionVoters(req: Request, res: Response) {
      try {
         const resp = await evs.election.create({ data: req.body })
         if (resp) {
            // Create Upload Folder
            fs.mkdirSync(path.join(__dirname, "/../../public/cdn/evs") + `/${resp.id}`)
            // Return Response Data
            res.status(200).json(resp)
         } else {
            res.status(204).json({ message: `no records found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   // Voters & Votes
   async postVotes(req: Request, res: Response) {
      try {
         await evs.$transaction(async (tx: any) => {
            let { id, tag, votes } = req.body;
            const ip = req.ip;
            if (!tag) throw new Error(`Request user not found`);
            if (!id) throw new Error(`Request ID not found`);

            const en = await tx.election.findFirst({
               where: { id: Number(id), status: true, voterData: { path: '$[*].tag', array_contains: tag } },
            })

            if (en) {
               // Check Vote Status
               const ev = await tx.elector.findFirst({ where: { electionId: Number(id), tag } });
               if (ev) throw new Error(`Elector already voted`);
               // Check IF Election is still Opened for Grace Period
               if (en?.status && (en?.action == 'STARTED' || (en?.action == 'ENDED' && moment().diff(moment(en?.endAt), 'seconds') <= 120))) {
                  // Record Vote ( If not voted )
                  //const sels = votes.split(",");
                  if (votes.length) {
                     const resp: any = await Promise.all(votes?.map(async (cid: any) => {
                        return await tx.candidate.updateMany({
                           where: { id: Number(cid) },
                           data: { votes: { increment: 1 } }
                        })
                     }))
                     // Check Number of Recorded Votes
                     if (resp?.length != votes.length) throw new Error(`Vote Submission Disallowed`);
                     // Record Voter
                     const vs = en?.voterData?.find((r: any) => r.tag == tag);
                     await tx.elector.create({
                        data: {
                           voteStatus: true,
                           voteSum: Object.values(votes).join(","),
                           voteTime: new Date(),
                           voteIp: ip,
                           name: vs?.name,
                           tag,
                           election: { connect: { id: Number(id) } }
                        }
                     })
                     // Load New Data Set Broadcast
                     let portfolios = await evs.portfolio.findMany({ where: { electionId: Number(id) } })
                     const election = await evs.election.findUnique({ where: { id: Number(id) } })
                     const electors = await evs.elector.findMany({ where: { electionId: Number(id) } })
                     if (election && portfolios) {
                        portfolios = await Promise.all(portfolios?.map(async (r: any) => {
                           const candidates = await evs.candidate.findMany({ where: { status: true, portfolioId: r.id }, include: { portfolio: { select: { electionId: true } } }, orderBy: [{ votes: 'desc' }, { orderNo: 'asc' }] })
                           return { ...r, candidates }
                        }))
                        
                        if (req.app && req.app.locals && typeof req.app.locals.broadcastElection === "function") {
                           req.app.locals.broadcastElection(Number(id), { election, portfolios, electors });
                        }
                     }

                     // Return Success Status
                     res.status(200).json(resp)

                  } else throw new Error(`Votes invalid!`);

               } else throw new Error(`Election is closed!`);
            } else throw new Error(`Elector not qualified!`);
         },{
            maxWait: 5000, // 5 seconds
            timeout: 10000, // 10 seconds
         })

      } catch (error: any) {
         return res.status(203).json({ message: error.message })
      }
   }

   async fetchVotes(req: Request, res: Response) {
      try {
         const id = paramStr(req.params.id);
         let portfolios = await evs.portfolio.findMany({ where: { electionId: Number(id) } })
         const election = await evs.election.findUnique({ where: { id: Number(id) } })
         const electors = await evs.elector.findMany({ where: { electionId: Number(id) } })
         if (election && portfolios) {
            portfolios = await Promise.all(portfolios?.map(async (r: any) => {
               const candidates = await evs.candidate.findMany({ where: { status: true, portfolioId: r.id }, include: { portfolio: { select: { electionId: true } } }, orderBy: [{ votes: 'desc' }, { orderNo: 'asc' }] })
               return { ...r, candidates }
            }))
            res.status(200).json({ election, portfolios, electors })
         } else {
            res.status(204).json({ message: `no records found` })
         }

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchVoters(req: Request, res: Response) {
      try {
         const resp = await evs.election.findUnique({
            where: { id: Number(paramStr(req.params.id)) },
            select: { voterData: true }
         })
         if (resp) {
            // Check Mask on vote Status
            res.status(200).json(resp?.voterData)
         } else {
            res.status(204).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async fetchVoter(req: Request, res: Response) {
      try {
         const tag = paramStr(req.params.tag);
         const resp = await evs.election.findUnique({
            where: { id: Number(paramStr(req.params.id)) },
         })
         if (resp) {
            const voterData: any = resp?.voterData;
            const voter: any = voterData?.find((r: any) => r.tag == tag)
            // Check Vote Status
            const vs = await evs.elector.findFirst({ where: { electionId: Number(paramStr(req.params.id)), tag } })
            // Return Response
            res.status(200).json({ ...resp, voter, voteStatus: !!vs })
         } else {
            res.status(204).json({ message: `no record found` })
         }
      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async setupVoters(req: Request, res: Response) {
      try {
         const en = await evs.election.findUnique({ select: { voterList: true, groupId: true }, where: { id: Number(req.body.electionId) } });
         if (en) {
            const list: any = en?.voterList;
            if (list?.length) {
               const voters = await Promise.all(list?.map(async (r: any) => {
                  const ts: any = en.groupId == 1
                     ? await evs.student.findFirst({ select: { fname: true, mname: true, lname: true, id: true, phone: true }, where: { id: r } })
                     : await evs.staff.findFirst({ select: { fname: true, mname: true, lname: true, staffNo: true, phone: true }, where: { staffNo: r } });
                  const us = await evs.user.findFirst({ where: { tag: r } })
                  return ({ tag: ts?.id || ts?.staffNo, name: `${ts?.fname} ${ts?.mname && ts?.mname + ' '}${ts?.lname}`, username: us?.username, pin: us?.unlockPin, phone: ts?.phone })
               }));
               const resp = await evs.election.update({
                  where: { id: Number(req.body.electionId) },
                  data: { voterData: voters }
               })
               // Return Response
               return res.status(200).json(resp)
            }
         }
         return res.status(202).json({ message: `Voter register not populated` })

      } catch (error: any) {
         console.log(error)
         return res.status(500).json({ message: error.message })
      }
   }

   async postVoter(req: Request, res: Response) {
      try {
         const { tag, name } = req.body
         const resp = await evs.election.update({
            where: { id: Number(paramStr(req.params.id)) },
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

   async deleteVoter(req: Request, res: Response) {
      try {
         const tag = paramStr(req.params.tag);
         const resp = await evs.election.update({
            where: {
               id: Number(paramStr(req.params.id)),
               voterData: { path: '$.tag', array_contains: tag }
            },
            data: {
               voterData: { jsonb_remove: { path: '$[*]' } }
            }
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

   // Receipt or Transcript
   async fetchReceipt(req: Request, res: Response) {
      try {
         const tag = paramStr(req.params.tag);
         const id = paramStr(req.params.id);
         const resp = await evs.elector.findFirst({
            where: { tag, electionId: Number(id) },
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

   // Portfolios
   async fetchPortfolios(req: Request, res: Response) {
      try {
         const resp = await evs.portfolio.findMany({
            where: { electionId: Number(paramStr(req.params.id)) },
            include: {
               _count: { select: { candidate: true } },
               election: true
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

   async fetchPortfolioList(req: Request, res: Response) {
      try {
         const resp = await evs.portfolio.findMany({
            where: { status: true, electionId: Number(req.query.electionId) }
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

   async fetchPortfolio(req: Request, res: Response) {
      try {
         const resp = await evs.portfolio.findUnique({
            where: { id: Number(paramStr(req.params.id)) },
            include: { _count: { select: { candidate: true } } }
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

   async postPortfolio(req: Request, res: Response) {
      try {
         const resp = await evs.portfolio.create({ data: req.body });
         if (resp) {
            // Auto-Create Skip/No Candidate
            await evs.candidate.create({ data: {
                 tag:'Skip',
                 name: 'No / Skip',
                 votes: 0,
                 orderNo: 0,
                 status: true,
                 portfolioId: resp?.id
            }});
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

   async updatePortfolio(req: Request, res: Response) {
      try {
         const resp = await evs.portfolio.update({
            where: { id: Number(paramStr(req.params.id)) },
            data: req.body
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

   async deletePortfolio(req: Request, res: Response) {
      try {
         console.log(`delete ID: ${paramStr(req.params.id)}`)
         // Delete Candidates
         // await evs.portfolio.$executeRaw`DELETE FROM evs_candidate where portfolioId = ${(Number(paramStr(req.params.id))}`
         // Delete Portfolio
         const resp = await evs.portfolio.delete({
            where: { id: Number(paramStr(req.params.id)) }
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

   // Candidates
   async fetchCandidates(req: Request, res: Response) {
      try {
         const resp = await evs.candidate.findMany({ where: { portfolioId: Number(paramStr(req.params.id)) } })
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

   async fetchCandidate(req: Request, res: Response) {
      try {
         const resp = await evs.candidate.findUnique({
            where: { id: Number(paramStr(req.params.id)) },
            include: { portfolio: { select: { electionId: true } } }
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

   async postCandidate(req: Request, res: Response) {
      try {
         const { portfolioId } = req.body
         const lastCandidate: any = await evs.candidate.findFirst({ where: { portfolioId: Number(portfolioId) }, orderBy: { 'orderNo': 'desc' } })
         let data = req.body;
         delete data.photo; delete data.portfolioId;
         data.orderNo = data.orderNo > 0 ? Number(data.orderNo) : (lastCandidate?.orderNo + 1);
         data.tag = data?.name?.split(" ")[0]?.trim()?.toLowerCase();
         data.status = !!data.status
         const photo: any = req?.files?.photo;
         const resp = await evs.candidate.create({
            data: {
               ...data,
               ...portfolioId && ({ portfolio: { connect: { id: Number(portfolioId) } } }),
            },
            include: { portfolio: true }
         })
         if (resp) {
            // Upload Photo
            const tag = resp?.id;
            const eid = resp?.portfolio?.electionId;
            const dest = path.join(__dirname, "/../../public/cdn/photo/evs/" + eid, (tag?.toString()?.trim()?.toLowerCase()) + ".jpg");
            if (photo)
               photo.mv(dest, function (err: any) {
                  if (err) console.log(err);
               })
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

   async updateCandidate(req: Request, res: Response) {
      try {
         const { portfolioId } = req.body
         const lastCandidate: any = await evs.candidate.findFirst({ where: { portfolioId: Number(portfolioId) }, orderBy: { 'orderNo': 'desc' } })

         let data = req.body;
         delete data.photo; delete data.portfolioId;
         data.orderNo = data?.orderNo > 0 ? Number(data.orderNo) : (lastCandidate?.orderNo + 1);
         data.tag = data?.name?.split(" ")[0]?.trim()?.toLowerCase();
         data.status = !!data.status
         const photo: any = req?.files?.photo;
         const resp = await evs.candidate.update({
            where: { id: Number(paramStr(req.params.id)) },
            data: {
               ...data,
               ...portfolioId && ({ portfolio: { connect: { id: Number(portfolioId) } } }),
            },
            include: { portfolio: true }
         })
         if (resp) {
            // Upload Photo
            const tag = resp?.id;
            const eid = resp?.portfolio?.electionId;
            const dest = path.join(__dirname, "/../../public/cdn/photo/evs/" + eid, (tag?.toString()?.trim()?.toLowerCase()) + ".jpg");
            if (photo)
               photo.mv(dest, function (err: any) {
                  if (err) console.log(err);
               })
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

   async deleteCandidate(req: Request, res: Response) {
      try {
         const resp = await evs.candidate.delete({
            where: { id: Number(paramStr(req.params.id)) }
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


   async postEvsData(req: Request, res: Response) {
      try {
         const resp = await evs.session.findMany({ where: { status: true }, orderBy: { title: 'asc' } })
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

   async fetchEvsMonitor(req: Request, res: Response) {
      try {
         const resp = await evs.session.findMany({ where: { status: true }, orderBy: { title: 'asc' } })
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

   async fetchEvsData(req: Request, res: Response) {
      try {
         const resp = await evs.session.findMany({ where: { status: true }, orderBy: { title: 'asc' } })
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




}