import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";
import { checkAuthentication, checkRole } from "../middleware/authMiddleware.js";

router.get("/", checkAuthentication, checkRole("admin"),userController.getAllUsers);
router.post("/login", userController.logUser);
router.post("/", userController.createUser);
router.put("/:id", checkAuthentication, userController.udpateUser);
router.delete("/:id", checkAuthentication, userController.deleteUser);
router.get("/:id",checkAuthentication, userController.getUserById);

export default router;
