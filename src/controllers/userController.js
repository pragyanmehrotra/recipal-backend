import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { eq } from "drizzle-orm";

// GET /api/user/profile
export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  // Fetch user by DB id - use correct Drizzle syntax
  const user = await db.select().from(users).where(eq(users.id, userId));
  if (!user || user.length === 0) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user: user[0] });
});

// PUT /api/user/profile
export const putProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { name } = req.body;
  const [user] = await db
    .update(users)
    .set({ name })
    .where(eq(users.id, userId))
    .returning();
  res.json({ user });
});

// DELETE /api/user/profile
export const deleteProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const result = await db.delete(users).where(eq(users.id, userId));
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ success: true });
});
