CREATE TABLE `audit` (
	`id` text PRIMARY KEY NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`record_id` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`canonical_url` text NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `records_canonical_url_unique` ON `records` (`canonical_url`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`token` text PRIMARY KEY NOT NULL,
	`role` text NOT NULL,
	`name` text NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
