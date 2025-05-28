import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  setupTwoFactor,
  verifyAndEnableTwoFactor,
  verifyTwoFactorToken,
  verifyRecoveryCode,
  disableTwoFactor,
} from "../controllers/twoFactorController";

const router = express.Router();

// All routes require authentication except verify token and recovery code
router.post("/setup", protect, setupTwoFactor);
router.post("/verify-and-enable", protect, verifyAndEnableTwoFactor);
router.post("/verify-token", verifyTwoFactorToken);
router.post("/verify-recovery", verifyRecoveryCode);
router.post("/disable", protect, disableTwoFactor);

export default router;
