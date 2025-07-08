ALTER TABLE "recipes" DROP CONSTRAINT "recipes_spoonacular_id_unique";--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "ingredients" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "url" text;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "cook_time" text;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "source" text;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "recipe_yield" text;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "date_published" text;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "prep_time" text;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "recipes" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "recipes" DROP COLUMN "spoonacular_id";--> statement-breakpoint
ALTER TABLE "recipes" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "recipes" DROP COLUMN "summary";--> statement-breakpoint
ALTER TABLE "recipes" DROP COLUMN "ready_in_minutes";--> statement-breakpoint
ALTER TABLE "recipes" DROP COLUMN "servings";--> statement-breakpoint
ALTER TABLE "recipes" DROP COLUMN "source_url";--> statement-breakpoint
ALTER TABLE "recipes" DROP COLUMN "steps";