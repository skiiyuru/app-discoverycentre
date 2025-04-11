CREATE TABLE "participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"firstName" varchar(25) NOT NULL,
	"lastName" varchar(25) NOT NULL,
	"gender" varchar(6) NOT NULL,
	"age" smallint NOT NULL,
	"category" varchar(2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"participantId" uuid NOT NULL,
	"checkoutRequestId" varchar(50) NOT NULL,
	"merchantRequestId" varchar(50) NOT NULL,
	"phoneNumber" varchar(12) NOT NULL,
	"amount" numeric NOT NULL,
	"mpesaReceiptNumber" varchar(20) DEFAULT '' NOT NULL,
	"transactionDate" timestamp DEFAULT now() NOT NULL,
	"status" varchar DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE INDEX "name_idx" ON "participants" USING btree ("lastName","firstName");--> statement-breakpoint
CREATE INDEX "phone_status_idx" ON "payments" USING btree ("phoneNumber","status");--> statement-breakpoint
CREATE UNIQUE INDEX "request_id_idx" ON "payments" USING btree ("checkoutRequestId","merchantRequestId");