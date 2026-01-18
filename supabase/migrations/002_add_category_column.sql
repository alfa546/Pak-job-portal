-- Add category column to jobs table
-- Run this migration in your Supabase SQL editor

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS category TEXT;

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);

-- Update the unique constraint to use apply_url for upsert operations
-- (apply_url already has UNIQUE constraint, which is perfect for upsert)
