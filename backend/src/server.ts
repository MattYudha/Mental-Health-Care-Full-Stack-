// backend/src/server.ts
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { initializeSocketService } from "./services/socketService";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import twoFactorRoutes from "./routes/twoFactorRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import { errorHandler } from "./middleware/errorHandler";
import { protect } from "./middleware/authMiddleware"; // Ensure this is imported

// Load environment variables as early as possible
import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // Assuming .env is in the project root or backend root. Adjust path as needed.

const app = express();
const httpServer = createServer(app);
const prisma = new PrismaClient();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "http://localhost:5178",
  "http://localhost:5179",
  "http://localhost:5180",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Initialize socket service
initializeSocketService(io);

// Middleware
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Routes
// Public routes do not need 'protect' middleware
app.use("/api/auth", authRoutes); // Auth routes often have public endpoints (register, login)
app.use("/api/2fa", twoFactorRoutes); // 2FA routes also have public and protected endpoints

// Apply protect middleware to routes that require authentication
app.use("/api/users", protect, userRoutes);
app.use("/api/dashboard", protect, dashboardRoutes);
app.use("/api/notifications", protect, notificationRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
