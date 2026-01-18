# Environment Variables Setup Guide

## Required Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Service Role Key (Recommended for scripts)
# This bypasses Row Level Security (RLS) policies
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# RapidAPI Configuration (Required for fetching jobs)
RAPIDAPI_KEY=your-rapidapi-key-here
RAPIDAPI_HOST=jsearch.p.rapidapi.com
```

## Alternative Variable Names

The script also supports these alternative names (useful if you're using different naming conventions):

```env
# Alternative Supabase variable names
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## How to Get Your Keys

### Supabase Keys

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### RapidAPI Key

1. Sign up at [rapidapi.com](https://rapidapi.com)
2. Subscribe to [JSearch API](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
3. Copy your API key from the dashboard → `RAPIDAPI_KEY`

## Security Notes

⚠️ **Important:**
- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Service role key has full database access - keep it secret!
- Use service role key only in server-side scripts, never in client-side code

## Testing Your Configuration

After setting up your `.env` file, test the connection:

```bash
npm run fetch-jobs
```

The script will:
1. Load environment variables
2. Test Supabase connection
3. Fetch jobs from JSearch API
4. Save jobs to your Supabase database

If you see connection errors, double-check:
- Your Supabase URL is correct
- Your keys are correct (no extra spaces)
- The `jobs` table exists in your database
- You've run the migration SQL script
