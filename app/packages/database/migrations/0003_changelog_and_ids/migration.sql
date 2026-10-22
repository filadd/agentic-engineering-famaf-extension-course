CREATE TABLE `changelog_entries` (
	`id` text PRIMARY KEY,
	`session_id` text NOT NULL,
	`type` text NOT NULL,
	`entity_id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsec') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_changelog_entries_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`)
);
--> statement-breakpoint
ALTER TABLE `question_votes` ADD `id` text;--> statement-breakpoint
ALTER TABLE `raised_hands` ADD `id` text;--> statement-breakpoint
ALTER TABLE `responses` ADD `id` text;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
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
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
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
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
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
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `question_votes_question_id_user_id_unique` ON `question_votes` (`question_id`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `raised_hands_session_id_user_id_unique` ON `raised_hands` (`session_id`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `responses_poll_id_user_id_unique` ON `responses` (`poll_id`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `changelog_entries_type_entity_id_unique` ON `changelog_entries` (`type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `changelog_entries_session_id_index` ON `changelog_entries` (`session_id`);