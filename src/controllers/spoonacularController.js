import {
  searchSpoonacularRecipes,
  getSpoonacularRecipeByIdWithCache,
} from "../services/spoonacularService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// GET /api/external/recipes/search?query=chicken
export const searchExternalRecipes = asyncHandler(async (req, res) => {
  const { query, ...options } = req.query;
  if (!query) return res.status(400).json({ error: "query required" });
  const results = await searchSpoonacularRecipes(query, options);
  res.json(results);
});

// GET /api/external/recipes/:id
export const getExternalRecipe = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const recipe = await getSpoonacularRecipeByIdWithCache(id, req.query);
  res.json(recipe);
});
