import { db } from "../db/index.js";
import { meal_plans, meal_plan_entries, recipes } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

// List all meal plans for a user
export async function listMealPlans(userId) {
  return db.select().from(meal_plans).where(eq(meal_plans.user_id, userId));
}

// Get a single meal plan by ID (and user)
export async function getMealPlanById(userId, planId) {
  // Validate planId is a valid number
  if (!planId || isNaN(planId) || planId <= 0) {
    return null;
  }

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
  // Validate planId is a valid number
  if (!planId || isNaN(planId) || planId <= 0) {
    return null;
  }

  const [plan] = await db
    .update(meal_plans)
    .set({ created_at: data.created_at })
    .where(and(eq(meal_plans.user_id, userId), eq(meal_plans.id, planId)))
    .returning();
  return plan;
}

// Delete a meal plan (and all its entries)
export async function deleteMealPlan(userId, planId) {
  // Validate planId is a valid number
  if (!planId || isNaN(planId) || planId <= 0) {
    return null;
  }

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
  // Validate mealPlanId is a valid number
  if (!mealPlanId || isNaN(mealPlanId) || mealPlanId <= 0) {
    return [];
  }

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
  // Validate mealPlanId is a valid number
  if (!mealPlanId || isNaN(mealPlanId) || mealPlanId <= 0) {
    throw new Error("Invalid meal plan ID");
  }

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
  // Validate mealPlanId is a valid number
  if (!mealPlanId || isNaN(mealPlanId) || mealPlanId <= 0) {
    return [];
  }

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
  // Validate mealPlanId is a valid number
  if (!mealPlanId || isNaN(mealPlanId) || mealPlanId <= 0) {
    return [];
  }

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

// Bulk sync meal plans for a user
export async function syncMealPlans(userId, mealsData, sections) {
  // Get or create the user's meal plan
  let userPlan = await db
    .select()
    .from(meal_plans)
    .where(eq(meal_plans.user_id, userId))
    .limit(1);

  let planId;
  if (userPlan.length === 0) {
    // Create new meal plan
    const [newPlan] = await db
      .insert(meal_plans)
      .values({ user_id: userId })
      .returning();
    planId = newPlan.id;
  } else {
    planId = userPlan[0].id;
  }

  // Delete all existing entries for this plan
  await db
    .delete(meal_plan_entries)
    .where(eq(meal_plan_entries.meal_plan_id, planId));

  // Insert new entries
  const entries = [];
  for (const [date, dayMeals] of Object.entries(mealsData)) {
    for (const [section, recipes] of Object.entries(dayMeals)) {
      for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        entries.push({
          meal_plan_id: planId,
          date,
          section,
          recipe_id: recipe.id,
          sort_order: i,
        });
      }
    }
  }

  if (entries.length > 0) {
    await db.insert(meal_plan_entries).values(entries);
  }

  return {
    plan_id: planId,
    entries_count: entries.length,
    sections,
  };
}

// Get complete meal plan data for a user (meals + sections)
export async function getCompleteMealPlan(userId) {
  // Get user's meal plan
  const userPlan = await db
    .select()
    .from(meal_plans)
    .where(eq(meal_plans.user_id, userId))
    .limit(1);

  if (userPlan.length === 0) {
    return { meals: {}, sections: ["Breakfast", "Lunch", "Dinner"] };
  }

  const planId = userPlan[0].id;

  // Get all entries joined with recipes
  const entries = await db
    .select({
      date: meal_plan_entries.date,
      section: meal_plan_entries.section,
      sort_order: meal_plan_entries.sort_order,
      recipe_id: meal_plan_entries.recipe_id,
      // Recipe fields
      recipe_name: recipes.name,
      recipe_image: recipes.image,
      recipe_cook_time: recipes.cook_time,
      recipe_yield: recipes.recipe_yield,
      recipe_url: recipes.url,
      recipe_description: recipes.description,
      recipe_source: recipes.source,
    })
    .from(meal_plan_entries)
    .where(eq(meal_plan_entries.meal_plan_id, planId))
    .leftJoin(recipes, eq(meal_plan_entries.recipe_id, recipes.id))
    .orderBy(meal_plan_entries.date, meal_plan_entries.sort_order);

  // Group by date and section
  const meals = {};
  const sections = new Set();

  for (const entry of entries) {
    if (!meals[entry.date]) {
      meals[entry.date] = {};
    }
    if (!meals[entry.date][entry.section]) {
      meals[entry.date][entry.section] = [];
    }

    meals[entry.date][entry.section].push({
      id: entry.recipe_id,
      name: entry.recipe_name,
      image: entry.recipe_image,
      cook_time: entry.recipe_cook_time,
      recipe_yield: entry.recipe_yield,
      url: entry.recipe_url,
      description: entry.recipe_description,
      source: entry.recipe_source,
    });

    sections.add(entry.section);
  }

  const sectionsArr = Array.from(sections);
  return {
    meals,
    sections:
      sectionsArr.length > 0 ? sectionsArr : ["Breakfast", "Lunch", "Dinner"],
  };
}
