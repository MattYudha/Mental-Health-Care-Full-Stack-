// backend/src/routes/authRoutes.ts
import express from "express";
import {
  register,
  login,
  getCurrentUser,
  changePassword,
  getTwoFactorStatus,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware"; // Using 'protect' middleware consistently
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

// Protected routes (apply 'protect' middleware)
router.get("/me", protect, getCurrentUser);
router.put(
  "/change-password",
  protect, // Ensure protection
  passwordChangeLimiter,
  changePassword
);
router.get("/2fa/status", protect, getTwoFactorStatus);

export default router;
