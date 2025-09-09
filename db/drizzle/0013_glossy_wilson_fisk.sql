ALTER TABLE "organisations" ALTER COLUMN "provider_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "hard_skills_score" real DEFAULT 0.5;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "soft_skills_score" real DEFAULT 0.5;