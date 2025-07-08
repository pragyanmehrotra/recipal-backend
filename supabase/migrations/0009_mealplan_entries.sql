-- Drop old meal_plans table if it exists
DROP TABLE IF EXISTS "meal_plans" CASCADE;

-- Create new meal_plans table
CREATE TABLE "meal_plans" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create meal_plan_entries table
CREATE TABLE "meal_plan_entries" (
  id SERIAL PRIMARY KEY,
  meal_plan_id INTEGER NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  section TEXT NOT NULL,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(meal_plan_id, date, section, recipe_id)
);

CREATE INDEX idx_meal_plan_entries_meal_plan_id ON meal_plan_entries(meal_plan_id);
CREATE INDEX idx_meal_plan_entries_date ON meal_plan_entries(date);
CREATE INDEX idx_meal_plan_entries_section ON meal_plan_entries(section);
CREATE INDEX idx_meal_plan_entries_recipe_id ON meal_plan_entries(recipe_id); 