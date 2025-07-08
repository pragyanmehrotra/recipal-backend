import {
  listFavorites,
  addFavorite,
  removeFavorite,
} from "../services/favoriteService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// GET /api/user/favorites
export const listUserFavorites = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const favs = await listFavorites(userId);
  // Each fav is { favorites: ..., recipes: ... }
  const recipes = favs.map((f) => f.recipes);
  res.json({ favorites: recipes });
});

// POST /api/user/favorites
export const addUserFavorite = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { recipe_id } = req.body;
  console.log("[addUserFavorite] userId:", userId, "recipe_id:", recipe_id);
  if (!recipe_id) return res.status(400).json({ error: "recipe_id required" });
  const fav = await addFavorite(userId, Number(recipe_id));
  console.log("[addUserFavorite] addFavorite result:", fav);
  res.status(201).json({ favorite: fav });
});

// DELETE /api/user/favorites/:id
export const removeUserFavorite = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const recipeId = Number(req.params.id);
  console.log("[removeUserFavorite] userId:", userId, "recipeId:", recipeId);
  const fav = await removeFavorite(userId, recipeId);
  if (!fav) return res.status(404).json({ error: "Favorite not found" });
  res.json({ success: true });
});
