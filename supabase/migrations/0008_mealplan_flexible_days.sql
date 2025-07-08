-- Migration: Make meal_plans.days flexible per-day, per-section, per-recipe
ALTER TABLE "meal_plans" DROP COLUMN "week";
-- 'days' is already JSONB, but now will be structured as:
-- { "2024-07-09": { "Breakfast": [recipeId, ...], ... }, ... }
-- No further schema change needed, just a documentation update.