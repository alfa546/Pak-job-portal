# Quick Start Guide - Connect Script to Supabase

## Step 1: Create Your `.env` File

Copy the template file:
```bash
cp env.template .env
```

Or create `.env` manually with these variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
RAPIDAPI_KEY=your-rapidapi-key-here
RAPIDAPI_HOST=jsearch.p.rapidapi.com
```

## Step 2: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep this secret!

## Step 3: Create the Database Table

1. In Supabase, go to **SQL Editor**
2. Run the migration script from `supabase/migrations/001_create_jobs_table.sql`
3. This creates the `jobs` table with proper structure and indexes

## Step 4: Test the Connection

Run the script:
```bash
npm run fetch-jobs
```

The script will:
- ✅ Load environment variables from `.env`
- ✅ Connect to Supabase using `@supabase/supabase-js`
- ✅ Test the connection
- ✅ Fetch jobs from JSearch API
- ✅ Save jobs to your Supabase database

## Troubleshooting

### Error: "Missing Supabase URL"
- Make sure your `.env` file exists in the project root
- Check that `NEXT_PUBLIC_SUPABASE_URL` is set correctly

### Error: "Failed to connect to Supabase"
- Verify your Supabase URL and keys are correct
- Make sure the `jobs` table exists (run the migration SQL)
- If using RLS, ensure you have `SUPABASE_SERVICE_ROLE_KEY` set

### Error: "Permission denied"
- Use the **service_role** key (not anon key) for inserts
- Or adjust your RLS policies in Supabase

## How It Works

The script uses:
- **`@supabase/supabase-js`** library for database operations
- **`dotenv`** package to load environment variables
- **`lib/supabase-client.ts`** - Creates the Supabase client with your credentials
- **`scripts/fetch-jobs.ts`** - Main script that fetches and saves jobs

The Supabase client automatically:
- Loads environment variables
- Creates a connection using your URL and key
- Uses service role key if available (bypasses RLS)
- Falls back to anon key if service role key is not set
