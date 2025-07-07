import { db } from "../db/index.js";
import { recipes } from "../db/schema.js";

// List all recipes for a user
export async function listUserRecipes(userId) {
  return db.select().from(recipes).where({ user_id: userId });
}

// Get a single recipe by ID (and user)
export async function getUserRecipeById(userId, recipeId) {
  const result = await db
    .select()
    .from(recipes)
    .where({ user_id: userId, id: recipeId });
  return result[0] || null;
}

// Create a new recipe for a user
export async function createUserRecipe(userId, data) {
  const [recipe] = await db
    .insert(recipes)
    .values({
      user_id: userId,
      title: data.title,
      image: data.image,
      summary: data.summary,
      ready_in_minutes: data.ready_in_minutes,
      servings: data.servings,
      source_url: data.source_url,
      ingredients: data.ingredients,
      steps: data.steps,
      data: data.data,
      spoonacular_id: data.spoonacular_id,
    })
    .returning();
  return recipe;
}

// Update a recipe (only if it belongs to the user)
export async function updateUserRecipe(userId, recipeId, data) {
  const [recipe] = await db
    .update(recipes)
    .set({
      ...data,
      ingredients:
        data.ingredients !== undefined ? data.ingredients : undefined,
      steps: data.steps !== undefined ? data.steps : undefined,
      data: data.data !== undefined ? data.data : undefined,
    })
    .where({ user_id: userId, id: recipeId })
    .returning();
  return recipe;
}

// Delete a recipe (only if it belongs to the user)
export async function deleteUserRecipe(userId, recipeId) {
  const [recipe] = await db
    .delete(recipes)
    .where({ user_id: userId, id: recipeId })
    .returning();
  return recipe;
}
