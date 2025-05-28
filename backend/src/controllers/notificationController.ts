import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../middleware/errorHandler";

const prisma = new PrismaClient();

export const getNotificationSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    let settings = await prisma.notificationSettings.findUnique({
      where: { userId },
    });

    // If settings don't exist, create default settings
    if (!settings) {
      settings = await prisma.notificationSettings.create({
        data: {
          userId,
        },
      });
    }

    res.json(settings);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to fetch notification settings", 500);
  }
};

export const updateNotificationSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const {
      notifyActivityReminders,
      notifyProgressUpdates,
      notifySupportMessages,
      notifyNewArticles,
      notifyRiskAlerts,
      notifyWeeklyReports,
      emailNotifications,
      pushNotifications,
    } = req.body;

    // Validate that all values are boolean
    const settings = {
      notifyActivityReminders,
      notifyProgressUpdates,
      notifySupportMessages,
      notifyNewArticles,
      notifyRiskAlerts,
      notifyWeeklyReports,
      emailNotifications,
      pushNotifications,
    };

    Object.entries(settings).forEach(([key, value]) => {
      if (value !== undefined && typeof value !== "boolean") {
        throw new AppError(`Invalid value for ${key}: must be a boolean`, 400);
      }
    });

    const updatedSettings = await prisma.notificationSettings.upsert({
      where: { userId },
      update: settings,
      create: {
        userId,
        ...settings,
      },
    });

    res.json(updatedSettings);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to update notification settings", 500);
  }
};

export const getNotifications = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.notification.count({
        where: { userId },
      }),
    ]);

    res.json({
      notifications,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to fetch notifications", 500);
  }
};

export const markNotificationAsRead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    const { notificationId } = req.params;

    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId, // Ensure the notification belongs to the user
      },
      data: { read: true },
    });

    res.json(notification);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to mark notification as read", 500);
  }
};

export const markAllNotificationsAsRead = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError("User not authenticated", 401);
    }

    await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: { read: true },
    });

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to mark all notifications as read", 500);
  }
};
