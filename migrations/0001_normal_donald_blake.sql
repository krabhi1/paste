ALTER TABLE `pastes` ADD `syntax` text DEFAULT 'plaintext' NOT NULL;--> statement-breakpoint
ALTER TABLE `pastes` ADD `expiry` text DEFAULT 'never' NOT NULL;