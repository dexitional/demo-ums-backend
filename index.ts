import 'dotenv/config';
import bodyParser from 'body-parser';
import express, { Application, Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import aisRoute from './route/aisRoute';
import amsRoute from './route/amsRoute';
import apiRoute from './route/apiRoute';
import authRoute from "./route/authRoute";
import evaRoute from './route/evaRoute';
import evsRoute from './route/evsRoute';
import fmsRoute from './route/fmsRoute';
import hrsRoute from './route/hrsRoute';

import { createServer } from 'node:http';
import fileUpload from 'express-fileupload';
// @ts-ignore: No type definitions available
import cors from 'cors';
// @ts-ignore: No type definitions available
import compression from 'compression';
import path from 'node:path';
import { performBackup } from './util/backup';
import { runCronJobs } from './util/cron';
import { attachWebSocketServer } from './util/ws/server';
const app: Express = express();
const server = createServer(app);
const PORT = process.env.PORT || 5030;
const requestIp = require('request-ip');



// Attach WebSocket server to the HTTP server
const { broadcastMatchCreated, broadcastStats, broadcastElection } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastStats = broadcastStats;
app.locals.broadcastElection = broadcastElection;

export default class Routes {
  constructor(app: Application) {
    // Middlewares
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    app.use("/public", express.static("public", {
      maxAge: 31536000000,    // Time in milliseconds
      immutable: true,        // Prevents re-validation for hashed filenames
      setHeaders: (res, filePath) => {
        // Optional: Only apply to images if your folder has mixed content
        if (['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(path.extname(filePath))) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));

    app.use(cors());
    app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
    app.use(compression());
    app.use(helmet());
    app.use(requestIp.mw());
    // Token Initializations
    app.use(function (req: Request, res: Response, next: NextFunction) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    // Routes & Endpoints
    app.get('/', (req, res) => { res.send("test") });
    app.use("/api/auth", authRoute);    /** Authentication API **/
    app.use("/api/ais", aisRoute);      /** Academics API **/
    app.use("/api/ams", amsRoute);      /** Admissions API **/
    app.use("/api/fms", fmsRoute);      /** Finance API **/
    app.use("/api/hrs", hrsRoute);      /** HRS API **/
    app.use("/api/evs", evsRoute);      /** Electa API **/
    app.use("/api/eva", evaRoute);      /** Evaluation API **/
    app.use("/api/v1", apiRoute);       /** Bank API **/

    // Database Backup Route
    app.get('/api/backup', async (req: Request, res: Response) => {
      const result = await performBackup();
      if (result.success) {
        res.json({ message: 'Backup successful', file: result.file });
      } else {
        res.status(500).json({ error: 'Backup failed', details: result.error });
      }
    });


  }
}

// Bootstrap Application using Multiple Cores or Threads
// if (cluster.isPrimary) {
//   for (let i = 0; i < availableParallelism(); i++) {
//     cluster.fork()
//   }
// } else {
// Bootstrap Application
new Routes(app);
// Run Cron Jobs
runCronJobs();

// Listen with the real HTTP server (so WebSocket upgrade requests work!)
server.listen(PORT, () =>
  console.log(`⚡️[server]: Server (w/ websocket) running at http://localhost:${PORT}`)
);
// }