import express from "express";
const router = express.Router();
import userController from "../controller/userController.js";

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.post("/login", userController.login);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);

export default router;
