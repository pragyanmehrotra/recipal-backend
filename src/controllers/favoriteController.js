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
  res.json({ favorites: favs });
});

// POST /api/user/favorites
export const addUserFavorite = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { recipe_id } = req.body;
  if (!recipe_id) return res.status(400).json({ error: "recipe_id required" });
  const fav = await addFavorite(userId, Number(recipe_id));
  res.status(201).json({ favorite: fav });
});

// DELETE /api/user/favorites/:id
export const removeUserFavorite = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const recipeId = Number(req.params.id);
  const fav = await removeFavorite(userId, recipeId);
  if (!fav) return res.status(404).json({ error: "Favorite not found" });
  res.json({ success: true });
});
