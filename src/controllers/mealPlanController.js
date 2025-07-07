import {
  listMealPlans,
  getMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
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
  const { week, days } = req.body;
  const plan = await createMealPlan(userId, { week, days });
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
