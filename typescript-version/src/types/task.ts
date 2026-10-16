import { Request, Response } from "express";
export interface Task {
  task_id: string;
  title: string;
  description: string;
  completed: boolean;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTask {
  title: string;
  description: string;
  user_id: string;
}
export interface UpdateTask {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface UserTask {
  task_id: string;
  title: string;
  description: string;
  completed: boolean;
  user_name: string;
  created_at: Date;
  updated_at: Date;
}

export interface TaskController {
  createTask: (req: Request<{}, {}, CreateTask>, res: Response) => Promise<Response>;
  getAllTasks: (req: Request, res: Response) => Promise<Response>;
  getTasksByUserId: (req: Request<{ id: string }>, res: Response) => Promise<Response>;
  getTaskById: (req: Request<{ id: string }>, res: Response) => Promise<Response>;
  deleteTask: (req: Request<{ id: string }>, res: Response) => Promise<Response>;
  updateTask: (req: Request<{ id: string }, {}, UpdateTask>, res: Response) => Promise<Response>;
}
