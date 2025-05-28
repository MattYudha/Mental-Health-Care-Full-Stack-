import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../middleware/errorHandler";

const prisma = new PrismaClient();

class SocketService {
  private io: Server | null = null;
  private connectedUsers: Map<string, Socket> = new Map();
  private static instance: SocketService;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initialize(io: Server): void {
    this.io = io;

    io.use(async (socket: Socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error("Authentication error"));
        }

        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "your-secret-key"
        ) as { id: string };
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
        });

        if (!user) {
          return next(new Error("User not found"));
        }

        socket.data.user = user;
        next();
      } catch (error) {
        next(new Error("Authentication error"));
      }
    });

    io.on("connection", (socket: Socket) => {
      const user = socket.data.user;
      if (user) {
        this.connectedUsers.set(user.id, socket);
        console.log(`User connected: ${user.id}`);
      }

      socket.on("disconnect", () => {
        if (user) {
          this.connectedUsers.delete(user.id);
          console.log(`User disconnected: ${user.id}`);
        }
      });
    });
  }

  public async sendNotification(
    userId: string,
    notification: {
      type: string;
      title: string;
      message: string;
    }
  ): Promise<void> {
    if (!this.io) {
      throw new Error("Socket.IO not initialized");
    }

    // Check user's notification preferences
    const userSettings = await prisma.notificationSettings.findUnique({
      where: { userId },
    });

    if (!userSettings) {
      console.log(`No notification settings found for user ${userId}`);
      return;
    }

    // Check if user has enabled notifications for this type
    const notificationType = `notify${notification.type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("")}` as keyof typeof userSettings;

    if (!userSettings[notificationType]) {
      console.log(
        `Notifications of type ${notification.type} disabled for user ${userId}`
      );
      return;
    }

    // Create notification in database
    const savedNotification = await prisma.notification.create({
      data: {
        userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
      },
    });

    // Emit notification to user's room
    const socket = this.connectedUsers.get(userId);
    if (socket) {
      socket.emit("new_notification", {
        ...savedNotification,
        createdAt: savedNotification.createdAt.toISOString(),
        updatedAt: savedNotification.updatedAt.toISOString(),
      });
    }
  }

  public async sendNotificationToMultipleUsers(
    userIds: string[],
    notification: {
      type: string;
      title: string;
      message: string;
    }
  ): Promise<void> {
    await Promise.all(
      userIds.map((userId) => this.sendNotification(userId, notification))
    );
  }

  public broadcastNotification(notification: any) {
    this.io?.emit("notification", notification);
  }
}

export const socketService = SocketService.getInstance();
export const initializeSocketService = (io: Server) =>
  socketService.initialize(io);
