import { Router } from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { getProfile, putProfile } from "../controllers/userController.js";
import {
  listRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipeController.js";
import {
  listUserFavorites,
  addUserFavorite,
  removeUserFavorite,
} from "../controllers/favoriteController.js";
const router = Router();

// User profile
router.get("/profile", ClerkExpressRequireAuth(), getProfile);
router.put("/profile", ClerkExpressRequireAuth(), putProfile);

// User recipes
router.get("/recipes", ClerkExpressRequireAuth(), listRecipes);
router.post("/recipes", ClerkExpressRequireAuth(), createRecipe);
router.get("/recipes/:id", ClerkExpressRequireAuth(), getRecipe);
router.put("/recipes/:id", ClerkExpressRequireAuth(), updateRecipe);
router.delete("/recipes/:id", ClerkExpressRequireAuth(), deleteRecipe);

// Favorites
router.get("/favorites", ClerkExpressRequireAuth(), listUserFavorites);
router.post("/favorites", ClerkExpressRequireAuth(), addUserFavorite);
router.delete("/favorites/:id", ClerkExpressRequireAuth(), removeUserFavorite);

export default router;
