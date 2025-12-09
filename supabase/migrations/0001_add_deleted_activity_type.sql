-- Migration: Add 'deleted' to activity_type enum
-- Date: 2024-12-08
-- Description: Adds 'deleted' activity type for logging deletion events

-- Add 'deleted' to the activity_type enum
ALTER TYPE activity_type ADD VALUE IF NOT EXISTS 'deleted';

-- Add comment
COMMENT ON TYPE activity_type IS 'Types of activities that can be logged: created, updated, deleted, status_changed, comment_added, file_uploaded, email_sent, payment_received, assigned, approved, rejected';
