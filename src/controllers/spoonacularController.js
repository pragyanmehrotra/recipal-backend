import {
  searchSpoonacularRecipes,
  getSpoonacularRecipeByIdWithCache,
  getRandomSpoonacularRecipes,
} from "../services/spoonacularService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// GET /api/external/recipes/search?query=chicken
export const searchExternalRecipes = asyncHandler(async (req, res) => {
  const { query, number, ...options } = req.query;
  if (!query) {
    // Return random recipes if no query is provided
    const results = await getRandomSpoonacularRecipes(
      Number(number) || 10,
      options
    );
    return res.json(results);
  }
  const results = await searchSpoonacularRecipes(query, options);
  res.json(results);
});

// GET /api/external/recipes/:id
export const getExternalRecipe = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const recipe = await getSpoonacularRecipeByIdWithCache(id, req.query);
  res.json(recipe);
});
