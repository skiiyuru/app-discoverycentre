DROP INDEX "payments_checkout_request_id_unique";--> statement-breakpoint
ALTER TABLE `payments` ALTER COLUMN "mpesa_receipt_number" TO "mpesa_receipt_number" text NOT NULL DEFAULT '';--> statement-breakpoint
CREATE UNIQUE INDEX `payments_checkout_request_id_unique` ON `payments` (`checkout_request_id`);--> statement-breakpoint
ALTER TABLE `payments` ALTER COLUMN "transactionDate" TO "transactionDate" text NOT NULL DEFAULT '';