CREATE TYPE "public"."contact_submission_status" AS ENUM('new', 'read', 'replied', 'archived', 'spam');--> statement-breakpoint
CREATE TYPE "public"."contact_submission_topic" AS ENUM('quote', 'support', 'general', 'partnership', 'feedback');--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"phone" text,
	"topic" "contact_submission_topic" DEFAULT 'general' NOT NULL,
	"subject" text,
	"message" text NOT NULL,
	"project_type" text,
	"budget" text,
	"timeline" text,
	"order_id" text,
	"urgency" text,
	"status" "contact_submission_status" DEFAULT 'new' NOT NULL,
	"source" text DEFAULT 'website',
	"ip_address" text,
	"user_agent" text,
	"referrer" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"read_at" timestamp with time zone,
	"replied_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "contact_submissions" ENABLE ROW LEVEL SECURITY;