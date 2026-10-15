import pool from "../config/db.js";
import { User, UserByEmail, UpdateUser, CreateUser } from "../types/user.js";

export async function getAllUsers(): Promise<User[]> {
  const results = await pool.query(
    `
        SELECT user_id, name, email
        FROM users
        `
  );
  return results.rows;
}

export async function getUserByID(id: string): Promise<User | null> {
  const result = await pool.query(
    `
            SELECT user_id, name, email
            FROM users WHERE user_id=$1
        `,
    [id]
  );
  return result.rows[0];
}

export async function getUserByEmail(email: string): Promise<UserByEmail | null> {
  const result = await pool.query(
    `
            SELECT * FROM users
            WHERE email=$1
        `,
    [email]
  );
  return result.rows[0];
}

export async function deleteUser(id: string): Promise<User | null> {
  const result = await pool.query(
    `
        DELETE FROM users
        WHERE user_id=$1
        RETURNING user_id, name, email
        `,
    [id]
  );
  return result.rows[0];
}

export async function updateUser(id: string, user: UpdateUser): Promise<User | null> {
  const values: unknown[] = [];
  const fields: string[] = [];

  if (user.name !== undefined) {
    values.push(user.name);
    fields.push(`name=$${values.length}`);
  }
  if (user.password !== undefined) {
    values.push(user.password);
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
    values
  );
  return result.rows[0];
}

export async function createUser(userData: CreateUser) : Promise<User> {
  const result = await pool.query(`
      INSERT INTO users(name, email, password)
      VALUES($1, $2, $3) RETURNING user_id, name, email
    `, [userData.name, userData.email, userData.password])

    return result.rows[0]
}