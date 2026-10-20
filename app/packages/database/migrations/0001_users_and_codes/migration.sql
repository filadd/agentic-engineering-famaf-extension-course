CREATE TABLE `codes` (
	`id` text PRIMARY KEY,
	`type` text NOT NULL,
	`code` text NOT NULL UNIQUE,
	`user_id` text,
	`deleted_at` integer,
	CONSTRAINT `fk_codes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY,
	`email` text NOT NULL UNIQUE,
	`name` text,
	`avatar` text,
	`role` text NOT NULL,
	`has_access` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `codes_user_id_unique` ON `codes` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `codes_current_enrollment_unique` ON `codes` (`type`) WHERE "codes"."type" = 'enrollment' and "codes"."deleted_at" is null;