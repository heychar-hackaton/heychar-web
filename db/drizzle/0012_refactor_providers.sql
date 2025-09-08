-- Create providers table
CREATE TABLE IF NOT EXISTS "providers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "provider_enum" NOT NULL,
	"api_key_enc" text NOT NULL,
	"folder_id_enc" text,
	"user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Add provider_id column to organisations
ALTER TABLE "organisations" ADD COLUMN "provider_id" text;

-- Migrate existing data from organisation_secrets to providers
INSERT INTO "providers" (
    "id",
    "name", 
    "type",
    "api_key_enc",
    "folder_id_enc",
    "user_id",
    "created_at",
    "updated_at"
)
SELECT 
    gen_random_uuid() as "id",
    CASE 
        WHEN os."provider" = 'yandex' THEN 'Яндекс провайдер'
        WHEN os."provider" = 'openai' THEN 'OpenAI провайдер'
        ELSE 'Провайдер ' || os."provider"
    END as "name",
    os."provider" as "type",
    os."api_key_enc",
    os."folder_id_enc",
    o."user_id",
    os."updated_at" as "created_at",
    os."updated_at"
FROM "organisation_secrets" os
JOIN "organisations" o ON o."id" = os."organisation_id"
WHERE os."api_key_enc" IS NOT NULL;

-- Update organisations to reference the new providers
UPDATE "organisations" 
SET "provider_id" = (
    SELECT p."id" 
    FROM "providers" p 
    WHERE p."user_id" = "organisations"."user_id" 
    AND p."type" = "organisations"."active_provider"
    LIMIT 1
)
WHERE "active_provider" IS NOT NULL;

-- Add foreign key constraint
DO $$ BEGIN
 ALTER TABLE "providers" ADD CONSTRAINT "providers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "organisations" ADD CONSTRAINT "organisations_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "providers"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Drop old columns and table
ALTER TABLE "organisations" DROP COLUMN IF EXISTS "active_provider";
DROP TABLE IF EXISTS "organisation_secrets";
