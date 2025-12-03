CREATE TYPE "public"."project_request_status" AS ENUM('pending', 'under_review', 'approved', 'rejected', 'converted');--> statement-breakpoint
CREATE TABLE "project_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"requested_by_id" uuid NOT NULL,
	"request_number" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"project_type" text NOT NULL,
	"budget_range" text,
	"timeline" text,
	"goals" text,
	"requirements" text,
	"references" text,
	"status" "project_request_status" DEFAULT 'pending' NOT NULL,
	"reviewed_by_id" uuid,
	"reviewed_at" timestamp with time zone,
	"review_notes" text,
	"project_id" uuid,
	"converted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "project_requests_request_number_unique" UNIQUE("request_number")
);
--> statement-breakpoint
ALTER TABLE "project_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
-- Add project_number column with default value for existing rows
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "project_number" text;--> statement-breakpoint
UPDATE "projects" SET "project_number" = 'PRJ-' || TO_CHAR("created_at", 'YYYY') || '-' || LPAD(SUBSTRING(id::text, 1, 5), 5, '0') WHERE "project_number" IS NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "project_number" SET NOT NULL;--> statement-breakpoint
-- Add proposal_number column with default value for existing rows
ALTER TABLE "proposals" ADD COLUMN IF NOT EXISTS "proposal_number" text;--> statement-breakpoint
UPDATE "proposals" SET "proposal_number" = 'PRP-' || TO_CHAR("created_at", 'YYYY') || '-' || LPAD(SUBSTRING(id::text, 1, 5), 5, '0') WHERE "proposal_number" IS NULL;--> statement-breakpoint
ALTER TABLE "proposals" ALTER COLUMN "proposal_number" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_requested_by_id_profiles_id_fk" FOREIGN KEY ("requested_by_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_reviewed_by_id_profiles_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_requests" ADD CONSTRAINT "project_requests_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_project_number_unique') THEN
    ALTER TABLE "projects" ADD CONSTRAINT "projects_project_number_unique" UNIQUE("project_number");
  END IF;
END $$;--> statement-breakpoint
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'proposals_proposal_number_unique') THEN
    ALTER TABLE "proposals" ADD CONSTRAINT "proposals_proposal_number_unique" UNIQUE("proposal_number");
  END IF;
END $$;