import { db } from "../db/index.js";
import { meal_plans } from "../db/schema.js";

// List all meal plans for a user
export async function listMealPlans(userId) {
  return db.select().from(meal_plans).where({ user_id: userId });
}

// Get a single meal plan by ID (and user)
export async function getMealPlanById(userId, planId) {
  const result = await db
    .select()
    .from(meal_plans)
    .where({ user_id: userId, id: planId });
  return result[0] || null;
}

// Create a new meal plan for a user
export async function createMealPlan(userId, { week, days }) {
  const [plan] = await db
    .insert(meal_plans)
    .values({
      user_id: userId,
      week,
      days,
    })
    .returning();
  return plan;
}

// Update a meal plan (only if it belongs to the user)
export async function updateMealPlan(userId, planId, data) {
  const [plan] = await db
    .update(meal_plans)
    .set({
      ...data,
      days: data.days !== undefined ? data.days : undefined,
    })
    .where({ user_id: userId, id: planId })
    .returning();
  return plan;
}

// Delete a meal plan (only if it belongs to the user)
export async function deleteMealPlan(userId, planId) {
  const [plan] = await db
    .delete(meal_plans)
    .where({ user_id: userId, id: planId })
    .returning();
  return plan;
}
