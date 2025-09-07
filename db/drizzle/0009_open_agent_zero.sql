CREATE TYPE "public"."interview_status_enum" AS ENUM('scheduled', 'in_progress', 'paused', 'completed', 'cancelled');--> statement-breakpoint
ALTER TABLE "interviews" ADD COLUMN "status" "interview_status_enum" DEFAULT 'scheduled' NOT NULL;--> statement-breakpoint
ALTER TABLE "interviews" DROP COLUMN "completed";