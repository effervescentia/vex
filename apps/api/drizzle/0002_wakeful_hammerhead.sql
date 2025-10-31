CREATE TYPE "public"."auth_algorithm" AS ENUM('RS256', 'EdDSA', 'ES256');--> statement-breakpoint
CREATE TYPE "public"."auth_transport" AS ENUM('ble', 'hybrid', 'internal', 'nfc', 'usb', 'smart-card');--> statement-breakpoint
CREATE TABLE "auth_credential" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" varchar(36) NOT NULL,
	"public_key" text NOT NULL,
	"algorithm" "auth_algorithm" NOT NULL,
	"transports" "auth_transport"[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_session" (
	"id" serial PRIMARY KEY NOT NULL,
	"credential_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "auth_session_credential_id_unique" UNIQUE("credential_id")
);
--> statement-breakpoint
ALTER TABLE "auth_credential" ADD CONSTRAINT "auth_credential_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_credential_id_auth_credential_id_fk" FOREIGN KEY ("credential_id") REFERENCES "public"."auth_credential"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "auth_credential_account_id_index" ON "auth_credential" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "auth_session_credential_id_index" ON "auth_session" USING btree ("credential_id");