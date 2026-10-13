import pool from "../config/db.js";

export default async function connectToDB() {
  const res = await pool.query("SELECT NOW()");
  console.log(res.rows[0]);
}
