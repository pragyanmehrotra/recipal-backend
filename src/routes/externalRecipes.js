import express from "express";
import { searchRecipes, getRecipe } from "../controllers/recipeController.js";

const router = express.Router();

// GET /api/external/recipes/search
router.get("/search", searchRecipes);

// GET /api/external/recipes/:id
router.get("/:id", getRecipe);

export default router;
