// backend/src/controllers/dashboardController.ts
import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../middleware/errorHandler";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
    user?: { id: string; email: string; name: string };
}

export const getDashboardData = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (!req.user?.id) {
            return next(new AppError("User not authenticated", 401));
        }

        const userProfile = await prisma.profile.findUnique({
            where: { id: req.user.id },
            select: {
                full_name: true,
                risk_score_current: true,
                risk_score_previous: true,
                completed_activities: true,
                streak: true,
                // Select other necessary fields from the profile
            },
        });

        if (!userProfile) {
            // It's possible the profile is still being created by the trigger
            // Or an issue occurred. For now, we can return default/empty-ish data
            // or a specific status to prompt profile creation/check.
            // This assumes the 'profiles' table is the main source for dashboard stats.
            return res.status(404).json({
                message: "Profile not found. Dashboard data may be incomplete.",
            });
        }

        // You might aggregate more data here, e.g., recent activities, mood trends etc.
        // For example:
        // const recentActivities = await prisma.userActivity.findMany({
        //   where: { userId: req.user.id },
        //   orderBy: { createdAt: 'desc' },
        //   take: 5,
        // });

        res.status(200).json({
            status: "success",
            data: {
                ...userProfile,
                // recentActivities, // if fetched
            },
        });
    } catch (error) {
        next(error);
    }
};
