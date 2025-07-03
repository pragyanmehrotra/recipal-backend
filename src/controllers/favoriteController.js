import {
  listFavorites,
  addFavorite,
  removeFavorite,
} from "../services/favoriteService.js";
import { getClerkUserId } from "../utils/auth.js";
import { findUserByClerkId } from "../services/userService.js";

async function getDbUserId(req) {
  const clerkId = getClerkUserId(req);
  const user = await findUserByClerkId(clerkId);
  return user?.id;
}

// GET /api/user/favorites
export async function listUserFavorites(req, res, next) {
  try {
    const userId = await getDbUserId(req);
    const favs = await listFavorites(userId);
    res.json({ favorites: favs });
  } catch (err) {
    next(err);
  }
}

// POST /api/user/favorites
export async function addUserFavorite(req, res, next) {
  try {
    const userId = await getDbUserId(req);
    const { recipe_id } = req.body;
    if (!recipe_id)
      return res.status(400).json({ error: "recipe_id required" });
    const fav = await addFavorite(userId, Number(recipe_id));
    res.status(201).json({ favorite: fav });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/user/favorites/:id
export async function removeUserFavorite(req, res, next) {
  try {
    const userId = await getDbUserId(req);
    const recipeId = Number(req.params.id);
    const fav = await removeFavorite(userId, recipeId);
    if (!fav) return res.status(404).json({ error: "Favorite not found" });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
