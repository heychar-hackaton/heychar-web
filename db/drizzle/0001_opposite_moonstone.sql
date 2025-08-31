CREATE TABLE "organisation_secrets" (
	"organisation_id" text PRIMARY KEY NOT NULL,
	"api_key_enc" text,
	"folder_id_enc" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organisation_secrets" ADD CONSTRAINT "organisation_secrets_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE cascade ON UPDATE no action;