# Job Board Setup Guide

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **RapidAPI Account**: Sign up at [rapidapi.com](https://rapidapi.com) and subscribe to JSearch API

## Setup Instructions

### 1. Supabase Setup

1. Create a new project in Supabase
2. Go to SQL Editor and run the migration file: `supabase/migrations/001_create_jobs_table.sql`
3. Go to Settings > API and copy:
   - Project URL
   - Anon (public) key

### 2. Adzuna API Setup

1. Go to [Adzuna Developer Portal](https://developer.adzuna.com)
2. Sign up for a free account
3. Create an application to get your API credentials
4. Copy your App ID and App Key from the dashboard

### 3. Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your credentials in `.env`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ADZUNA_APP_ID=your_adzuna_app_id
   ADZUNA_APP_KEY=your_adzuna_app_key
   ```
   
   **Optional (Recommended for production):** Add service role key to bypass RLS:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```
   Note: Get this from Supabase Settings > API > service_role key (keep it secret!)

### 4. Install Dependencies

```bash
npm install
```

## Usage

### Option 1: Run the Script Directly

```bash
npm run fetch-jobs
```

Or using tsx directly:
```bash
npx tsx scripts/fetch-jobs.ts
```

### Option 2: Use the API Route

Start your Next.js development server:
```bash
npm run dev
```

Then call the API endpoint:
```bash
curl http://localhost:3000/api/fetch-jobs
```

Or visit in browser: `http://localhost:3000/api/fetch-jobs`

## How It Works

1. The script/API fetches jobs from Adzuna API for Pakistan (country code 'pk')
2. Searches for multiple keywords: Medical, Teaching, Accounting, Sales, Driver, Construction, Engineering, Nursing
3. For each job found:
   - Validates and normalizes the apply URL
   - Uses upsert to save/update the job with:
     - Title
     - Company name
     - Location
     - Apply URL (used as unique identifier)
     - Category (based on the keyword searched)
   - Upsert prevents duplicates automatically

## Database Schema

The `jobs` table has the following structure:
- `id` (UUID, Primary Key)
- `title` (TEXT) - Job title
- `company` (TEXT) - Company name
- `location` (TEXT) - Job location
- `apply_url` (TEXT, UNIQUE) - Application URL (used for duplicate detection and upsert)
- `job_id` (TEXT) - Original job ID from Adzuna
- `category` (TEXT) - Job category/keyword (Medical, Teaching, etc.)
- `employment_type` (TEXT) - Employment type (optional)
- `description` (TEXT) - Job description (optional)
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Update timestamp

## Notes

- The `apply_url` field has a UNIQUE constraint and is used for upsert operations
- Upsert automatically handles duplicates - existing jobs are updated, new ones are inserted
- The script searches for 8 different job categories in Pakistan
- You can schedule this script to run periodically using cron jobs or a scheduler service
- Make sure to run the migration `002_add_category_column.sql` to add the category column