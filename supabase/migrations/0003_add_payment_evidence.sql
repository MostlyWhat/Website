CREATE TYPE "public"."payment_evidence_status" AS ENUM('pending', 'approved', 'rejected', 'processing');--> statement-breakpoint
CREATE TABLE "payment_evidence" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"file_name" text NOT NULL,
	"file_url" text NOT NULL,
	"file_size" integer,
	"file_type" text,
	"amount" numeric(12, 2),
	"payment_date" timestamp with time zone,
	"payment_method" text,
	"transaction_reference" text,
	"notes" text,
	"status" "payment_evidence_status" DEFAULT 'pending' NOT NULL,
	"admin_notes" text,
	"reviewed_by_id" uuid,
	"reviewed_at" timestamp with time zone,
	"submitted_by_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payment_evidence" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payment_evidence" ADD CONSTRAINT "payment_evidence_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_evidence" ADD CONSTRAINT "payment_evidence_reviewed_by_id_profiles_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_evidence" ADD CONSTRAINT "payment_evidence_submitted_by_id_profiles_id_fk" FOREIGN KEY ("submitted_by_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;