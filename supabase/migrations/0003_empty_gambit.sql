CREATE TYPE "public"."api_key_scope" AS ENUM('read:tickets', 'write:tickets', 'read:projects', 'write:projects', 'read:invoices', 'write:invoices', 'read:customers', 'write:customers', 'read:analytics', 'admin:all');--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"key" text NOT NULL,
	"key_prefix" text NOT NULL,
	"user_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"scopes" text[] NOT NULL,
	"rate_limit" integer DEFAULT 100,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_used_at" timestamp with time zone,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "api_keys" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "payment_provider" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "lemon_squeezy_order_id" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "lemon_squeezy_checkout_id" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "lemon_squeezy_customer_id" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "wire_transfer_instructions" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "wire_transfer_receipt_url" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "wire_transfer_approved_by" uuid;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "wire_transfer_approved_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "wire_transfer_discount" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_wire_transfer_approved_by_profiles_id_fk" FOREIGN KEY ("wire_transfer_approved_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "stripe_payment_intent_id";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "stripe_session_id";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "stripe_customer_id";