CREATE TYPE "public"."provider_enum" AS ENUM('yandex', 'openai');--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'organisation_secrets'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "organisation_secrets" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "organisation_secrets" ADD COLUMN "id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "organisation_secrets" ADD COLUMN "provider" "provider_enum" NOT NULL;--> statement-breakpoint
ALTER TABLE "organisation_secrets" ADD CONSTRAINT "organisation_secrets_organisation_id_provider_unique" UNIQUE("organisation_id","provider");