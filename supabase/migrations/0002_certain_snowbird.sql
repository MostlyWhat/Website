CREATE TABLE "ticket_escalations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_id" uuid NOT NULL,
	"reason" text NOT NULL,
	"from_priority" "ticket_priority" NOT NULL,
	"to_priority" "ticket_priority" NOT NULL,
	"escalated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ticket_escalations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ticket_watchers" (
	"ticket_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ticket_watchers_ticket_id_user_id_pk" PRIMARY KEY("ticket_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "ticket_watchers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ticket_escalations" ADD CONSTRAINT "ticket_escalations_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_watchers" ADD CONSTRAINT "ticket_watchers_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_watchers" ADD CONSTRAINT "ticket_watchers_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;