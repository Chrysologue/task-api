import express from 'express'
const router = express.Router()
import userController from '../controllers/userController.js'
import { checkAuthentication, checkRole } from '../middleware/authMiddleware.js'

router.get("/", checkAuthentication, checkRole, userController.getAllUsers)
router.get("/login", userController.logUser)

export default router