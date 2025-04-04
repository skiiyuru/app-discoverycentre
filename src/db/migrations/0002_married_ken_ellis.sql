ALTER TABLE `participants` RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE `participants` RENAME COLUMN "firstName" TO "first_name";--> statement-breakpoint
ALTER TABLE `participants` RENAME COLUMN "lastName" TO "last_name";--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`participant_id` text NOT NULL,
	`checkout_request_id` text NOT NULL,
	`merchant_request_id` text NOT NULL,
	`phone_number` text NOT NULL,
	`amount` text NOT NULL,
	`mpesa_receipt_number` text NOT NULL,
	`transactionDate` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payments_checkout_request_id_unique` ON `payments` (`checkout_request_id`);--> statement-breakpoint
ALTER TABLE `participants` DROP COLUMN `mobile`;