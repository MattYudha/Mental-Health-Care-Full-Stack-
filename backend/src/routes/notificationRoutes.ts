import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  getNotificationSettings,
  updateNotificationSettings,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notificationController";

const router = express.Router();

// Notification Settings Routes
router.get("/settings", protect, getNotificationSettings);
router.put("/settings", protect, updateNotificationSettings);

// Notification Routes
router.get("/", protect, getNotifications);
router.put("/:notificationId/read", protect, markNotificationAsRead);
router.put("/read-all", protect, markAllNotificationsAsRead);

export default router;
