ALTER TABLE "recipes" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "ingredients" SET DATA TYPE jsonb USING ingredients::jsonb;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "ingredients" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "steps" SET DATA TYPE jsonb USING steps::jsonb;--> statement-breakpoint
ALTER TABLE "recipes" ALTER COLUMN "steps" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "meal_plans" ALTER COLUMN "days" SET DATA TYPE jsonb USING days::jsonb;--> statement-breakpoint
ALTER TABLE "grocery_lists" ALTER COLUMN "items" SET DATA TYPE jsonb USING items::jsonb;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "spoonacular_id" integer;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "summary" text;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "ready_in_minutes" integer;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "servings" integer;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "source_url" text;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "data" jsonb;--> statement-breakpoint
ALTER TABLE "recipes" DROP COLUMN "is_favorite";