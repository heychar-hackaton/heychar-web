CREATE TABLE "providers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "provider_enum" NOT NULL,
	"api_key_enc" text NOT NULL,
	"folder_id_enc" text,
	"user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organisation_secrets" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "organisation_secrets" CASCADE;--> statement-breakpoint
ALTER TABLE "organisations" ADD COLUMN "provider_id" text;--> statement-breakpoint
ALTER TABLE "providers" ADD CONSTRAINT "providers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisations" ADD CONSTRAINT "organisations_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organisations" DROP COLUMN "active_provider";