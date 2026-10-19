import "dotenv/config";
import mysql from "mysql2/promise";

const useSSL = process.env.DB_SSL === "true";

let ssl;
if (useSSL) {
  ssl = process.env.DB_CA
    ? { ca: process.env.DB_CA, rejectUnauthorized: true }
    : { rejectUnauthorized: false };
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl,
  waitForConnections: true,
  connectionLimit: 2,
});

export default pool;