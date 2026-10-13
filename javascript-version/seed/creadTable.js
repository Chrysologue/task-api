import pool from "../config/db.js";

async function createUserTable() {
  await pool.query("CREATE EXTENSION IF NOT EXISTS pgcrypto");
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
            user_id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
            name VARCHAR NOT NULL,
            email VARCHAR NOT NULL UNIQUE,
            password CHARACTER VARYING(100) NOT NULL,
            role VARCHAR NOT NULL DEFAULT 'user'
        )
        `);
}

async function createTaskTable() {
  await pool.query("CREATE EXTENSION IF NOT EXISTS pgcrypto");
  await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks(
            task_id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
            title VARCHAR NOT NULL,
            description TEXT NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT FALSE,
            user_id UUID NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
            CONSTRAINT task_fk FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
        `);
}

export default async function createTable() {
  (await createUserTable(), await createTaskTable());
}
