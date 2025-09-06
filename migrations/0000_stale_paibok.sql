CREATE TABLE `pastes` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	`title` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
