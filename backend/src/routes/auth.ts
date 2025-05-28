import { Router } from "express";
import { register, login, getCurrentUser } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";
import { validateRegister, validateLogin } from "../middleware/validation";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", authMiddleware, getCurrentUser);

export default router;
