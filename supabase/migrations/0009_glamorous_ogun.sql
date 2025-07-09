ALTER TABLE "recipes" ADD COLUMN "recipeIngredients" jsonb;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "recipeInstructions" jsonb;--> statement-breakpoint
ALTER TABLE "recipes" DROP COLUMN "ingredients";--> statement-breakpoint
ALTER TABLE "recipes" DROP COLUMN "instructions";--> statement-breakpoint
ALTER TABLE "recipes" DROP COLUMN "data";