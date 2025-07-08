import { db } from "../db/index.js";
import { meal_plans, meal_plan_entries } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

// List all meal plans for a user
export async function listMealPlans(userId) {
  return db.select().from(meal_plans).where(eq(meal_plans.user_id, userId));
}

// Get a single meal plan by ID (and user)
export async function getMealPlanById(userId, planId) {
  const result = await db
    .select()
    .from(meal_plans)
    .where(and(eq(meal_plans.user_id, userId), eq(meal_plans.id, planId)));
  return result[0] || null;
}

// Create a new meal plan for a user
export async function createMealPlan(userId) {
  const [plan] = await db
    .insert(meal_plans)
    .values({ user_id: userId })
    .returning();
  return plan;
}

// Update a meal plan (currently only supports updating created_at)
export async function updateMealPlan(userId, planId, data) {
  const [plan] = await db
    .update(meal_plans)
    .set({ created_at: data.created_at })
    .where(and(eq(meal_plans.user_id, userId), eq(meal_plans.id, planId)))
    .returning();
  return plan;
}

// Delete a meal plan (and all its entries)
export async function deleteMealPlan(userId, planId) {
  // Delete entries first (ON DELETE CASCADE should handle this, but for safety)
  await db
    .delete(meal_plan_entries)
    .where(eq(meal_plan_entries.meal_plan_id, planId));
  const [plan] = await db
    .delete(meal_plans)
    .where(and(eq(meal_plans.user_id, userId), eq(meal_plans.id, planId)))
    .returning();
  return plan;
}

// List all entries for a meal plan
export async function listEntries(mealPlanId) {
  return db
    .select()
    .from(meal_plan_entries)
    .where(eq(meal_plan_entries.meal_plan_id, mealPlanId));
}

// Add an entry to a meal plan
export async function addEntry(
  mealPlanId,
  { date, section, recipe_id, sort_order }
) {
  const [entry] = await db
    .insert(meal_plan_entries)
    .values({ meal_plan_id: mealPlanId, date, section, recipe_id, sort_order })
    .returning();
  return entry;
}

// Update an entry
export async function updateEntry(entryId, data) {
  const [entry] = await db
    .update(meal_plan_entries)
    .set(data)
    .where(eq(meal_plan_entries.id, entryId))
    .returning();
  return entry;
}

// Delete an entry
export async function deleteEntry(entryId) {
  const [entry] = await db
    .delete(meal_plan_entries)
    .where(eq(meal_plan_entries.id, entryId))
    .returning();
  return entry;
}

// Get entries for a meal plan by date
export async function getEntriesByDate(mealPlanId, date) {
  return db
    .select()
    .from(meal_plan_entries)
    .where(
      and(
        eq(meal_plan_entries.meal_plan_id, mealPlanId),
        eq(meal_plan_entries.date, date)
      )
    );
}

// Get entries for a meal plan by section
export async function getEntriesBySection(mealPlanId, section) {
  return db
    .select()
    .from(meal_plan_entries)
    .where(
      and(
        eq(meal_plan_entries.meal_plan_id, mealPlanId),
        eq(meal_plan_entries.section, section)
      )
    );
}
