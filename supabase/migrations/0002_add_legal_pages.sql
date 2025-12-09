CREATE TABLE "legal_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"summary" text,
	"version" text DEFAULT '1.0' NOT NULL,
	"effective_date" timestamp with time zone NOT NULL,
	"last_reviewed_at" timestamp with time zone,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"last_edited_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "legal_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "legal_pages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "legal_pages" ADD CONSTRAINT "legal_pages_last_edited_by_id_profiles_id_fk" FOREIGN KEY ("last_edited_by_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;
