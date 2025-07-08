import {
  listMealPlans,
  getMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
  listEntries,
  addEntry,
  updateEntry,
  deleteEntry,
  getEntriesByDate,
  getEntriesBySection,
} from "../services/mealPlanService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const listPlans = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const plans = await listMealPlans(userId);
  res.json({ plans });
});

export const getPlan = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const plan = await getMealPlanById(userId, Number(req.params.id));
  if (!plan) return res.status(404).json({ error: "Meal plan not found" });
  res.json({ plan });
});

export const createPlan = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const plan = await createMealPlan(userId);
  res.status(201).json({ plan });
});

export const updatePlan = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const plan = await updateMealPlan(userId, Number(req.params.id), req.body);
  if (!plan) return res.status(404).json({ error: "Meal plan not found" });
  res.json({ plan });
});

export const deletePlan = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const plan = await deleteMealPlan(userId, Number(req.params.id));
  if (!plan) return res.status(404).json({ error: "Meal plan not found" });
  res.json({ success: true });
});

// --- Meal Plan Entries ---
export const listPlanEntries = asyncHandler(async (req, res) => {
  const planId = Number(req.params.id);
  const entries = await listEntries(planId);
  res.json({ entries });
});

export const addPlanEntry = asyncHandler(async (req, res) => {
  const planId = Number(req.params.id);
  const { date, section, recipe_id, sort_order } = req.body;
  if (!date || !section || !recipe_id) {
    return res
      .status(400)
      .json({ error: "date, section, and recipe_id are required" });
  }
  const entry = await addEntry(planId, {
    date,
    section,
    recipe_id,
    sort_order,
  });
  res.status(201).json({ entry });
});

export const updatePlanEntry = asyncHandler(async (req, res) => {
  const entryId = Number(req.params.entryId);
  const entry = await updateEntry(entryId, req.body);
  if (!entry) return res.status(404).json({ error: "Entry not found" });
  res.json({ entry });
});

export const deletePlanEntry = asyncHandler(async (req, res) => {
  const entryId = Number(req.params.entryId);
  const entry = await deleteEntry(entryId);
  if (!entry) return res.status(404).json({ error: "Entry not found" });
  res.json({ success: true });
});

export const getPlanEntriesByDate = asyncHandler(async (req, res) => {
  const planId = Number(req.params.id);
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: "date is required" });
  const entries = await getEntriesByDate(planId, date);
  res.json({ entries });
});

export const getPlanEntriesBySection = asyncHandler(async (req, res) => {
  const planId = Number(req.params.id);
  const { section } = req.query;
  if (!section) return res.status(400).json({ error: "section is required" });
  const entries = await getEntriesBySection(planId, section);
  res.json({ entries });
});
