import { db } from "../db/index.js";
import { favorites, recipes } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

export async function addFavorite(userId, recipeId) {
  // Check if recipe exists in local DB by local id
  let localRecipe = await db
    .select()
    .from(recipes)
    .where(eq(recipes.id, recipeId));
  if (localRecipe.length === 0) {
    // Not found in DB
    throw new Error("Recipe not found in local database");
  }
  // Insert favorite
  await db
    .insert(favorites)
    .values({ user_id: userId, recipe_id: recipeId })
    .onConflictDoNothing();
  return { success: true };
}

export async function removeFavorite(userId, recipeId) {
  await db
    .delete(favorites)
    .where(
      and(eq(favorites.user_id, userId), eq(favorites.recipe_id, recipeId))
    );
  return { success: true };
}

export async function listFavorites(userId) {
  return db
    .select()
    .from(favorites)
    .innerJoin(recipes, eq(favorites.recipe_id, recipes.id))
    .where(eq(favorites.user_id, userId));
}
