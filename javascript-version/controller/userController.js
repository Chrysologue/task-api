import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} from "../models/userModel.js";
import { validate as isValidUUID } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userController = {};
userController.getAllUsers = async function (req, res) {
  try {
    const users = await getAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

userController.getUserById = async function (req, res) {
  try {
    const id = req.params.id;
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

userController.createUser = async function (req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(404).json({ error: "Please provide all data" });
    }
    const lowerCaseEmail = email.trim().toLowerCase();

    const isExisting = await getUserByEmail(lowerCaseEmail);
    if (isExisting) {
      return res.status(404).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      ...req.body,
      password: hashedPassword,
      email: lowerCaseEmail,
    };
    const result = await createUser(newUser);
    return res
      .status(201)
      .json({ message: "User created successfully", result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

userController.updateUser = async function (req, res) {
  try {
    const id = req.params.id;
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }
    const result = await updateUser(id, req.body);
    return res
      .status(200)
      .json({ message: "User updated successfully", result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

userController.login = async function (req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide both email and password" });
    }
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const payload = { id: user.user_id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export default userController;
