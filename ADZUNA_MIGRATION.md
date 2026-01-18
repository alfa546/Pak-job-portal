# Migration to Adzuna API - Complete Guide

## ✅ What's Been Updated

The job fetching script has been migrated from JSearch API (via RapidAPI) to Adzuna API.

### Changes Made:

1. **Script Updated** (`scripts/fetch-jobs.ts`)
   - Now uses Adzuna API instead of JSearch
   - Searches for keywords: Medical, Teaching, Accounting, Sales, Driver, Construction, Engineering, Nursing
   - Fetches jobs for Pakistan (country code 'pk')
   - Uses **upsert** instead of insert to prevent duplicates
   - Adds **category** field to each job based on the keyword

2. **API Route Updated** (`app/api/fetch-jobs/route.ts`)
   - Same changes as the script
   - Returns statistics for all keywords processed

3. **Database Schema** (`supabase/migrations/002_add_category_column.sql`)
   - Adds `category` column to jobs table
   - Creates index on category for faster filtering

4. **Job Interface Updated** (`data/jobs.ts`)
   - Added `category` field to Job interface

## 🔧 Setup Instructions

### Step 1: Run Database Migration

Go to your Supabase SQL Editor and run:
```sql
-- Add category column to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS category TEXT;

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
```

Or run the migration file: `supabase/migrations/002_add_category_column.sql`

### Step 2: Get Adzuna API Credentials

1. Visit [Adzuna Developer Portal](https://developer.adzuna.com)
2. Sign up for a free account
3. Create an application
4. Copy your **App ID** and **App Key**

### Step 3: Update Environment Variables

Update your `.env.local` file:

**Remove:**
```env
RAPIDAPI_KEY=...
RAPIDAPI_HOST=...
```

**Add:**
```env
ADZUNA_APP_ID=your-app-id-here
ADZUNA_APP_KEY=your-app-key-here
```

### Step 4: Test the Script

Run the script:
```bash
npm run fetch-jobs
```

## 📊 How It Works

1. **Keyword Loop**: Iterates through 8 keywords:
   - Medical
   - Teaching
   - Accounting
   - Sales
   - Driver
   - Construction
   - Engineering
   - Nursing

2. **API Call**: For each keyword, searches Adzuna API:
   - Endpoint: `https://api.adzuna.com/v1/api/jobs/pk/search/1`
   - Country: `pk` (Pakistan)
   - Query: The keyword (e.g., "Medical")

3. **Job Processing**:
   - Validates and normalizes URLs
   - Uses **upsert** with `apply_url` as unique key
   - Adds `category` field based on keyword
   - Prevents duplicates automatically

4. **Upsert Behavior**:
   - If job with same `apply_url` exists → Updates it
   - If job doesn't exist → Inserts new one
   - No duplicate errors!

## 🎯 Key Features

- ✅ **Upsert**: Automatically handles duplicates
- ✅ **Category Tagging**: Each job is tagged with its category
- ✅ **URL Validation**: Invalid URLs are skipped
- ✅ **Rate Limiting**: 1 second delay between keywords
- ✅ **Error Handling**: Continues even if one keyword fails

## 📝 Example Output

```
📋 Fetching jobs from Adzuna API for 8 keywords...
Keywords: Medical, Teaching, Accounting, Sales, Driver, Construction, Engineering, Nursing

🔍 Searching for: "Medical" jobs in Pakistan (page 1)
  Found 25 jobs for Medical
  Processing 25 jobs...
  ✓ Saved/Updated: Doctor at Hospital ABC (Karachi) - Category: Medical
  ...

=== FINAL SUMMARY ===
Keywords processed: 8
Total jobs found: 187
✅ Saved/Updated: 165
⏭️  Skipped (invalid URLs): 22
```

## 🔍 API Differences

### JSearch API (Old)
- Required RapidAPI subscription
- Query format: "Jobs in Pakistan"
- Response: `data` array

### Adzuna API (New)
- Free account available
- Query format: Keyword + country code 'pk'
- Response: `results` array
- More structured data (company.display_name, location.display_name)

## ⚠️ Important Notes

1. **Database Migration Required**: Make sure to run the migration to add the `category` column
2. **Environment Variables**: Update `.env.local` with Adzuna credentials
3. **Upsert**: Jobs are now upserted, so running the script multiple times won't create duplicates
4. **Category Field**: All jobs now have a category field for better filtering

## 🐛 Troubleshooting

### Error: "Adzuna API credentials are not configured"
- Make sure `ADZUNA_APP_ID` and `ADZUNA_APP_KEY` are in your `.env.local`
- Restart your server after adding them

### Error: "column 'category' does not exist"
- Run the database migration: `002_add_category_column.sql`

### No jobs found
- Check if Adzuna API has jobs for Pakistan
- Verify your API credentials are correct
- Check API rate limits

## 📚 Resources

- [Adzuna API Documentation](https://developer.adzuna.com/overview)
- [Adzuna API Endpoints](https://developer.adzuna.com/docs)
