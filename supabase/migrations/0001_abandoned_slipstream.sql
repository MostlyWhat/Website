CREATE TYPE "public"."project_phase" AS ENUM('request', 'review', 'proposal', 'confirmed', 'building', 'completed', 'support');--> statement-breakpoint
CREATE TYPE "public"."proposal_confirmation_status" AS ENUM('draft', 'sent', 'viewed', 'client_accepted', 'admin_confirmed', 'rejected', 'expired');--> statement-breakpoint
CREATE TYPE "public"."revision_status" AS ENUM('pending', 'in_progress', 'resolved', 'declined');--> statement-breakpoint
CREATE TABLE "project_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"version" text,
	"title" text NOT NULL,
	"description" text,
	"requested_by_id" uuid,
	"assigned_to_id" uuid,
	"status" "revision_status" DEFAULT 'pending' NOT NULL,
	"priority" "ticket_priority" DEFAULT 'medium' NOT NULL,
	"resolved_at" timestamp with time zone,
	"resolution_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_revisions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "phase" "project_phase" DEFAULT 'request' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "proposal_status" "proposal_confirmation_status";--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "client_accepted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "admin_confirmed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "support_tier_id" uuid;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "support_started_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "support_ends_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "project_revisions" ADD CONSTRAINT "project_revisions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_revisions" ADD CONSTRAINT "project_revisions_requested_by_id_profiles_id_fk" FOREIGN KEY ("requested_by_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_revisions" ADD CONSTRAINT "project_revisions_assigned_to_id_profiles_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;