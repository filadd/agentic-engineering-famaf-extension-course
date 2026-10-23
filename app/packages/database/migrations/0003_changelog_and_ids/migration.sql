PRAGMA defer_foreign_keys = on;--> statement-breakpoint
CREATE TABLE `changelog_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`type` text NOT NULL,
	`entity_id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsec') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_changelog_entries_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`)
);
--> statement-breakpoint
CREATE TABLE `__copy_users` AS SELECT `id`, `email`, `name`, `avatar`, `role`, `has_access` FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL UNIQUE,
	`name` text,
	`avatar` text,
	`role` text NOT NULL,
	`has_access` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `users`(`id`, `email`, `name`, `avatar`, `role`, `has_access`) SELECT `id`, `email`, `name`, `avatar`, `role`, `has_access` FROM `__copy_users`;--> statement-breakpoint
DROP TABLE `__copy_users`;--> statement-breakpoint
CREATE TABLE `__copy_codes` AS SELECT `id`, `type`, `code`, `user_id`, `deleted_at` FROM `codes`;--> statement-breakpoint
DROP TABLE `codes`;--> statement-breakpoint
CREATE TABLE `codes` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`code` text NOT NULL UNIQUE,
	`user_id` text,
	`deleted_at` integer,
	CONSTRAINT `fk_codes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
INSERT INTO `codes`(`id`, `type`, `code`, `user_id`, `deleted_at`) SELECT `id`, `type`, `code`, `user_id`, `deleted_at` FROM `__copy_codes`;--> statement-breakpoint
DROP TABLE `__copy_codes`;--> statement-breakpoint
CREATE UNIQUE INDEX `codes_user_id_unique` ON `codes` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `codes_current_enrollment_unique` ON `codes` (`type`) WHERE "codes"."type" = 'enrollment' and "codes"."deleted_at" is null;--> statement-breakpoint
CREATE TABLE `__copy_sessions` AS SELECT `id`, `position`, `title`, `summary`, `enabled`, `current_slide`, `current_step`, `deleted_at` FROM `sessions`;--> statement-breakpoint
DROP TABLE `sessions`;--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`position` integer NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`enabled` integer DEFAULT false NOT NULL,
	`current_slide` integer DEFAULT 1 NOT NULL,
	`current_step` integer DEFAULT 1 NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
INSERT INTO `sessions`(`id`, `position`, `title`, `summary`, `enabled`, `current_slide`, `current_step`, `deleted_at`) SELECT `id`, `position`, `title`, `summary`, `enabled`, `current_slide`, `current_step`, `deleted_at` FROM `__copy_sessions`;--> statement-breakpoint
DROP TABLE `__copy_sessions`;--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_position_unique` ON `sessions` (`position`) WHERE "sessions"."deleted_at" is null;--> statement-breakpoint
CREATE TABLE `__copy_materials` AS SELECT `id`, `session_id`, `name`, `is_slides`, `size`, `content_type` FROM `materials`;--> statement-breakpoint
DROP TABLE `materials`;--> statement-breakpoint
CREATE TABLE `materials` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`name` text NOT NULL,
	`is_slides` integer NOT NULL,
	`size` integer NOT NULL,
	`content_type` text NOT NULL,
	CONSTRAINT `fk_materials_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`)
);
--> statement-breakpoint
INSERT INTO `materials`(`id`, `session_id`, `name`, `is_slides`, `size`, `content_type`) SELECT `id`, `session_id`, `name`, `is_slides`, `size`, `content_type` FROM `__copy_materials`;--> statement-breakpoint
DROP TABLE `__copy_materials`;--> statement-breakpoint
CREATE INDEX `materials_session_id_index` ON `materials` (`session_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `materials_slides_unique` ON `materials` (`session_id`) WHERE "materials"."is_slides" = 1;--> statement-breakpoint
CREATE TABLE `__copy_polls` AS SELECT `id`, `session_id`, `type`, `status`, `prompt`, `options`, `scale_min_label`, `scale_max_label`, `deleted_at` FROM `polls`;--> statement-breakpoint
DROP TABLE `polls`;--> statement-breakpoint
CREATE TABLE `polls` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`type` text NOT NULL,
	`status` text NOT NULL,
	`prompt` text NOT NULL,
	`options` text,
	`scale_min_label` text,
	`scale_max_label` text,
	`deleted_at` integer,
	CONSTRAINT `fk_polls_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`)
);
--> statement-breakpoint
INSERT INTO `polls`(`id`, `session_id`, `type`, `status`, `prompt`, `options`, `scale_min_label`, `scale_max_label`, `deleted_at`) SELECT `id`, `session_id`, `type`, `status`, `prompt`, `options`, `scale_min_label`, `scale_max_label`, `deleted_at` FROM `__copy_polls`;--> statement-breakpoint
DROP TABLE `__copy_polls`;--> statement-breakpoint
CREATE INDEX `polls_session_id_index` ON `polls` (`session_id`);--> statement-breakpoint
CREATE TABLE `__copy_questions` AS SELECT `id`, `session_id`, `author_id`, `body`, `answered` FROM `questions`;--> statement-breakpoint
DROP TABLE `questions`;--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`author_id` text NOT NULL,
	`body` text NOT NULL,
	`answered` integer DEFAULT false NOT NULL,
	CONSTRAINT `fk_questions_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`),
	CONSTRAINT `fk_questions_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
INSERT INTO `questions`(`id`, `session_id`, `author_id`, `body`, `answered`) SELECT `id`, `session_id`, `author_id`, `body`, `answered` FROM `__copy_questions`;--> statement-breakpoint
DROP TABLE `__copy_questions`;--> statement-breakpoint
CREATE INDEX `questions_session_id_index` ON `questions` (`session_id`);--> statement-breakpoint
CREATE TABLE `__new_question_votes` (
	`id` text PRIMARY KEY NOT NULL,
	`question_id` text NOT NULL,
	`user_id` text NOT NULL,
	CONSTRAINT `fk_question_votes_question_id_questions_id_fk` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`),
	CONSTRAINT `fk_question_votes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
WITH RECURSIVE `digits`(`n`) AS (SELECT 1 UNION ALL SELECT `n` + 1 FROM `digits` WHERE `n` < 26) INSERT INTO `__new_question_votes`(`id`, `question_id`, `user_id`) SELECT (SELECT group_concat(substr('0123456789ABCDEFGHJKMNPQRSTVWXYZ', (random() & 31) + 1, 1), '') FROM `digits` WHERE `question_votes`.`user_id` IS NOT NULL), `question_id`, `user_id` FROM `question_votes`;--> statement-breakpoint
DROP TABLE `question_votes`;--> statement-breakpoint
ALTER TABLE `__new_question_votes` RENAME TO `question_votes`;--> statement-breakpoint
CREATE UNIQUE INDEX `question_votes_question_id_user_id_unique` ON `question_votes` (`question_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `__new_raised_hands` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`user_id` text NOT NULL,
	CONSTRAINT `fk_raised_hands_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`),
	CONSTRAINT `fk_raised_hands_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
WITH RECURSIVE `digits`(`n`) AS (SELECT 1 UNION ALL SELECT `n` + 1 FROM `digits` WHERE `n` < 26) INSERT INTO `__new_raised_hands`(`id`, `session_id`, `user_id`) SELECT (SELECT group_concat(substr('0123456789ABCDEFGHJKMNPQRSTVWXYZ', (random() & 31) + 1, 1), '') FROM `digits` WHERE `raised_hands`.`user_id` IS NOT NULL), `session_id`, `user_id` FROM `raised_hands`;--> statement-breakpoint
DROP TABLE `raised_hands`;--> statement-breakpoint
ALTER TABLE `__new_raised_hands` RENAME TO `raised_hands`;--> statement-breakpoint
CREATE UNIQUE INDEX `raised_hands_session_id_user_id_unique` ON `raised_hands` (`session_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `__new_responses` (
	`id` text PRIMARY KEY NOT NULL,
	`poll_id` text NOT NULL,
	`user_id` text NOT NULL,
	`value` text NOT NULL,
	CONSTRAINT `fk_responses_poll_id_polls_id_fk` FOREIGN KEY (`poll_id`) REFERENCES `polls`(`id`),
	CONSTRAINT `fk_responses_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
WITH RECURSIVE `digits`(`n`) AS (SELECT 1 UNION ALL SELECT `n` + 1 FROM `digits` WHERE `n` < 26) INSERT INTO `__new_responses`(`id`, `poll_id`, `user_id`, `value`) SELECT (SELECT group_concat(substr('0123456789ABCDEFGHJKMNPQRSTVWXYZ', (random() & 31) + 1, 1), '') FROM `digits` WHERE `responses`.`user_id` IS NOT NULL), `poll_id`, `user_id`, `value` FROM `responses`;--> statement-breakpoint
DROP TABLE `responses`;--> statement-breakpoint
ALTER TABLE `__new_responses` RENAME TO `responses`;--> statement-breakpoint
CREATE UNIQUE INDEX `responses_poll_id_user_id_unique` ON `responses` (`poll_id`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `changelog_entries_type_entity_id_unique` ON `changelog_entries` (`type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `changelog_entries_session_id_index` ON `changelog_entries` (`session_id`);