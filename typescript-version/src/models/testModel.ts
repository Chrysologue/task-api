import pool from "../config/db.js";

export default async function testConnection(): Promise<void> {
  const result = await pool.query(`
            SELECT NOW()
        `);
  console.log(result.rows[0]);
}
