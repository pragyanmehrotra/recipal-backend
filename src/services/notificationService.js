import { db } from "../db/index.js";
import { push_tokens } from "../db/schema.js";

// Register or update a user's Expo push token
export async function registerPushToken(userId, expoToken) {
  // Upsert: if token exists for user, update; else insert
  const existing = await db
    .select()
    .from(push_tokens)
    .where(push_tokens.user_id.eq(userId));
  if (existing.length > 0) {
    await db
      .update(push_tokens)
      .set({ expo_token: expoToken })
      .where(push_tokens.user_id.eq(userId));
    return { updated: true };
  } else {
    await db
      .insert(push_tokens)
      .values({ user_id: userId, expo_token: expoToken });
    return { created: true };
  }
}

// Get all push tokens for a user
export async function getPushTokens(userId) {
  return db.select().from(push_tokens).where(push_tokens.user_id.eq(userId));
}
