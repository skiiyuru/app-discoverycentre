CREATE TABLE `participants` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL
);
