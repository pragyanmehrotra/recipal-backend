import { db } from "../db/index.js";
import { users } from "../db/schema.js";

// Find user by Clerk ID
export async function findUserByClerkId(clerkId) {
  const result = await db
    .select()
    .from(users)
    .where(users.clerk_id.eq(clerkId));
  return result[0] || null;
}

// Create user (if not exists)
export async function createUser({ clerk_id, email, name }) {
  const [user] = await db
    .insert(users)
    .values({ clerk_id, email, name })
    .onConflictDoNothing()
    .returning();
  return user;
}

// Update user profile
export async function updateUserProfile(clerkId, data) {
  const [user] = await db
    .update(users)
    .set(data)
    .where(users.clerk_id.eq(clerkId))
    .returning();
  return user;
}
