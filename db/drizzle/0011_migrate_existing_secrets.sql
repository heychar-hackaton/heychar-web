-- Migrate existing organisation_secrets to new structure
-- First, update existing records to have provider = 'yandex' and generate UUIDs
UPDATE "organisation_secrets" 
SET 
  "id" = gen_random_uuid(),
  "provider" = 'yandex'
WHERE "provider" IS NULL;

-- Drop the old primary key constraint (organisation_id)
-- Note: This might need to be adjusted based on the actual constraint name
-- You can find it by running:
-- SELECT constraint_name FROM information_schema.table_constraints
-- WHERE table_schema = 'public' AND table_name = 'organisation_secrets' AND constraint_type = 'PRIMARY KEY';

-- ALTER TABLE "organisation_secrets" DROP CONSTRAINT "organisation_secrets_pkey";
