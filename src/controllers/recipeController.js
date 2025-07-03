import {
  listUserRecipes,
  getUserRecipeById,
  createUserRecipe,
  updateUserRecipe,
  deleteUserRecipe,
} from "../services/recipeService.js";
import { getClerkUserId } from "../utils/auth.js";
import { findUserByClerkId } from "../services/userService.js";

// Helper to get DB user ID from Clerk ID
async function getDbUserId(req) {
  const clerkId = getClerkUserId(req);
  const user = await findUserByClerkId(clerkId);
  return user?.id;
}

// GET /api/user/recipes
export async function listRecipes(req, res, next) {
  try {
    const userId = await getDbUserId(req);
    const recipes = await listUserRecipes(userId);
    res.json({ recipes });
  } catch (err) {
    next(err);
  }
}

// GET /api/user/recipes/:id
export async function getRecipe(req, res, next) {
  try {
    const userId = await getDbUserId(req);
    const recipe = await getUserRecipeById(userId, Number(req.params.id));
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json({ recipe });
  } catch (err) {
    next(err);
  }
}

// POST /api/user/recipes
export async function createRecipe(req, res, next) {
  try {
    const userId = await getDbUserId(req);
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
  } catch (err) {
    next(err);
  }
}

// PUT /api/user/recipes/:id
export async function updateRecipe(req, res, next) {
  try {
    const userId = await getDbUserId(req);
    const recipe = await updateUserRecipe(
      userId,
      Number(req.params.id),
      req.body
    );
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json({ recipe });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/user/recipes/:id
export async function deleteRecipe(req, res, next) {
  try {
    const userId = await getDbUserId(req);
    const recipe = await deleteUserRecipe(userId, Number(req.params.id));
    if (!recipe) return res.status(404).json({ error: "Recipe not found" });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
