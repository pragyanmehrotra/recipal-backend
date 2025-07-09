CREATE TABLE "meal_plan_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"meal_plan_id" integer NOT NULL,
	"date" text NOT NULL,
	"section" text NOT NULL,
	"recipe_id" integer NOT NULL,
	"sort_order" integer
);
--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "ingredients" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "instructions" jsonb;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "details" jsonb;--> statement-breakpoint
ALTER TABLE "meal_plans" DROP COLUMN "week";--> statement-breakpoint
ALTER TABLE "meal_plans" DROP COLUMN "days";