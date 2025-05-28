import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel, CreateUserInput } from "../models/User";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AppError } from "../middleware/errorHandler";
import {
  changePasswordSchema,
  ChangePasswordInput,
} from "../schemas/authSchemas";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password }: CreateUserInput = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user
    const user = await UserModel.create({ name, email, password });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Return user data and token
    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await UserModel.verifyPassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Return user data and token
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error during login" });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
};

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate request body
    const validatedData = changePasswordSchema.parse(req.body);

    if (!req.user?.id) {
      throw new AppError("Not authorized, no user found", 401);
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Verify current password
    const isMatch = await bcrypt.compare(
      validatedData.currentPassword,
      user.password
    );

    if (!isMatch) {
      throw new AppError("Invalid current password", 401);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(
      validatedData.newPassword,
      salt
    );

    // Update password in database
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    // Send success response
    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getTwoFactorStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      throw new AppError("Not authorized, no user found", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { twoFactorEnabled: true },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return res.json({ isEnabled: user.twoFactorEnabled });
  } catch (error) {
    next(error);
  }
};
