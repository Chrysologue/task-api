import {
  getAllUsers,
  getUserByEmail,
  getUserByID,
  updateUser,
  deleteUser,
  createUser
} from "../models/userModel.js";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { JwtPayload, UpdateUser, CreateUser } from "../types/user.js";
import jtw from 'jsonwebtoken'
import { validate as IsValidUUID } from "uuid";

interface UserController {
  getAllUsers: (req: Request, res: Response) => Promise<Response>;
  logUser: (req: Request, res: Response) => Promise<Response>;
  getUserById: (req: Request<{id: string}>, res: Response) => Promise<Response>
  deleteUser: (req: Request<{id: string}>, res: Response) => Promise<Response>;
  udpateUser: (req: Request<{id: string}, {}, UpdateUser>, res: Response) => Promise<Response>;
  createUser: (req: Request<{}, {}, CreateUser>, res: Response) => Promise<Response>;
}

const userController: UserController = {
  getAllUsers: async function (req: Request, res: Response) {
    try {
      const users = await getAllUsers()
      return res.status(200).json(users)
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  logUser: async function(req: Request, res: Response){
    try{
      const {email, password} = req.body
      const user = await getUserByEmail(email)
      if(!user){
        return res.status(401).json({error: "Invalid email or password"})
      }
      const isMatched = await bcrypt.compare(password, user.password)
      if(!isMatched){
        return res.status(401).json({error: "Invalid email or password"})
      }
      const payload: JwtPayload = {
        id: user.user_id,
        role: user.role
      }
      const secret = process.env.JWT_TOKEN
      if(!secret){
        throw new Error("JWT_TOKEN is not defined")
      }
      const token = jtw.sign(payload, secret, {
        expiresIn: "1h"
      })

      return res.status(200).json({message: "Login successful", token})

    }
    catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  getUserById: async function(req: Request<{id: string}>, res: Response){
    try{
      const userId = req.params.id
      if(!IsValidUUID(userId)){
        return res.status(400).json({error: "Invalid user ID"})
      }
      const user = await getUserByID(userId)
      if(!user){
        return res.status(404).json({error: "User not found"})
      }

      return res.status(200).json(user)
    }
    catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  deleteUser: async function(req: Request<{id: string}>, res: Response){
    try{
      const id = req.params.id
      const result = await deleteUser(id)
      if(!result){
        return res.status(404).json({error: "User not found"})
      }
      return res.status(200).json({message: "User successfully deleted", result})
    }catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  udpateUser: async function(req: Request<{id: string}, {}, UpdateUser>, res: Response){
    try {
      const id = req.params.id
      const data= req.body
      const result = await updateUser(id, data)
      return res.status(200).json({message: "User updated successfully", result})
    }
    catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  createUser: async function(req: Request<{}, {}, CreateUser>, res: Response) {
    try{
      const user = req.body
      const result = await createUser(user)
      return res.status(201).json({message: "User created successfully", result})
    }catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

export default userController;
