import { Router } from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";
import {
  listPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
  listPlanEntries,
  addPlanEntry,
  updatePlanEntry,
  deletePlanEntry,
  getPlanEntriesByDate,
  getPlanEntriesBySection,
  syncPlans,
  getCompletePlan,
} from "../controllers/mealPlanController.js";
const router = Router();

// Meal plan CRUD
router.get("/", jwtAuth, listPlans);
router.post("/", jwtAuth, createPlan);

// Bulk sync and complete meal plan (must come before /:id routes)
router.post("/sync", jwtAuth, syncPlans);
router.get("/complete", jwtAuth, getCompletePlan);

// Meal plan by ID (must come after specific routes)
router.get("/:id", jwtAuth, getPlan);
router.put("/:id", jwtAuth, updatePlan);
router.delete("/:id", jwtAuth, deletePlan);

// Meal plan entries
router.get("/:id/entries", jwtAuth, listPlanEntries);
router.post("/:id/entries", jwtAuth, addPlanEntry);
router.put("/:id/entries/:entryId", jwtAuth, updatePlanEntry);
router.delete("/:id/entries/:entryId", jwtAuth, deletePlanEntry);
router.get("/:id/entries-by-date", jwtAuth, getPlanEntriesByDate);
router.get("/:id/entries-by-section", jwtAuth, getPlanEntriesBySection);

export default router;
