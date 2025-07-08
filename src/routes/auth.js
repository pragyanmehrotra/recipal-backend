import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { eq, sql } from "drizzle-orm";
import {
  generateVerificationCode,
  sendVerificationEmail,
} from "../services/emailService.js";
import passwordResetController from "../controllers/passwordResetController.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Register
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Check for existing user (prevents most duplicate errors)
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    if (existing.length > 0) {
      // Always return after sending a response
      return res.status(400).json({ error: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    const [user] = await db
      .insert(users)
      .values({
        email,
        name: name || `Guest User ${Math.floor(Math.random() * 1000)}`,
        password: hash,
        email_verification_token: verificationCode,
        email_verification_expires: expiresAt,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        email_verified: users.email_verified,
      });

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      // Don't fail registration if email fails, just log it
    }

    // Create a temporary token for verification
    const tempToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        temp: true,
        needsVerification: true,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      token: tempToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        email_verified: user.email_verified,
      },
      needsVerification: true,
      message:
        "Account created! Please check your email for verification code.",
    });
  })
);

// Verify email
router.post(
  "/verify-email",
  asyncHandler(async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
      return res
        .status(400)
        .json({ error: "Email and verification code required" });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.email_verified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    if (!user.email_verification_token || !user.email_verification_expires) {
      return res.status(400).json({ error: "No verification token found" });
    }

    if (new Date() > user.email_verification_expires) {
      return res.status(400).json({ error: "Verification code has expired" });
    }

    if (user.email_verification_token !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // Mark email as verified
    await db
      .update(users)
      .set({
        email_verified: true,
        email_verification_token: null,
        email_verification_expires: null,
      })
      .where(eq(users.id, user.id));

    // Create permanent token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        email_verified: true,
      },
      message: "Email verified successfully!",
    });
  })
);

// Resend verification email
router.post(
  "/resend-verification",
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.email_verified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    const verificationCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await db
      .update(users)
      .set({
        email_verification_token: verificationCode,
        email_verification_expires: expiresAt,
      })
      .where(eq(users.id, user.id));

    try {
      await sendVerificationEmail(email, verificationCode);
      res.json({ message: "Verification email sent successfully" });
    } catch (error) {
      console.error("Failed to send verification email:", error);
      res.status(500).json({ error: "Failed to send verification email" });
    }
  })
);

// Login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Use the working eq() method to find the user
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
        name: users.name,
        email_verified: users.email_verified,
      })
      .from(users)
      .where(eq(users.email, email));

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    // Check if email is verified
    if (!user.email_verified) {
      return res.status(403).json({
        error: "Email not verified",
        needsVerification: true,
        message: "Please verify your email before signing in",
      });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        email_verified: user.email_verified,
      },
    });
  })
);

// Password reset endpoints
router.post("/request-password-reset", passwordResetController.requestReset);
router.post("/reset-password", passwordResetController.resetPassword);

export default router;
