-- Create jobs table in Supabase
-- Run this migration in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  apply_url TEXT NOT NULL UNIQUE,
  job_id TEXT,
  employment_type TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index on apply_url for faster duplicate checks
CREATE INDEX IF NOT EXISTS idx_jobs_apply_url ON jobs(apply_url);

-- Create index on job_id if you want to search by it
CREATE INDEX IF NOT EXISTS idx_jobs_job_id ON jobs(job_id);

-- Create index on location for faster filtering
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);

-- Create index on company for faster filtering
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);

-- Enable Row Level Security (RLS) - adjust policies as needed
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read jobs (adjust as needed)
CREATE POLICY "Allow public read access" ON jobs
  FOR SELECT
  USING (true);

-- Create a policy that allows service role to insert/update (for API)
-- Note: This requires service role key, not anon key
-- You may need to use service role key in your server-side code for inserts
