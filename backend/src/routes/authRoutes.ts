// backend/src/routes/userRoutes.ts
import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect } from "../middleware/authMiddleware"; // Use the main protect middleware
import { AppError } from "../middleware/errorHandler"; // Import AppError

const router = express.Router();
const prisma = new PrismaClient();

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

// All routes here will use the 'protect' middleware applied in server.ts
// so no need to apply it again here unless specific fine-grained control is needed per route.

// Get user profile
router.get("/profile", async (req, res, next) => {
  try {
    if (!req.user?.id) {
      throw new AppError("User not authenticated", 401);
    }

    const userProfile = await prisma.profile.findUnique({
      where: { id: req.user.id },
      select: {
        full_name: true,
        phone_number: true,
        join_date: true,
        streak: true,
        completed_activities: true,
        risk_score_current: true,
        risk_score_previous: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Combine with auth user data
    res.json({
      id: req.user.id,
      email: req.user.email,
      name: userProfile.full_name,
      phone: userProfile.phone_number,
      joinDate: userProfile.join_date,
      streak: userProfile.streak,
      completedActivities: userProfile.completed_activities,
      riskScore: {
        current: userProfile.risk_score_current,
        previous: userProfile.risk_score_previous,
      },
      createdAt: userProfile.created_at,
      updatedAt: userProfile.updated_at,
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put("/profile", async (req, res, next) => {
  try {
    if (!req.user?.id) {
      throw new AppError("User not authenticated", 401);
    }

    const { name, phone } = req.body; // Use 'name' and 'phone' as per frontend ProfileFormData

    const updatedProfile = await prisma.profile.update({
      where: { id: req.user.id },
      data: {
        full_name: name,
        phone_number: phone || null, // Allow null for optional phone
        updated_at: new Date(), // Update timestamp
      },
    });

    res.json({
      id: updatedProfile.id,
      email: req.user.email, // Email comes from auth token, not profile table
      name: updatedProfile.full_name,
      phone: updatedProfile.phone_number,
      joinDate: updatedProfile.join_date,
      streak: updatedProfile.streak,
      completedActivities: updatedProfile.completed_activities,
      riskScore: {
        current: updatedProfile.risk_score_current,
        previous: updatedProfile.risk_score_previous,
      },
      createdAt: updatedProfile.created_at,
      updatedAt: updatedProfile.updated_at,
    });
  } catch (error) {
    next(error);
  }
});

// No need for separate notification-settings routes here if notificationRoutes.ts handles it.
// If you intend to manage notification settings through user profile updates,
// then integrate the logic here, otherwise remove these routes to avoid redundancy.
// For now, assuming notificationRoutes handles it fully.

export default router;
