DROP INDEX "name_idx";--> statement-breakpoint
DROP INDEX "phone_status_idx";--> statement-breakpoint
DROP INDEX "request_id_idx";--> statement-breakpoint
ALTER TABLE `participants` ALTER COLUMN "first_name" TO "first_name" text(25) NOT NULL;--> statement-breakpoint
CREATE INDEX `name_idx` ON `participants` (`last_name`,`first_name`);--> statement-breakpoint
CREATE INDEX `phone_status_idx` ON `payments` (`phone_number`,`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `request_id_idx` ON `payments` (`checkout_request_id`,`merchant_request_id`);--> statement-breakpoint
ALTER TABLE `participants` ALTER COLUMN "last_name" TO "last_name" text(25) NOT NULL;--> statement-breakpoint
ALTER TABLE `participants` ALTER COLUMN "age" TO "age" integer NOT NULL;--> statement-breakpoint
ALTER TABLE `payments` ALTER COLUMN "phone_number" TO "phone_number" text(12) NOT NULL;