CREATE TABLE "ticket_satisfaction_surveys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"response_time_rating" integer,
	"resolution_quality_rating" integer,
	"staff_professionalism_rating" integer,
	"feedback" text,
	"would_recommend" boolean,
	"survey_token" varchar(64) NOT NULL,
	"survey_sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"responded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ticket_satisfaction_surveys_ticket_id_unique" UNIQUE("ticket_id"),
	CONSTRAINT "ticket_satisfaction_surveys_survey_token_unique" UNIQUE("survey_token")
);
--> statement-breakpoint
ALTER TABLE "ticket_satisfaction_surveys" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "merged_into_id" uuid;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "merged_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "merged_by_id" uuid;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "parent_ticket_id" uuid;--> statement-breakpoint
ALTER TABLE "ticket_satisfaction_surveys" ADD CONSTRAINT "ticket_satisfaction_surveys_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_satisfaction_surveys" ADD CONSTRAINT "ticket_satisfaction_surveys_customer_id_profiles_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_merged_into_id_tickets_id_fk" FOREIGN KEY ("merged_into_id") REFERENCES "public"."tickets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_merged_by_id_profiles_id_fk" FOREIGN KEY ("merged_by_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_parent_ticket_id_tickets_id_fk" FOREIGN KEY ("parent_ticket_id") REFERENCES "public"."tickets"("id") ON DELETE set null ON UPDATE no action;