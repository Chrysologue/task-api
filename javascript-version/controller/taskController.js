import {
  getAllTaskByAdmin,
  getUserTaskById,
  getUserTasks,
  createUserTask,
  updateUserTask,
  deleteUserTask,
} from "../models/taskModel.js";
import { validate as isValidUUID } from "uuid";

const taskController = {};

taskController.getTasksByAdmin = async function (req, res) {
  try {
    const tasks = await getAllTaskByAdmin();
    return res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

taskController.getUserTaskById = async function (req, res) {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    if (!isValidUUID(taskId)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }
    const task = await getUserTaskById(taskId, userId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(200).json(task);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

taskController.getAllUserTasks = async function (req, res) {
  try {
    const userId = req.user.id;
    
    const tasks = await getUserTasks(userId);
    return res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

taskController.createUserTask = async function (req, res) {
  try {
    const task = req.body;
    const id = req.user.id;
    const userTask = { ...task, user_id: id };
    const result = await createUserTask(userTask);
    return res
      .status(201)
      .json({ message: "Task created successfully", result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

taskController.updateUserTask = async function (req, res) {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    if (!isValidUUID(taskId)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }
    const task = await getUserTaskById(taskId, userId)
    if(!task){
        return res.status(404).json({error: "Task not found"})
    }
    const data = req.body;
    const result = await updateUserTask(taskId, userId, data);
    return res
      .status(200)
      .json({ message: "Task updated successfully", result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

taskController.deleteUserTask = async function (req, res) {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;
    if (!isValidUUID(taskId)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }
    const task = await getUserTaskById(taskId, userId)
    if(!task){
        return res.status(404).json({error: "Task not found"})
    }
    const result = await deleteUserTask(taskId, userId);
    return res
      .status(200)
      .json({ message: "Task deleted successfully", result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export default taskController;
