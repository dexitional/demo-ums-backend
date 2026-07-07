import { PrismaMariaDb } from "@prisma/adapter-mariadb";

function getMySqlConfigFromEnv() {
    const host = process.env.MYSQL_HOST?.trim();
    const port = Number(process.env.MYSQL_PORT || 3306);
    const user = process.env.MYSQL_USER?.trim();
    const password = process.env.MYSQL_PASS;
    const database = process.env.MYSQL_DB?.trim();
    
    if (host && user && typeof password === "string" && database) {
        return { host, port, user, password, database };
    }

    const urlString = process.env.UMS_URL || process.env.DATABASE_URL;
    if (!urlString) {
        throw new Error(
            "Database env missing. Set MYSQL_HOST/MYSQL_USER/MYSQL_PASS/MYSQL_DB or UMS_URL (or DATABASE_URL)."
        );
    }

    const url = new URL(urlString.replace(/^mysql2:/, "mysql:"));
    const parsedHost = url.hostname;
    const parsedPort = url.port ? Number(url.port) : 3306;
    const parsedUser = decodeURIComponent(url.username || "");
    const parsedPassword = decodeURIComponent(url.password || "");
    const parsedDatabase = url.pathname?.replace(/^\//, "");

    if (!parsedHost || !parsedUser || !parsedDatabase) {
        throw new Error(
            "Database URL is invalid (missing host/user/database). Check UMS_URL / DATABASE_URL."
        );
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

export const mysqlAdapter = new PrismaMariaDb({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    connectionLimit: Number(process.env.MYSQL_LIMIT?.trim()) || 20
});