-- Organisation secrets storage (encrypted JSON payloads via AES-256-GCM)
CREATE TABLE IF NOT EXISTS "organisation_secrets" (
  "organisation_id" text PRIMARY KEY REFERENCES "organisations"("id") ON DELETE CASCADE,
  "api_key_enc" text,
  "folder_id_enc" text,
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

-- Helpful index (PK already exists). Adding an update trigger timestamp could be done in app layer.
