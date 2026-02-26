import { userModel } from "../models/user.model.js";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const existedUser = await userModel.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    return res.status(409).json({ message: "User already exists" });
  }
  const user = await userModel.create({
    username,
    email,
    password,
  });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);
  res.cookie("token", token);

  res.status(201).json({ user, token, message: "User created Successfully" });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);
  res.cookie("token", token);

  res.status(200).json({ user, token, message: "User logged in Successfully" });
};

export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out Successfully" });
};

export const getUserProfile = async (req: Request, res: Response) => {
  const userId = (req as any).user;
  console.log(userId);
  const user = await userModel.findById(userId);
  res.status(200).json({ user });
};
