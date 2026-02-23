import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";
import { createUser, findUserByEmail } from "../services/userService";
import { AuthRequest } from "../middleware/authMiddleware";

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret)
    throw new Error("JWT_SECRET is not defined in environment variables");
  return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
};

/**
 * POST /api/auth/register
 * Register a new user with name, email, and password.
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }

  const { name, email, password } = value;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    res
      .status(409)
      .json({ success: false, message: "Email is already registered" });
    return;
  }

  const salt = await bcrypt.genSalt(12);

  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await createUser(name, email, hashedPassword);

  const token = generateToken(user._id.toString());

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

/**
 * POST /api/auth/login
 * Authenticate an existing user and return a JWT.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    res.status(400).json({ success: false, message: error.details[0].message });
    return;
  }

  const { email, password } = value;

  const user = await findUserByEmail(email);
  if (!user || !user.password) {
    res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
    return;
  }

  const token = generateToken(user._id.toString());

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

/**
 * GET /api/auth/me
 * Return the currently authenticated user's profile.
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ success: false, message: 'Not authorised' });
    return;
  }
  res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};
