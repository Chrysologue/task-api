import {
  createTask,
  getAllTasksByAdmin,
  getTasksByUserId,
  getTaskById,
  deleteTask,
  updateTask,
} from "../models/taskModel.js";
import { Request, Response } from "express";

import { TaskController } from "../types/task.js";

const taskController: TaskController = {
  createTask: async function (req: Request, res: Response) {
    try {
      const { title, description } = req.body;
      const user_id = req.user?.id as string;
      const result = await createTask({ title, description, user_id });
      return res.status(201).json({ message: "Task created successfully", result });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  getAllTasks: async function (req: Request, res: Response) {
    try {
      const tasks = await getAllTasksByAdmin();
      return res.status(200).json(tasks);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  getTasksByUserId: async function (req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const tasks = await getTasksByUserId(userId);
      return res.status(200).json(tasks);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  getTaskById: async function (req: Request, res: Response) {
    try {
      const taskId = req.params.id as string;
      const userId = req.user?.id as string;
      const task = await getTaskById(taskId, userId);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      return res.status(200).json(task);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  deleteTask: async function (req: Request, res: Response) {
    try {
      const taskId = req.params.id as string;
      const userId = req.user?.id as string;
      const task = await getTaskById(taskId, userId);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      const result = await deleteTask(taskId, userId);
      return res.status(200).json({ message: "Task is successfully deleted", result });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  updateTask: async function (req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id as string;
      const updatedTask = req.body;
      const task = await getTaskById(id, userId);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      const result = await updateTask(id, userId, updatedTask);
      return res.status(200).json({ message: "Task updated successfully", result });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default taskController;
