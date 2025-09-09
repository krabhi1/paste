-- migrations/0004_add_one_hour_to_created_at.sql

-- Add 1 hour (3600000 ms) to all rows
UPDATE pastes
SET created_at = created_at + 3600000
WHERE typeof(created_at) = 'integer';
1757394369000