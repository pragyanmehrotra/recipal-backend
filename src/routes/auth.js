import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { eq, sql } from "drizzle-orm";

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
    const [user] = await db
      .insert(users)
      .values({ email, name, password: hash })
      .returning({ id: users.id, email: users.email, name: users.name });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
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
      })
      .from(users)
      .where(eq(users.email, email));

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
    });
  })
);

export default router;
