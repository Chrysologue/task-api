import express from "express";
const router = express.Router();
import userController from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.post("/login", userController.login);
router.get("/:id", authMiddleware, userController.getUserById);
router.put("/:id", authMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser);

export default router;
