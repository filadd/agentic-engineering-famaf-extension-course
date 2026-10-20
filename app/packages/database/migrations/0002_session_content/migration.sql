CREATE TABLE `materials` (
	`id` text PRIMARY KEY,
	`session_id` text NOT NULL,
	`name` text NOT NULL,
	`is_slides` integer NOT NULL,
	`size` integer NOT NULL,
	`content_type` text NOT NULL,
	CONSTRAINT `fk_materials_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`)
);
--> statement-breakpoint
CREATE TABLE `polls` (
	`id` text PRIMARY KEY,
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
CREATE TABLE `question_votes` (
	`question_id` text NOT NULL,
	`user_id` text NOT NULL,
	CONSTRAINT `question_votes_pk` PRIMARY KEY(`question_id`, `user_id`),
	CONSTRAINT `fk_question_votes_question_id_questions_id_fk` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`),
	CONSTRAINT `fk_question_votes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY,
	`session_id` text NOT NULL,
	`author_id` text NOT NULL,
	`body` text NOT NULL,
	`answered` integer DEFAULT false NOT NULL,
	CONSTRAINT `fk_questions_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`),
	CONSTRAINT `fk_questions_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `raised_hands` (
	`session_id` text NOT NULL,
	`user_id` text NOT NULL,
	CONSTRAINT `raised_hands_pk` PRIMARY KEY(`session_id`, `user_id`),
	CONSTRAINT `fk_raised_hands_session_id_sessions_id_fk` FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`),
	CONSTRAINT `fk_raised_hands_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `responses` (
	`poll_id` text NOT NULL,
	`user_id` text NOT NULL,
	`value` text NOT NULL,
	CONSTRAINT `responses_pk` PRIMARY KEY(`poll_id`, `user_id`),
	CONSTRAINT `fk_responses_poll_id_polls_id_fk` FOREIGN KEY (`poll_id`) REFERENCES `polls`(`id`),
	CONSTRAINT `fk_responses_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY,
	`position` integer NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`enabled` integer DEFAULT false NOT NULL,
	`current_slide` integer DEFAULT 1 NOT NULL,
	`current_step` integer DEFAULT 1 NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
CREATE INDEX `materials_session_id_index` ON `materials` (`session_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `materials_slides_unique` ON `materials` (`session_id`) WHERE "materials"."is_slides" = 1;--> statement-breakpoint
CREATE INDEX `polls_session_id_index` ON `polls` (`session_id`);--> statement-breakpoint
CREATE INDEX `questions_session_id_index` ON `questions` (`session_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_position_unique` ON `sessions` (`position`) WHERE "sessions"."deleted_at" is null;