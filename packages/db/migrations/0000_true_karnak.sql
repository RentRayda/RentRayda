CREATE TABLE "connection_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_profile_id" uuid NOT NULL,
	"listing_id" uuid NOT NULL,
	"landlord_profile_id" uuid NOT NULL,
	"message" varchar(200),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"responded_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"connection_request_id" uuid NOT NULL,
	"tenant_user_id" uuid NOT NULL,
	"landlord_user_id" uuid NOT NULL,
	"listing_id" uuid NOT NULL,
	"tenant_phone" varchar(15) NOT NULL,
	"landlord_phone" varchar(15) NOT NULL,
	"connected_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "connections_connection_request_id_unique" UNIQUE("connection_request_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" varchar(15) NOT NULL,
	"role" varchar(10) NOT NULL,
	"is_suspended" boolean DEFAULT false NOT NULL,
	"push_token" varchar(255),
	"last_active_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "landlord_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"barangay" varchar(100) NOT NULL,
	"city" varchar(50) DEFAULT 'Pasig' NOT NULL,
	"unit_count" integer DEFAULT 1 NOT NULL,
	"profile_photo_url" text,
	"verification_status" varchar(20) DEFAULT 'unverified' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "landlord_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "tenant_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"profile_photo_url" text,
	"home_province" varchar(100),
	"search_barangay" varchar(100),
	"current_city" varchar(50),
	"employment_type" varchar(20),
	"company_name" varchar(100),
	"employment_verified" boolean DEFAULT false NOT NULL,
	"move_in_date" date,
	"budget_min" integer,
	"budget_max" integer,
	"preferred_barangays" jsonb DEFAULT '[]'::jsonb,
	"verification_status" varchar(20) DEFAULT 'unverified' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tenant_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "verification_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"document_type" varchar(30) NOT NULL,
	"id_type" varchar(30),
	"r2_object_key" text NOT NULL,
	"selfie_r2_key" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"reviewer_notes" text,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"rejection_reason" varchar(200),
	"consent_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"landlord_profile_id" uuid NOT NULL,
	"unit_type" varchar(20) NOT NULL,
	"monthly_rent" integer NOT NULL,
	"barangay" varchar(100) NOT NULL,
	"city" varchar(50) DEFAULT 'Pasig' NOT NULL,
	"beds" integer DEFAULT 1,
	"rooms" integer DEFAULT 1,
	"inclusions" jsonb DEFAULT '[]'::jsonb,
	"description" varchar(200),
	"available_date" date,
	"advance_months" integer DEFAULT 1,
	"deposit_months" integer DEFAULT 2,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"last_active_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" uuid NOT NULL,
	"r2_object_key" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporter_id" uuid NOT NULL,
	"reported_user_id" uuid,
	"reported_listing_id" uuid,
	"report_type" varchar(30) NOT NULL,
	"description" text,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "connection_requests" ADD CONSTRAINT "connection_requests_tenant_profile_id_tenant_profiles_id_fk" FOREIGN KEY ("tenant_profile_id") REFERENCES "public"."tenant_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connection_requests" ADD CONSTRAINT "connection_requests_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connection_requests" ADD CONSTRAINT "connection_requests_landlord_profile_id_landlord_profiles_id_fk" FOREIGN KEY ("landlord_profile_id") REFERENCES "public"."landlord_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_connection_request_id_connection_requests_id_fk" FOREIGN KEY ("connection_request_id") REFERENCES "public"."connection_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "landlord_profiles" ADD CONSTRAINT "landlord_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant_profiles" ADD CONSTRAINT "tenant_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_documents" ADD CONSTRAINT "verification_documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_documents" ADD CONSTRAINT "verification_documents_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_landlord_profile_id_landlord_profiles_id_fk" FOREIGN KEY ("landlord_profile_id") REFERENCES "public"."landlord_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_photos" ADD CONSTRAINT "listing_photos_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reported_user_id_users_id_fk" FOREIGN KEY ("reported_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reported_listing_id_listings_id_fk" FOREIGN KEY ("reported_listing_id") REFERENCES "public"."listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_cr_unique" ON "connection_requests" USING btree ("tenant_profile_id","listing_id");--> statement-breakpoint
CREATE INDEX "idx_cr_landlord" ON "connection_requests" USING btree ("landlord_profile_id","status");--> statement-breakpoint
CREATE INDEX "idx_conn_tenant" ON "connections" USING btree ("tenant_user_id");--> statement-breakpoint
CREATE INDEX "idx_conn_landlord" ON "connections" USING btree ("landlord_user_id");--> statement-breakpoint
CREATE INDEX "idx_landlord_verification" ON "landlord_profiles" USING btree ("verification_status");--> statement-breakpoint
CREATE INDEX "idx_tenant_verification" ON "tenant_profiles" USING btree ("verification_status");--> statement-breakpoint
CREATE INDEX "idx_verdocs_user" ON "verification_documents" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_verdocs_status" ON "verification_documents" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_listings_search" ON "listings" USING btree ("status","city","barangay","monthly_rent");--> statement-breakpoint
CREATE INDEX "idx_listings_landlord" ON "listings" USING btree ("landlord_profile_id");--> statement-breakpoint
CREATE INDEX "idx_listings_freshness" ON "listings" USING btree ("last_active_at");--> statement-breakpoint
CREATE INDEX "idx_photos_listing" ON "listing_photos" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "idx_reports_status" ON "reports" USING btree ("status");