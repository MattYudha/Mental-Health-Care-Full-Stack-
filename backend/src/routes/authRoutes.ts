import express from "express";
import {
  register,
  login,
  getCurrentUser,
  changePassword,
  getTwoFactorStatus,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Rate limiter for password change
const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    message:
      "Too many password change attempts from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", authMiddleware, getCurrentUser);
router.put(
  "/change-password",
  authMiddleware,
  passwordChangeLimiter,
  changePassword
);
router.get("/2fa/status", authMiddleware, getTwoFactorStatus);

export default router;
