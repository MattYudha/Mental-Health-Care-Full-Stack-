import express from "express";
import { authMiddleware } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

// Get user profile
router.get("/profile", authenticateToken, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put("/profile", authenticateToken, async (req, res, next) => {
  try {
    const { fullName, phoneNumber } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        fullName,
        phoneNumber,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// Get user notification settings
router.get(
  "/notification-settings",
  authenticateToken,
  async (req, res, next) => {
    try {
      const settings = await prisma.notificationSettings.findUnique({
        where: { userId: req.user.id },
      });

      if (!settings) {
        return res
          .status(404)
          .json({ message: "Notification settings not found" });
      }

      res.json(settings);
    } catch (error) {
      next(error);
    }
  }
);

// Update user notification settings
router.put(
  "/notification-settings",
  authenticateToken,
  async (req, res, next) => {
    try {
      const {
        notifyActivityReminders,
        notifyProgressUpdates,
        notifyRiskAlerts,
        notifyWeeklySummary,
      } = req.body;

      const updatedSettings = await prisma.notificationSettings.update({
        where: { userId: req.user.id },
        data: {
          notifyActivityReminders,
          notifyProgressUpdates,
          notifyRiskAlerts,
          notifyWeeklySummary,
        },
      });

      res.json(updatedSettings);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
