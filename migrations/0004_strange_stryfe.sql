CREATE TABLE `paste_tags` (
	`paste_id` text NOT NULL,
	`tag_id` integer NOT NULL,
	`created_at` integer DEFAULT (unixepoch()*1000) NOT NULL,
	PRIMARY KEY(`paste_id`, `tag_id`),
	FOREIGN KEY (`paste_id`) REFERENCES `pastes`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`normalized` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()*1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_normalized_unique` ON `tags` (`normalized`);