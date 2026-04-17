CREATE TYPE "public"."reservation_status" AS ENUM('pending', 'paid', 'refunded', 'expired');--> statement-breakpoint
CREATE TYPE "public"."reservation_tier" AS ENUM('placement');--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tier" "reservation_tier" DEFAULT 'placement' NOT NULL,
	"amount_centavos" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'PHP' NOT NULL,
	"status" "reservation_status" DEFAULT 'pending' NOT NULL,
	"paymongo_intent_id" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(15),
	"name" varchar(255),
	"utm_source" varchar(255),
	"utm_campaign" varchar(255),
	"utm_medium" varchar(255),
	"referrer" varchar(2048),
	"variant" varchar(50),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"paid_at" timestamp with time zone,
	"refunded_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reservations_paymongo_intent_id_unique" UNIQUE("paymongo_intent_id")
);
--> statement-breakpoint
CREATE TABLE "reservation_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reservation_id" uuid NOT NULL,
	"event" varchar(50) NOT NULL,
	"paymongo_event_id" varchar(255),
	"details" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reservation_events" ADD CONSTRAINT "reservation_events_reservation_id_reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("id") ON DELETE cascade ON UPDATE no action;