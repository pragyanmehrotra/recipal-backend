import {
  searchSpoonacularRecipes,
  getSpoonacularRecipeByIdWithCache,
} from "../services/spoonacularService.js";

// GET /api/external/recipes/search?query=chicken
export async function searchExternalRecipes(req, res, next) {
  try {
    const { query, ...options } = req.query;
    if (!query) return res.status(400).json({ error: "query required" });
    const results = await searchSpoonacularRecipes(query, options);
    res.json(results);
  } catch (err) {
    next(err);
  }
}

// GET /api/external/recipes/:id
export async function getExternalRecipe(req, res, next) {
  try {
    const { id } = req.params;
    const recipe = await getSpoonacularRecipeByIdWithCache(id, req.query);
    res.json(recipe);
  } catch (err) {
    next(err);
  }
}
