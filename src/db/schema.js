import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerk_id: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name"),
  premium: boolean("premium").notNull().default(false),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id"), // nullable for external recipes
  spoonacular_id: integer("spoonacular_id"), // nullable for user recipes
  title: text("title").notNull(),
  image: text("image"),
  summary: text("summary"),
  ready_in_minutes: integer("ready_in_minutes"),
  servings: integer("servings"),
  source_url: text("source_url"),
  ingredients: jsonb("ingredients"), // array of ingredient objects
  steps: jsonb("steps"), // array of step objects
  data: jsonb("data"), // full Spoonacular response or extra data
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const meal_plans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  week: text("week").notNull(), // e.g. '2024-W27'
  days: jsonb("days").notNull(), // JSON object: { Monday: [recipeId, ...], ... }
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const grocery_lists = pgTable("grocery_lists", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  items: jsonb("items").notNull(), // array of item objects
  generated_from: integer("generated_from"), // meal_plan id
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  recipe_id: integer("recipe_id").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const push_tokens = pgTable("push_tokens", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  expo_token: text("expo_token").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
