-- Add project milestones table for tracking project deliverables and stages
CREATE TYPE "public"."milestone_status" AS ENUM('pending', 'in_progress', 'completed', 'on_hold', 'cancelled');

CREATE TABLE IF NOT EXISTS "project_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"status" "milestone_status" DEFAULT 'pending' NOT NULL,
	"due_date" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"weight" integer DEFAULT 10 NOT NULL,
	"invoice_id" uuid,
	"created_by_id" uuid,
	"completed_by_id" uuid,
	"deliverables" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Add RLS
ALTER TABLE "project_milestones" ENABLE ROW LEVEL SECURITY;

-- Add foreign keys
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_created_by_id_profiles_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_completed_by_id_profiles_id_fk" FOREIGN KEY ("completed_by_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;
