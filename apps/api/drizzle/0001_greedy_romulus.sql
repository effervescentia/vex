CREATE TYPE "public"."auth_algorithm" AS ENUM('RS256', 'EdDSA', 'ES256');--> statement-breakpoint
CREATE TYPE "public"."auth_transport" AS ENUM('ble', 'hybrid', 'internal', 'nfc', 'usb', 'smart-card');--> statement-breakpoint
CREATE TYPE "public"."memo_visibility" AS ENUM('public', 'hidden');--> statement-breakpoint
CREATE TABLE "account_alias" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"account_id" varchar(36) NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "account_alias_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "memo_boost" (
	"memo_id" varchar(36) NOT NULL,
	"account_id" varchar(36) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "memo_boost_memo_id_account_id_pk" PRIMARY KEY("memo_id","account_id")
);
--> statement-breakpoint
CREATE TABLE "memo" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"author_id" varchar(36) NOT NULL,
	"visibility" "memo_visibility" DEFAULT 'public' NOT NULL,
	"geolocation" "cube" NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "text_content" (
	"memo_id" varchar(36) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account_alias" ADD CONSTRAINT "account_alias_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_credential" ADD CONSTRAINT "auth_credential_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_credential_id_auth_credential_id_fk" FOREIGN KEY ("credential_id") REFERENCES "public"."auth_credential"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memo_boost" ADD CONSTRAINT "memo_boost_memo_id_memo_id_fk" FOREIGN KEY ("memo_id") REFERENCES "public"."memo"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memo_boost" ADD CONSTRAINT "memo_boost_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memo" ADD CONSTRAINT "memo_author_id_account_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_content" ADD CONSTRAINT "text_content_memo_id_memo_id_fk" FOREIGN KEY ("memo_id") REFERENCES "public"."memo"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_alias_account_id_index" ON "account_alias" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "account_alias_name_index" ON "account_alias" USING btree ("name");--> statement-breakpoint
CREATE INDEX "auth_credential_account_id_index" ON "auth_credential" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "auth_session_credential_id_index" ON "auth_session" USING btree ("credential_id");--> statement-breakpoint
CREATE INDEX "memo_boost_memo_id_index" ON "memo_boost" USING btree ("memo_id");--> statement-breakpoint
CREATE INDEX "memo_boost_account_id_index" ON "memo_boost" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "memo_author_id_index" ON "memo" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "text_content_memo_id_index" ON "text_content" USING btree ("memo_id");