-- Complete Supabase Setup SQL
-- Copy this entire file and run it in Supabase SQL Editor
-- This will create the jobs table with all necessary columns and indexes

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  apply_url TEXT NOT NULL UNIQUE,
  job_id TEXT,
  category TEXT,
  employment_type TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_jobs_apply_url ON jobs(apply_url);
CREATE INDEX IF NOT EXISTS idx_jobs_job_id ON jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);

-- Enable Row Level Security (RLS)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read jobs
CREATE POLICY "Allow public read access" ON jobs
  FOR SELECT
  USING (true);

-- Note: For inserts/updates, you'll need to use service_role key in your scripts
-- The anon key will only allow reads
