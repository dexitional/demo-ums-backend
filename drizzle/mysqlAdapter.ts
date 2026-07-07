require('dotenv').config()
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from '../drizzle/schema';
import * as relations from '../drizzle/relations';

const client = mysql.createPool({
    multipleStatements: true,
    connectionLimit : 10,
    host : process.env.MYSQL_HOST,
    port : 3306,
    user: process.env.MYSQL_USER,
    password : process.env.MYSQL_PASS,
    database : process.env.MYSQL_DB,
});

export const db = drizzle(client, { schema: { ...schema, ...relations }, mode: 'default' });
