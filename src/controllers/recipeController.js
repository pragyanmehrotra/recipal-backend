import {
  listUserRecipes,
  getUserRecipeById,
  createUserRecipe,
  updateUserRecipe,
  deleteUserRecipe,
} from "../services/recipeService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// GET /api/user/recipes
export const listRecipes = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const recipes = await listUserRecipes(userId);
  res.json({ recipes });
});

// GET /api/user/recipes/:id
export const getRecipe = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const recipe = await getUserRecipeById(userId, Number(req.params.id));
  if (!recipe) return res.status(404).json({ error: "Recipe not found" });
  res.json({ recipe });
});

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
