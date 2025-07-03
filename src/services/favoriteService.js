import { db } from "../db/index.js";
import { favorites, recipes } from "../db/schema.js";

// List all favorite recipes for a user (returns recipe IDs)
export async function listFavorites(userId) {
  return db.select().from(favorites).where(favorites.user_id.eq(userId));
}

// Add a favorite (if not already favorited)
export async function addFavorite(userId, recipeId) {
  // Prevent duplicate favorites
  const existing = await db
    .select()
    .from(favorites)
    .where(favorites.user_id.eq(userId).and(favorites.recipe_id.eq(recipeId)));
  if (existing.length > 0) return existing[0];
  const [favorite] = await db
    .insert(favorites)
    .values({ user_id: userId, recipe_id: recipeId })
    .returning();
  return favorite;
}

// Remove a favorite
export async function removeFavorite(userId, recipeId) {
  const [favorite] = await db
    .delete(favorites)
    .where(favorites.user_id.eq(userId).and(favorites.recipe_id.eq(recipeId)))
    .returning();
  return favorite;
}
