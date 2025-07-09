-- Migration: Drop old ingredients field from recipes table
ALTER TABLE recipes DROP COLUMN IF EXISTS ingredients;

-- Migration: Add recipeIngredients field to recipes table
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS recipeIngredients jsonb; 