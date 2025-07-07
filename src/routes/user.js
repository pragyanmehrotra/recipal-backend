import { Router } from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";
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
router.get("/profile", jwtAuth, getProfile);
router.put("/profile", jwtAuth, putProfile);

// User recipes
router.get("/recipes", jwtAuth, listRecipes);
router.post("/recipes", jwtAuth, createRecipe);
router.get("/recipes/:id", jwtAuth, getRecipe);
router.put("/recipes/:id", jwtAuth, updateRecipe);
router.delete("/recipes/:id", jwtAuth, deleteRecipe);

// Favorites
router.get("/favorites", jwtAuth, listUserFavorites);
router.post("/favorites", jwtAuth, addUserFavorite);
router.delete("/favorites/:id", jwtAuth, removeUserFavorite);

export default router;
