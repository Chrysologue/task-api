import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import checkRole from "../middleware/roleMiddleware.js";
import taskController from "../controller/taskController.js";

const router = express.Router();

router.post("/", authMiddleware, taskController.createUserTask);
router.get(
  "/admin",
  authMiddleware,
  checkRole("admin", taskController.getTasksByAdmin),
);
router.get("/", authMiddleware, taskController.getAllUserTasks);
router.get("/:id", authMiddleware, taskController.getUserTaskById);
router.put("/:id", authMiddleware, taskController.updateUserTask);
router.delete("/:id", authMiddleware, taskController.deleteUserTask);

export default router;
