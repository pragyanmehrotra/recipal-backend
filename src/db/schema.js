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
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  premium: boolean("premium").notNull().default(false),
  email_verified: boolean("email_verified").notNull().default(false),
  email_verification_token: text("email_verification_token"),
  email_verification_expires: timestamp("email_verification_expires"),
  password_reset_code: text("password_reset_code"),
  password_reset_expires: timestamp("password_reset_expires"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image"),
  url: text("url"),
  cook_time: text("cook_time"),
  prep_time: text("prep_time"),
  description: text("description"),
  recipeIngredients: jsonb("recipeIngredients"), // array of strings
  recipeInstructions: jsonb("recipeInstructions"), // array of strings
  details: jsonb("details"), // for any extra/unstructured fields
  source: text("source"),
  recipe_yield: text("recipe_yield"),
  date_published: text("date_published"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const meal_plans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const meal_plan_entries = pgTable("meal_plan_entries", {
  id: serial("id").primaryKey(),
  meal_plan_id: integer("meal_plan_id").notNull(),
  date: text("date").notNull(), // store as ISO date string (YYYY-MM-DD)
  section: text("section").notNull(),
  recipe_id: integer("recipe_id").notNull(),
  sort_order: integer("sort_order"),
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
