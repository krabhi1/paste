ALTER TABLE `pastes` ALTER COLUMN "created_at" TO "created_at" integer NOT NULL DEFAULT (unixepoch()*1000);
