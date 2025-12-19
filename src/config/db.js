import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "book_store",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

