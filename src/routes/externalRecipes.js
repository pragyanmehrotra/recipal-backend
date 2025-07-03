import { Router } from "express";
import {
  searchExternalRecipes,
  getExternalRecipe,
} from "../controllers/spoonacularController.js";

const router = Router();

// Search Spoonacular recipes
router.get("/search", searchExternalRecipes);
// Get Spoonacular recipe by ID
router.get("/:id", getExternalRecipe);

export default router;
