"use strict";
require('dotenv').config();
var mysql = require('mysql2');
var util = require('util');
//var pool = mysql.createPool(`${process.env.HRMS_URL}?charset=utf8mb4&connectionLimit=100&multipleStatements=true`);
var pool = mysql.createPool({
    multipleStatements: true,
    connectionLimit: 100,
    host: process.env.MYSQL_HOST,
    port: 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
});
pool.getConnection((err, conn) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
    }
    if (conn)
        pool.releaseConnection();
    return;
});
pool.query = util.promisify(pool.query);
module.exports = pool;
/*

 // get the client
  const mysql = require('mysql2');
  // create the pool
  const pool = mysql.createPool({host:'localhost', user: 'root', database: 'test'});
  // now get a Promise wrapped instance of that pool
  const promisePool = pool.promise();
  // query database using promises
  const [rows,fields] = await promisePool.query("SELECT 1");


  // var pool = mysql.createPool({
//     multipleStatements: true,
//     connectionLimit : 1000,
//     host : 'localhost',
//     port : 3306,
//     user: 'root',
//     password : 'DHRCdodowa1',
//     database : 'hr',
// });

*/ 
