import pool from "../config/db.js";

export async function getAllTaskByAdmin() {
  const results = await pool.query(`
            SELECT t.task_id , 
            t.title, t.description, t.completed,
            t.created_at, t.updated_at,
            u.name, u.email from tasks as t
            INNER JOIN users as u
            ON t.user_id = u.user_id
        `);
  return results.rows;
}

export async function getUserTasks(id) {
  const results = await pool.query(
    `
        SELECT t.task_id , 
            t.title, t.description, t.completed,
            t.created_at, t.updated_at,
            u.name, u.email from tasks as t
            INNER JOIN users as u
            ON t.user_id = u.user_id
            WHERE t.user_id=$1
        `,
    [id],
  );
  return results.rows;
}

export async function getUserTaskById(taskId, userId) {
  const result = await pool.query(
    `
             SELECT t.task_id , 
            t.title, t.description, t.completed,
            t.created_at, t.updated_at,
            u.name, u.email from tasks as t
            INNER JOIN users as u
            ON t.user_id = u.user_id
            WHERE t.task_id=$1 AND t.user_id=$2 
        `,
    [taskId, userId],
  );
  return result.rows[0];
}

export async function deleteUserTask(taskId, userId) {
  const result = await pool.query(
    `
            DELETE FROM tasks
            WHERE task_id=$1 AND user_id=$2
            RETURNING task_id, title
        `,
    [taskId, userId],
  );
  return result.rows[0];
}

export async function createUserTask(task) {
  const result = await pool.query(
    `
            INSERT INTO tasks
            (title, description, user_id)
            VALUES($1, $2, $3)
            RETURNING * 
        `,
    [task.title, task.description, task.user_id],
  );
  return result.rows[0];
}

export async function updateUserTask(taskId, userId, task) {
  if (task.user_id !== undefined) {
    throw new Error("Invalid operation");
  }
  const values = [];
  const fields = [];

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
  fields.push(`updated_at=NOW ()`);

  if (fields.length === 0) {
    return null;
  }
  (values.push(taskId), values.push(userId));

  const result = await pool.query(
    `
        UPDATE tasks
        SET ${fields.join(", ")}
        WHERE task_id=$${values.length - 1} AND user_id=$${values.length}
        RETURNING *
        `,
    values,
  );
  return result.rows[0];
}
