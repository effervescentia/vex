CREATE TYPE "public"."post_visibility" AS ENUM('public', 'hidden');--> statement-breakpoint
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
CREATE TABLE "post_boost" (
	"post_id" varchar(36) NOT NULL,
	"account_id" varchar(36) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "post_boost_post_id_account_id_pk" PRIMARY KEY("post_id","account_id")
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"author_id" varchar(36) NOT NULL,
	"visibility" "post_visibility" DEFAULT 'public' NOT NULL,
	"geolocation" "cube" NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "text_content" (
	"post_id" varchar(36) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account_alias" ADD CONSTRAINT "account_alias_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_boost" ADD CONSTRAINT "post_boost_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_boost" ADD CONSTRAINT "post_boost_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_author_id_account_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_content" ADD CONSTRAINT "text_content_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_alias_account_id_index" ON "account_alias" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "account_alias_name_index" ON "account_alias" USING btree ("name");--> statement-breakpoint
CREATE INDEX "post_boost_post_id_index" ON "post_boost" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_boost_account_id_index" ON "post_boost" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "post_author_id_index" ON "post" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "text_content_post_id_index" ON "text_content" USING btree ("post_id");