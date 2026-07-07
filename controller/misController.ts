import { prisma } from "../prisma/client";
import { Request, Response } from "express";
// import { PrismaClient } from "../prisma/client";
//import sha1 from "sha1";
const ais = prisma;
const sha1 = require('sha1');
const { customAlphabet } = require("nanoid");
const pwdgen = customAlphabet("1234567890abcdefghijklmnopqrstuvwzyx", 6);



export default class MisController {

   async fetchTest(req: Request, res: Response) {
      try {
         const tag = 'Kobby Blayssadsad';
         const resp = await ais.election.findMany({
            // where: { status: true, voterList: { path: '$[*].tag', equals: tag }},
            // where: { status: true, voterList: { path: '$[*]', equals: tag }},

            // where: { voterList: { equals: tag }},
            // where: { voterList: { array_contains: tag }},

            // where: { voterData: { array_contains: tag }},

            where: { voterData: { path: '$.tag', array_contains: tag } },
         })

         console.log(resp)
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

   async fetchElections(req: Request, res: Response) {
      try {
         const resp = await ais.election.findMany()
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