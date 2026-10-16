import pool from "../config/db.js";
import { CreateTask, Task, UserTask, UpdateTask } from "../types/task.js";

export async function createTask(task: CreateTask): Promise<Task> {
  const result = await pool.query(
    `
            INSERT INTO tasks(title, description, user_id)
            VALUES($1, $2, $3) RETURNING *
        `,
    [task.title, task.description, task.user_id]
  );

  return result.rows[0];
}

export async function getAllTasksByAdmin(): Promise<Task[]> {
  const results = await pool.query(`
            SELECT * FROM tasks
        `);
  return results.rows;
}

export async function getTasksByUserId(id: string): Promise<UserTask[]> {
  const results = await pool.query(
    `
            SELECT 
            t.task_id,
            t.title,
            t.description,
            t.completed,
            u.name as user_name,
            t.created_at,
            t.updated_at
            FROM tasks as t
            INNER JOIN users as u
            ON t.user_id = u.user_id
            WHERE t.user_id=$1
        `,
    [id]
  );
  return results.rows;
}
export async function getTaskById(taskId: string, userId: string): Promise<UserTask> {
  const results = await pool.query(
    `
            SELECT 
            t.task_id,
            t.title,
            t.description,
            t.completed,
            u.name as user_name,
            t.created_at,
            t.updated_at
            FROM tasks as t
            INNER JOIN users as u
            ON t.user_id = u.user_id
            WHERE t.task_id=$1 AND t.user_id=$2
        `,
    [taskId, userId]
  );
  return results.rows[0];
}

export async function deleteTask(taskId: string, userId: string): Promise<Task> {
  const result = await pool.query(
    `
            DELETE FROM tasks
            WHERE task_id=$1 AND user_id=$2
            RETURNING *
        `,
    [taskId, userId]
  );
  return result.rows[0];
}

export async function updateTask(
  taskId: string,
  userId: string,
  task: UpdateTask
): Promise<Task | null> {
  const fields: string[] = [];
  const values: unknown[] = [];
  if (task.title !== undefined) {
    values.push(task.title);
    fields.push(`title=$${values.length}`);
  }
  if (task.description !== undefined) {
    values.push(task.description);
    fields.push(`description=$${values.length}`);
  }
  if (task.completed !== undefined) {
    values.push(task.completed);
    fields.push(`completed=$${values.length}`);
  }
  if (fields.length === 0) {
    return null;
  }

  fields.push(`updated_at = NOW()`);
  values.push(taskId);
  values.push(userId);

  const result = await pool.query(
    `
            UPDATE tasks
            SET ${fields.join(", ")}
            WHERE task_id=$${values.length - 1} AND user_id=$${values.length}
            RETURNING *
        `,
    values
  );

  return result.rows[0];
}
