CREATE TYPE "public"."invoice_type" AS ENUM('one_time', 'recurring', 'deposit', 'milestone', 'final');--> statement-breakpoint
CREATE TYPE "public"."recurring_interval" AS ENUM('weekly', 'bi_weekly', 'monthly', 'quarterly', 'yearly');--> statement-breakpoint
ALTER TABLE "announcements" ADD COLUMN "link_url" text;--> statement-breakpoint
ALTER TABLE "announcements" ADD COLUMN "link_text" text;--> statement-breakpoint
ALTER TABLE "announcements" ADD COLUMN "link_style" text DEFAULT 'link';--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoice_type" "invoice_type" DEFAULT 'one_time' NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "is_recurring" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "recurring_interval" "recurring_interval";--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "recurring_start_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "recurring_end_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "recurring_next_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "recurring_parent_id" uuid;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "recurring_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_recurring_parent_id_invoices_id_fk" FOREIGN KEY ("recurring_parent_id") REFERENCES "public"."invoices"("id") ON DELETE set null ON UPDATE no action;