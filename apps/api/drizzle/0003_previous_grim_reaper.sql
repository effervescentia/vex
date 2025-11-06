CREATE TYPE "public"."memo_visibility" AS ENUM('public', 'hidden');--> statement-breakpoint
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
ALTER TABLE "post_boost" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "post" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "post_boost" CASCADE;--> statement-breakpoint
DROP TABLE "post" CASCADE;--> statement-breakpoint
ALTER TABLE "text_content" DROP CONSTRAINT "text_content_post_id_post_id_fk";
--> statement-breakpoint
DROP INDEX "text_content_post_id_index";--> statement-breakpoint
ALTER TABLE "text_content" ADD COLUMN "memo_id" varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE "memo_boost" ADD CONSTRAINT "memo_boost_memo_id_memo_id_fk" FOREIGN KEY ("memo_id") REFERENCES "public"."memo"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memo_boost" ADD CONSTRAINT "memo_boost_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memo" ADD CONSTRAINT "memo_author_id_account_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "memo_boost_memo_id_index" ON "memo_boost" USING btree ("memo_id");--> statement-breakpoint
CREATE INDEX "memo_boost_account_id_index" ON "memo_boost" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "memo_author_id_index" ON "memo" USING btree ("author_id");--> statement-breakpoint
ALTER TABLE "text_content" ADD CONSTRAINT "text_content_memo_id_memo_id_fk" FOREIGN KEY ("memo_id") REFERENCES "public"."memo"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "text_content_memo_id_index" ON "text_content" USING btree ("memo_id");--> statement-breakpoint
ALTER TABLE "text_content" DROP COLUMN "post_id";--> statement-breakpoint
DROP TYPE "public"."post_visibility";