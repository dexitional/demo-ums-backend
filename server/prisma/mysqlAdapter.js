"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysqlAdapter = void 0;
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
function getMySqlConfigFromEnv() {
    var _a, _b, _c, _d;
    const host = (_a = process.env.MYSQL_HOST) === null || _a === void 0 ? void 0 : _a.trim();
    const port = Number(process.env.MYSQL_PORT || 3306);
    const user = (_b = process.env.MYSQL_USER) === null || _b === void 0 ? void 0 : _b.trim();
    const password = process.env.MYSQL_PASS;
    const database = (_c = process.env.MYSQL_DB) === null || _c === void 0 ? void 0 : _c.trim();
    if (host && user && typeof password === "string" && database) {
        return { host, port, user, password, database };
    }
    const urlString = process.env.UMS_URL || process.env.DATABASE_URL;
    if (!urlString) {
        throw new Error("Database env missing. Set MYSQL_HOST/MYSQL_USER/MYSQL_PASS/MYSQL_DB or UMS_URL (or DATABASE_URL).");
    }
    const url = new URL(urlString.replace(/^mysql2:/, "mysql:"));
    const parsedHost = url.hostname;
    const parsedPort = url.port ? Number(url.port) : 3306;
    const parsedUser = decodeURIComponent(url.username || "");
    const parsedPassword = decodeURIComponent(url.password || "");
    const parsedDatabase = (_d = url.pathname) === null || _d === void 0 ? void 0 : _d.replace(/^\//, "");
    if (!parsedHost || !parsedUser || !parsedDatabase) {
        throw new Error("Database URL is invalid (missing host/user/database). Check UMS_URL / DATABASE_URL.");
    }
    return {
        host: parsedHost,
        port: parsedPort,
        user: parsedUser,
        password: parsedPassword,
        database: parsedDatabase,
    };
}
const cfg = getMySqlConfigFromEnv();
exports.mysqlAdapter = new adapter_mariadb_1.PrismaMariaDb({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    connectionLimit: Number((_a = process.env.MYSQL_LIMIT) === null || _a === void 0 ? void 0 : _a.trim()) || 20
});
