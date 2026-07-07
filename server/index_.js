"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const aisRoute_1 = __importDefault(require("./route/aisRoute"));
const amsRoute_1 = __importDefault(require("./route/amsRoute"));
const apiRoute_1 = __importDefault(require("./route/apiRoute"));
const authRoute_1 = __importDefault(require("./route/authRoute"));
const evsRoute_1 = __importDefault(require("./route/evsRoute"));
const fmsRoute_1 = __importDefault(require("./route/fmsRoute"));
const hrsRoute_1 = __importDefault(require("./route/hrsRoute"));
dotenv_1.default.config();
const fileUpload = require('express-fileupload');
const cors = require('cors');
const compression = require('compression');
const app = (0, express_1.default)();
const port = process.env.PORT || 5030;
class Routes {
    constructor(app) {
        // Middlewares
        app.use(body_parser_1.default.json({ limit: '50mb' }));
        app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
        app.use("/public", express_1.default.static("public"));
        app.use(cors());
        //app.use(fileUpload());
        app.use(fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 },
        }));
        // Compress Responses
        app.use(compression());
        // Security Guards
        app.use((0, helmet_1.default)());
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
        app.use("/api/v1", apiRoute_1.default); /** Bank API **/
        // Initialize Server
        app.listen(port, () => console.log(`⚡️[server]: Server is running at http://localhost:${port}`));
    }
}
exports.default = Routes;
// Bootstrap Application
new Routes(app);
