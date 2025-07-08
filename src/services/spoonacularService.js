import axios from "axios";
import { db } from "../db/index.js";
import { recipes } from "../db/schema.js";

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = "https://api.spoonacular.com";

export async function searchSpoonacularRecipes(query, options = {}) {
  const params = {
    apiKey: SPOONACULAR_API_KEY,
    query,
    addRecipeInformation: true,
    ...options,
  };
  // Ensure number and offset are numbers if present
  if (params.number) params.number = Number(params.number);
  if (params.offset) params.offset = Number(params.offset);
  const res = await axios.get(`${BASE_URL}/recipes/complexSearch`, { params });
  return res.data;
}

export async function getSpoonacularRecipeById(id, options = {}) {
  const params = {
    apiKey: SPOONACULAR_API_KEY,
    ...options,
  };
  const res = await axios.get(`${BASE_URL}/recipes/${id}/information`, {
    params,
  });
  return res.data;
}

// Cache-aware fetch: check DB first, then API, then store in DB
export async function getSpoonacularRecipeByIdWithCache(id, options = {}) {
  // 1. Check local DB cache
  const cached = await db
    .select()
    .from(recipes)
    .where({ spoonacular_id: Number(id) });
  if (cached.length > 0) return { ...cached[0], cached: true };

  // 2. Fetch from Spoonacular
  const params = { apiKey: SPOONACULAR_API_KEY, ...options };
  const res = await axios.get(`${BASE_URL}/recipes/${id}/information`, {
    params,
  });
  const data = res.data;

  // 3. Store in DB (cache)
  const [recipe] = await db
    .insert(recipes)
    .values({
      spoonacular_id: data.id,
      title: data.title,
      image: data.image,
      summary: data.summary,
      ready_in_minutes: data.readyInMinutes,
      servings: data.servings,
      source_url: data.sourceUrl,
      ingredients: data.extendedIngredients,
      steps: data.analyzedInstructions,
      data, // full API response
    })
    .onConflictDoNothing()
    .returning();

  return recipe ? { ...recipe, cached: false } : { ...data, cached: false };
}

// Fetch random recipes from Spoonacular
export async function getRandomSpoonacularRecipes(number = 10, options = {}) {
  const params = {
    apiKey: SPOONACULAR_API_KEY,
    number,
    ...options,
  };
  const res = await axios.get(`${BASE_URL}/recipes/random`, { params });
  return res.data;
}
