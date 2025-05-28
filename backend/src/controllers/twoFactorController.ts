import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";
import { AppError } from "../middleware/errorHandler";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

// Generate recovery codes
const generateRecoveryCodes = async (userId: string) => {
  const codes = Array.from({ length: 10 }, () =>
    Math.random().toString(36).substring(2, 15).toUpperCase()
  );

  // Hash and store recovery codes
  const hashedCodes = await Promise.all(
    codes.map(async (code) => {
      const salt = await bcrypt.genSalt(10);
      const hashedCode = await bcrypt.hash(code, salt);
      return { code: hashedCode };
    })
  );

  // Store in database
  await prisma.recoveryCode.createMany({
    data: hashedCodes.map(({ code }) => ({
      code,
      userId,
    })),
  });

  return codes;
};

// Setup 2FA
export const setupTwoFactor = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      throw new AppError("Not authorized", 401);
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      length: 20,
      name: `MentalHealthApp:${req.user.email}`,
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    // Store secret temporarily (not enabled yet)
    await prisma.user.update({
      where: { id: req.user.id },
      data: { twoFactorSecret: secret.base32 },
    });

    res.json({
      secret: secret.base32,
      qrCode,
    });
  } catch (error) {
    next(error);
  }
};

// Verify and enable 2FA
export const verifyAndEnableTwoFactor = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;

    if (!req.user?.id) {
      throw new AppError("Not authorized", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user?.twoFactorSecret) {
      throw new AppError("2FA not set up", 400);
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1, // Allow 30 seconds clock skew
    });

    if (!verified) {
      throw new AppError("Invalid 2FA code", 400);
    }

    // Generate recovery codes
    const recoveryCodes = await generateRecoveryCodes(user.id);

    // Enable 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: true },
    });

    res.json({
      message: "2FA enabled successfully",
      recoveryCodes, // Show these to the user once
    });
  } catch (error) {
    next(error);
  }
};

// Verify 2FA token during login
export const verifyTwoFactorToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, token } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.twoFactorSecret || !user.twoFactorEnabled) {
      throw new AppError("2FA not enabled", 400);
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!verified) {
      throw new AppError("Invalid 2FA code", 400);
    }

    res.json({ verified: true });
  } catch (error) {
    next(error);
  }
};

// Verify recovery code
export const verifyRecoveryCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, code } = req.body;

    const recoveryCodes = await prisma.recoveryCode.findMany({
      where: {
        userId,
        used: false,
      },
    });

    let validCode = null;
    for (const recoveryCode of recoveryCodes) {
      const isValid = await bcrypt.compare(code, recoveryCode.code);
      if (isValid) {
        validCode = recoveryCode;
        break;
      }
    }

    if (!validCode) {
      throw new AppError("Invalid recovery code", 400);
    }

    // Mark code as used
    await prisma.recoveryCode.update({
      where: { id: validCode.id },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });

    res.json({ verified: true });
  } catch (error) {
    next(error);
  }
};

// Disable 2FA
export const disableTwoFactor = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;

    if (!req.user?.id) {
      throw new AppError("Not authorized", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user?.twoFactorSecret || !user.twoFactorEnabled) {
      throw new AppError("2FA not enabled", 400);
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!verified) {
      throw new AppError("Invalid 2FA code", 400);
    }

    // Disable 2FA and clear secret
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    // Delete all recovery codes
    await prisma.recoveryCode.deleteMany({
      where: { userId: user.id },
    });

    res.json({ message: "2FA disabled successfully" });
  } catch (error) {
    next(error);
  }
};
