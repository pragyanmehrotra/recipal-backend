import {
  listMealPlans,
  getMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
} from "../services/mealPlanService.js";
import { getClerkUserId } from "../utils/auth.js";
import { findUserByClerkId } from "../services/userService.js";

async function getDbUserId(req) {
  const clerkId = getClerkUserId(req);
  const user = await findUserByClerkId(clerkId);
  return user?.id;
}

export async function listPlans(req, res, next) {
  try {
    const userId = await getDbUserId(req);
    const plans = await listMealPlans(userId);
    res.json({ plans });
  } catch (err) {
    next(err);
  }
}

export async function getPlan(req, res, next) {
  try {
    const userId = await getDbUserId(req);
    const plan = await getMealPlanById(userId, Number(req.params.id));
    if (!plan) return res.status(404).json({ error: "Meal plan not found" });
    res.json({ plan });
  } catch (err) {
    next(err);
  }
}

export async function createPlan(req, res, next) {
  try {
    const userId = await getDbUserId(req);
    const { week, days } = req.body;
    const plan = await createMealPlan(userId, { week, days });
    res.status(201).json({ plan });
  } catch (err) {
    next(err);
  }
}

export async function updatePlan(req, res, next) {
  try {
    const userId = await getDbUserId(req);
    const plan = await updateMealPlan(userId, Number(req.params.id), req.body);
    if (!plan) return res.status(404).json({ error: "Meal plan not found" });
    res.json({ plan });
  } catch (err) {
    next(err);
  }
}

export async function deletePlan(req, res, next) {
  try {
    const userId = await getDbUserId(req);
    const plan = await deleteMealPlan(userId, Number(req.params.id));
    if (!plan) return res.status(404).json({ error: "Meal plan not found" });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
