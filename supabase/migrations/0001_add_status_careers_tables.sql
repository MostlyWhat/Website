CREATE TYPE "public"."incident_severity" AS ENUM('minor', 'major', 'critical');--> statement-breakpoint
CREATE TYPE "public"."incident_status" AS ENUM('investigating', 'identified', 'monitoring', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."job_application_status" AS ENUM('submitted', 'reviewing', 'interviewing', 'offered', 'hired', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."job_location_type" AS ENUM('remote', 'onsite', 'hybrid');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('draft', 'published', 'closed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('full_time', 'part_time', 'contract', 'freelance', 'internship');--> statement-breakpoint
CREATE TYPE "public"."service_status" AS ENUM('operational', 'degraded', 'outage', 'maintenance');--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"linkedin_url" text,
	"portfolio_url" text,
	"cover_letter" text,
	"resume_url" text,
	"answers" jsonb,
	"status" "job_application_status" DEFAULT 'submitted' NOT NULL,
	"notes" text,
	"reviewed_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "job_applications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "job_postings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"department" text,
	"location" text,
	"location_type" "job_location_type" DEFAULT 'remote' NOT NULL,
	"type" "job_type" DEFAULT 'full_time' NOT NULL,
	"description" text NOT NULL,
	"responsibilities" jsonb DEFAULT '[]'::jsonb,
	"requirements" jsonb DEFAULT '[]'::jsonb,
	"nice_to_have" jsonb DEFAULT '[]'::jsonb,
	"benefits" jsonb DEFAULT '[]'::jsonb,
	"salary_min" numeric(10, 2),
	"salary_max" numeric(10, 2),
	"salary_currency" text DEFAULT 'USD',
	"salary_period" text DEFAULT 'yearly',
	"application_url" text,
	"application_email" text,
	"status" "job_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"closes_at" timestamp with time zone,
	"is_featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_by_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "job_postings_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "job_postings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "status_incident_updates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"incident_id" uuid NOT NULL,
	"status" "incident_status" NOT NULL,
	"message" text NOT NULL,
	"created_by_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "status_incident_updates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "status_incidents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"status" "incident_status" DEFAULT 'investigating' NOT NULL,
	"severity" "incident_severity" DEFAULT 'minor' NOT NULL,
	"affected_services" jsonb DEFAULT '[]'::jsonb,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone,
	"is_scheduled" boolean DEFAULT false NOT NULL,
	"scheduled_for" timestamp with time zone,
	"scheduled_until" timestamp with time zone,
	"created_by_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "status_incidents_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "status_incidents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "status_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"status" "service_status" DEFAULT 'operational' NOT NULL,
	"uptime" numeric(5, 2) DEFAULT '100.00',
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "status_services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "status_services" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_job_postings_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job_postings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_reviewed_by_id_profiles_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_created_by_id_profiles_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_incident_updates" ADD CONSTRAINT "status_incident_updates_incident_id_status_incidents_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."status_incidents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_incident_updates" ADD CONSTRAINT "status_incident_updates_created_by_id_profiles_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_incidents" ADD CONSTRAINT "status_incidents_created_by_id_profiles_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;