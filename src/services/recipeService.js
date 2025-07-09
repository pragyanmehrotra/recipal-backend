import { db } from "../db/index.js";
import { recipes } from "../db/schema.js";
import { or, ilike, sql } from "drizzle-orm";
import scrapeRecipe from "recipe-scraper";

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

// --- PUBLIC RECIPE ENDPOINTS ---
// Full-text search for recipes
export async function searchLocalRecipes(query, options = {}) {
  const number = Math.max(1, Math.min(Number(options.number) || 10, 100));
  const offset = Math.max(0, Number(options.offset) || 0);

  if (typeof query === "string" && query.trim()) {
    // Use ilike (case-insensitive substring match) on name and ingredients
    const results = await db
      .select()
      .from(recipes)
      .where(
        or(
          ilike(recipes.name, `%${query}%`),
          sql`"recipes"."recipeIngredients"::text ILIKE ${"%" + query + "%"}`
        )
      )
      .limit(number)
      .offset(offset);
    return results;
  } else {
    // Fallback: return random recipes using raw SQL
    const results = await db.execute(
      `SELECT * FROM recipes ORDER BY RANDOM() LIMIT ${number} OFFSET ${offset}`
    );
    return results.rows || results;
  }
}

// Get recipe by ID (public)
export async function getLocalRecipeById(id) {
  const result = await db.execute(`SELECT * FROM recipes WHERE id = $1`, [id]);
  return result.rows?.[0] || null;
}

// Get random recipes (public)
export async function getRandomLocalRecipes(number = 10, options = {}) {
  number = Math.max(1, Math.min(Number(number) || 10, 100));
  const results = await db.execute(
    `SELECT * FROM recipes ORDER BY RANDOM() LIMIT ${number}`
  );
  return results.rows || results;
}
// --- END PUBLIC RECIPE ENDPOINTS ---

// Get or scrape detailed recipe info by URL
export async function getOrScrapeRecipeDetails(url) {
  if (!url) return { success: false, message: "No URL provided" };
  // Try to find recipe by URL with all required fields
  const [existing] = await db.select().from(recipes).where({ url });
  if (
    existing &&
    existing.recipeIngredients &&
    existing.recipeInstructions &&
    existing.image &&
    Array.isArray(existing.recipeIngredients) &&
    existing.recipeIngredients.length > 0 &&
    Array.isArray(existing.recipeInstructions) &&
    existing.recipeInstructions.length > 0 &&
    typeof existing.image === "string" &&
    existing.image.length > 0
  ) {
    return { success: true, recipe: existing };
  }

  // Not found or missing fields, try to scrape
  let scraped;
  try {
    scraped = await scrapeRecipe(url);
    console.log("[SCRAPER] Raw result:", scraped);
  } catch (err) {
    console.error("[SCRAPER] Exception while scraping", { url, error: err });
    const partial = err?.scraped || err?.data || err?.result;
    if (
      partial &&
      (partial.name ||
        partial.title ||
        partial.image ||
        (Array.isArray(partial.ingredients) &&
          partial.ingredients.length > 0) ||
        (Array.isArray(partial.instructions) &&
          partial.instructions.length > 0))
    ) {
      // Map fields from recipe-scraper to our DB format
      const mapped = {
        name: partial.name || partial.title || "Untitled Recipe",
        url,
        image: partial.image,
        description: partial.description,
        cook_time: partial.cookTime,
        prep_time: partial.prepTime,
        recipeIngredients: partial.ingredients,
        recipeInstructions: partial.instructions,
        details: partial,
      };
      Object.keys(mapped).forEach(
        (k) => mapped[k] === undefined && delete mapped[k]
      );
      return { success: true, recipe: mapped, partial: true };
    }
    return {
      success: false,
      message: "Failed to scrape recipe: " + (err?.message || err),
    };
  }
  if (!scraped || typeof scraped !== "object") {
    console.error("[SCRAPER] Invalid result (not an object):", scraped);
    return {
      success: false,
      message: "Scraper did not return a valid object.",
    };
  }
  // Only insert defined fields
  const insertData = {
    name: scraped.name || scraped.title || "Untitled Recipe",
    url,
    image: scraped.image,
    description: scraped.description,
    cook_time: scraped.cookTime,
    prep_time: scraped.prepTime,
    recipeIngredients: scraped.ingredients,
    recipeInstructions: scraped.instructions,
    details: scraped,
  };
  Object.keys(insertData).forEach(
    (k) => insertData[k] === undefined && delete insertData[k]
  );
  const hasAllFields =
    insertData.recipeIngredients &&
    insertData.recipeInstructions &&
    insertData.image &&
    insertData.recipeIngredients.length > 0 &&
    insertData.recipeInstructions.length > 0;
  if (!hasAllFields) {
    console.error("[SCRAPER] Missing required fields after parsing", {
      url,
      insertData,
    });
    if (
      insertData.name ||
      insertData.image ||
      (Array.isArray(insertData.recipeIngredients) &&
        insertData.recipeIngredients.length > 0) ||
      (Array.isArray(insertData.recipeInstructions) &&
        insertData.recipeInstructions.length > 0)
    ) {
      const [saved] = await db
        .insert(recipes)
        .values(insertData)
        .onConflictDoNothing()
        .returning();
      return {
        success: true,
        recipe: saved?.[0] || saved || insertData,
        partial: true,
      };
    }
    return {
      success: false,
      message:
        "Could not extract all required fields. Please visit the original page.",
    };
  }
  const [saved] = await db
    .insert(recipes)
    .values(insertData)
    .onConflictDoNothing()
    .returning();
  return { success: true, recipe: saved?.[0] || saved || insertData };
}
