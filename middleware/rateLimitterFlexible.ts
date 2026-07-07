import { NextFunction, Request, Response } from "express";
import { prisma } from "../prisma/client";
const ais: any = prisma;
const { default: axios } = require("axios");
const db = require("../config/mysql");
const { RateLimiterMemory, RateLimiterMySQL } = require("rate-limiter-flexible");

const opts = {
  storeClient: db,
  dbName: 'ums',
  tableName: 'rate', // all limiters store data in one table
  duration: 3,   // Per Second
  points: 1    // Requests
};

// const rateLimiter = new RateLimiterMemory({
//     duration: 3,   // Per Second
//     points:   1    // Requests
// });

const rateLimiter: any = new RateLimiterMySQL(opts, (err: any) => console.log(err))
const voteLimiter: any = (req: Request & any, res: Response, next: NextFunction) => {
  rateLimiter
    .consume(req.userId)
    .then((rateLimiterRes: any) => {
      res.setHeader('Retry-After', rateLimiterRes.msBeforeNext / 1000);
      res.setHeader('X-RateLimit-Limit', 1);
      res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateLimiterRes.msBeforeNext).toISOString());
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      next();
    })
    .catch(async () => {

      // Log to Rate Attacks
      axios.get(`https://geolocation-db.com/json/`).then(async ({ data }: any) => {
        await ais.attack.create({
          data: {
            tag: req?.userId,
            ip: data?.IPv4,
            location: `Country: ${data?.country_name}, Coordinates: [ Lat ${data?.latitude}, Long ${data?.longitude} ] ${data?.city && data?.city != 'null' && ', City: ' + data?.city}`,
            meta: "RATE ATTACK"
          }
        })
      })

      res.status(429).json({ message: 'Too Many Requests !' });
    });
};



module.exports = {
  voteLimiter
}


// EH/BSS/19/0234 - adongo
// EH/ACT/20/0075 - abanga

