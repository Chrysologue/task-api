import express from "express";
import taskController from "../controllers/taskController.js";
import { checkAuthentication, checkRole } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/admin", checkAuthentication, checkRole("admin"), taskController.getAllTasks);
router.get("/", checkAuthentication, taskController.getTasksByUserId);
router.get("/:id", checkAuthentication, taskController.getTaskById);
router.post("/", checkAuthentication, taskController.createTask);
router.delete("/:id", checkAuthentication, taskController.deleteTask);
router.put("/:id", checkAuthentication, taskController.updateTask);

export default router;
