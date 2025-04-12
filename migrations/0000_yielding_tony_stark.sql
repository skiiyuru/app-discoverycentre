CREATE TABLE "participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"first_name" varchar(25) NOT NULL,
	"last_name" varchar(25) NOT NULL,
	"gender" varchar(6) NOT NULL,
	"age" smallint NOT NULL,
	"category" varchar(2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"participant_id" uuid NOT NULL,
	"checkout_request_id" varchar(50) NOT NULL,
	"merchant_request_id" varchar(50) NOT NULL,
	"phone_number" varchar(12) NOT NULL,
	"amount" numeric NOT NULL,
	"mpesa_receipt_number" varchar(20) DEFAULT '' NOT NULL,
	"transaction_date" timestamp DEFAULT now() NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE INDEX "name_idx" ON "participants" USING btree ("last_name","first_name");--> statement-breakpoint
CREATE INDEX "phone_status_idx" ON "payments" USING btree ("phone_number","status");--> statement-breakpoint
CREATE UNIQUE INDEX "request_id_idx" ON "payments" USING btree ("checkout_request_id","merchant_request_id");