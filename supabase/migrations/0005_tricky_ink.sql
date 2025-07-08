ALTER TABLE "users" ADD COLUMN "password_reset_code" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_reset_expires" timestamp;