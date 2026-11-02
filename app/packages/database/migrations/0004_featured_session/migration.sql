ALTER TABLE `sessions` ADD `featured` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `sessions` ADD `featured_questions` integer DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_featured_unique` ON `sessions` (`featured`) WHERE "sessions"."featured" = 1 and "sessions"."deleted_at" is null;