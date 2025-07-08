import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import dayjs from "dayjs";
import bcrypt from "bcryptjs";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../services/emailService.js";

function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
}

const passwordResetController = {
  async requestReset(req, res) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .then((rows) => rows[0]);
    if (!user) {
      // Always respond with success for privacy
      return res.json({
        message:
          "If an account with that email exists, a reset code has been sent.",
      });
    }
    // Generate code and expiry
    const code = generateResetCode();
    const expires = dayjs().add(15, "minute").toDate();
    // Store code and expiry
    await db
      .update(users)
      .set({ password_reset_code: code, password_reset_expires: expires })
      .where(eq(users.email, email));
    // Send email with code
    try {
      await sendPasswordResetEmail(email, code); // Use the dedicated password reset email template
    } catch (e) {
      console.error("Failed to send password reset email:", e);
      // Don't reveal error to user for privacy
    }
    return res.json({
      message:
        "If an account with that email exists, a reset code has been sent.",
    });
  },

  async resetPassword(req, res) {
    const { email, code, password } = req.body;
    if (!email || !code || !password) {
      return res
        .status(400)
        .json({ error: "Email, code, and new password are required." });
    }
    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .then((rows) => rows[0]);
    if (!user || !user.password_reset_code || !user.password_reset_expires) {
      return res.status(400).json({ error: "Invalid or expired reset code." });
    }
    // Check code and expiry
    if (user.password_reset_code !== code) {
      return res.status(400).json({ error: "Invalid reset code." });
    }
    if (dayjs().isAfter(dayjs(user.password_reset_expires))) {
      return res.status(400).json({ error: "Reset code has expired." });
    }
    // Hash new password
    const hashed = await bcrypt.hash(password, 10);
    // Update password and clear code fields
    await db
      .update(users)
      .set({
        password: hashed,
        password_reset_code: null,
        password_reset_expires: null,
      })
      .where(eq(users.email, email));
    return res.json({
      message: "Password has been reset. You can now sign in.",
    });
  },
};

export default passwordResetController;
