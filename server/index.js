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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const aisRoute_1 = __importDefault(require("./route/aisRoute"));
const amsRoute_1 = __importDefault(require("./route/amsRoute"));
const apiRoute_1 = __importDefault(require("./route/apiRoute"));
const authRoute_1 = __importDefault(require("./route/authRoute"));
const evaRoute_1 = __importDefault(require("./route/evaRoute"));
const evsRoute_1 = __importDefault(require("./route/evsRoute"));
const fmsRoute_1 = __importDefault(require("./route/fmsRoute"));
const hrsRoute_1 = __importDefault(require("./route/hrsRoute"));
const node_http_1 = require("node:http");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
// @ts-ignore: No type definitions available
const cors_1 = __importDefault(require("cors"));
// @ts-ignore: No type definitions available
const compression_1 = __importDefault(require("compression"));
const node_path_1 = __importDefault(require("node:path"));
const backup_1 = require("./util/backup");
const cron_1 = require("./util/cron");
const server_1 = require("./util/ws/server");
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const PORT = process.env.PORT || 5030;
const requestIp = require('request-ip');
// Attach WebSocket server to the HTTP server
const { broadcastMatchCreated, broadcastStats, broadcastElection } = (0, server_1.attachWebSocketServer)(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastStats = broadcastStats;
app.locals.broadcastElection = broadcastElection;
class Routes {
    constructor(app) {
        // Middlewares
        app.use(body_parser_1.default.json({ limit: '50mb' }));
        app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
        app.use("/public", express_1.default.static("public", {
            maxAge: 31536000000, // Time in milliseconds
            immutable: true, // Prevents re-validation for hashed filenames
            setHeaders: (res, filePath) => {
                // Optional: Only apply to images if your folder has mixed content
                if (['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(node_path_1.default.extname(filePath))) {
                    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
                }
            }
        }));
        app.use((0, cors_1.default)());
        app.use((0, express_fileupload_1.default)({ limits: { fileSize: 50 * 1024 * 1024 } }));
        app.use((0, compression_1.default)());
        app.use((0, helmet_1.default)());
        app.use(requestIp.mw());
        // Token Initializations
        app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
            next();
        });
        // Routes & Endpoints
        app.get('/', (req, res) => { res.send("test"); });
        app.use("/api/auth", authRoute_1.default); /** Authentication API **/
        app.use("/api/ais", aisRoute_1.default); /** Academics API **/
        app.use("/api/ams", amsRoute_1.default); /** Admissions API **/
        app.use("/api/fms", fmsRoute_1.default); /** Finance API **/
        app.use("/api/hrs", hrsRoute_1.default); /** HRS API **/
        app.use("/api/evs", evsRoute_1.default); /** Electa API **/
        app.use("/api/eva", evaRoute_1.default); /** Evaluation API **/
        app.use("/api/v1", apiRoute_1.default); /** Bank API **/
        // Database Backup Route
        app.get('/api/backup', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, backup_1.performBackup)();
            if (result.success) {
                res.json({ message: 'Backup successful', file: result.file });
            }
            else {
                res.status(500).json({ error: 'Backup failed', details: result.error });
            }
        }));
    }
}
exports.default = Routes;
// Bootstrap Application using Multiple Cores or Threads
// if (cluster.isPrimary) {
//   for (let i = 0; i < availableParallelism(); i++) {
//     cluster.fork()
//   }
// } else {
// Bootstrap Application
new Routes(app);
// Run Cron Jobs
(0, cron_1.runCronJobs)();
// Listen with the real HTTP server (so WebSocket upgrade requests work!)
server.listen(PORT, () => console.log(`⚡️[server]: Server (w/ websocket) running at http://localhost:${PORT}`));
// }
