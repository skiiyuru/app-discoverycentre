DROP INDEX `payments_checkout_request_id_unique`;--> statement-breakpoint
CREATE INDEX `phone_status_idx` ON `payments` (`phone_number`,`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `request_id_idx` ON `payments` (`checkout_request_id`,`merchant_request_id`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `participants` (`last_name`,`first_name`);