// backend/src/routes/dashboardRoutes.ts
import express from "express";
import { getDashboardData } from "../controllers/dashboardController";
import { protect as authMiddleware } from "../middleware/authMiddleware"; // Assuming this is your primary auth middleware

const router = express.Router();

router.get("/", authMiddleware, getDashboardData);

export default router;
