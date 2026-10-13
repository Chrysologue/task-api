import pool from "../config/db.js";
import bcrypt from "bcrypt";

export async function getAllUsers() {
  const result = await pool.query(`
            SELECT user_id, name, email FROM users
        `);
  return result.rows;
}

export async function getUserById(id) {
  const result = await pool.query(
    `
            SELECT user_id, name, email FROM users WHERE user_id = $1
        `,
    [id],
  );

  return result.rows[0];
}
export async function getUserByEmail(email) {
  const result = await pool.query(
    `
            SELECT * FROM users WHERE email = $1
        `,
    [email.trim().toLowerCase()],
  );
  return result.rows[0];
}

export async function updateUser(id, user) {
  const values = [];
  const fields = [];
  if (user.email !== undefined || user.role !== undefined) {
    throw new Error("Invalid operation");
  }
  if (user.name !== undefined) {
    values.push(user.name);
    fields.push(`name=$${values.length}`);
  }
  if (user.password !== undefined) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    values.push(hashedPassword);
    fields.push(`password=$${values.length}`);
  }
  if (fields.length === 0) {
    return null;
  }
  values.push(id);

  const result = await pool.query(
    `
            UPDATE users
            SET ${fields.join(", ")}
            WHERE user_id=$${values.length}
            RETURNING user_id, name, email
        `,
    values,
  );
  return result.rows[0];
}

export async function createUser(user) {
  const result = await pool.query(
    `
            INSERT INTO users(name, email, password)
            VALUES($1, $2, $3)
            RETURNING user_id, name, email
        `,
    [user.name, user.email, user.password],
  );

  return result.rows[0];
}

export async function deleteUser(id) {
  const result = await pool.query(
    `
        DELETE FROM users
        WHERE user_id=$1
        RETURNING user_id, name, email
        `,
    [id],
  );
  return result.result.rows[0];
}
