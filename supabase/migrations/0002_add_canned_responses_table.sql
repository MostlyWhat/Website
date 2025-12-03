CREATE TABLE "canned_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"shortcut" text,
	"content" text NOT NULL,
	"category" text,
	"is_global" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by_id" uuid NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"last_used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "canned_responses" ADD CONSTRAINT "canned_responses_created_by_id_profiles_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;