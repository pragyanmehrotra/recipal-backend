import {
  listUserRecipes,
  getUserRecipeById,
  createUserRecipe,
  updateUserRecipe,
  deleteUserRecipe,
  searchLocalRecipes,
  getLocalRecipeById,
  getRandomLocalRecipes,
  getOrScrapeRecipeDetails,
} from "../services/recipeService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// GET /api/user/recipes
export const listRecipes = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const recipes = await listUserRecipes(userId);
  res.json({ recipes });
});

// GET /api/user/recipes/:id
export const getUserRecipe = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const recipe = await getUserRecipeById(userId, Number(req.params.id));
  if (!recipe) return res.status(404).json({ error: "Recipe not found" });
  res.json({ recipe });
});

// --- PUBLIC ENDPOINTS FOR EXTERNAL RECIPES ---
// GET /api/external/recipes/search?query=chicken
export const searchRecipes = asyncHandler(async (req, res) => {
  let { query, number, ...options } = req.query;
  query = (query || "").trim();
  if (!query) {
    // Return random recipes if no query is provided or only whitespace
    const recipes = await getRandomLocalRecipes(Number(number) || 10, options);
    return res.json({ recipes });
  }
  const results = await searchLocalRecipes(query, options);
  res.json({ results });
});

// GET /api/external/recipes/:id
export const getRecipe = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const recipe = await getLocalRecipeById(id);
  if (!recipe) return res.status(404).json({ error: "Recipe not found" });
  res.json(recipe);
});

// GET /api/recipes/details?url=...
export const getRecipeDetailsByUrl = asyncHandler(async (req, res) => {
  const { url } = req.query;
  if (!url)
    return res
      .status(400)
      .json({ success: false, message: "Missing url parameter" });
  const result = await getOrScrapeRecipeDetails(url);
  if (!result.success) {
    return res.status(422).json(result);
  }
  res.json(result);
});

// --- END PUBLIC ENDPOINTS ---

// POST /api/user/recipes
export const createRecipe = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const {
    title,
    image,
    summary,
    ready_in_minutes,
    servings,
    source_url,
    ingredients,
    steps,
    data,
    spoonacular_id,
  } = req.body;
  const recipe = await createUserRecipe(userId, {
    title,
    image,
    summary,
    ready_in_minutes,
    servings,
    source_url,
    ingredients,
    steps,
    data,
    spoonacular_id,
  });
  res.status(201).json({ recipe });
});

// PUT /api/user/recipes/:id
export const updateRecipe = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const recipe = await updateUserRecipe(
    userId,
    Number(req.params.id),
    req.body
  );
  if (!recipe) return res.status(404).json({ error: "Recipe not found" });
  res.json({ recipe });
});

// DELETE /api/user/recipes/:id
export const deleteRecipe = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const recipe = await deleteUserRecipe(userId, Number(req.params.id));
  if (!recipe) return res.status(404).json({ error: "Recipe not found" });
  res.json({ success: true });
});
