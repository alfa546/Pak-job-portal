# GitHub Actions Workflow Setup

## Workflow: `fetch-jobs.yml`

This workflow automatically runs the job fetching script every day at 9 AM PKT (Pakistan Time).

## Setup Instructions

### 1. Add Secrets to GitHub Repository

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add the following secrets:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (recommended) | `eyJhbGc...` |
| `RAPIDAPI_KEY` | Your RapidAPI key for JSearch API | `xxxxx` |
| `RAPIDAPI_HOST` | (Optional) RapidAPI host | `jsearch.p.rapidapi.com` |

### 2. How to Get Your Secrets

#### Supabase Secrets
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep secret!

#### RapidAPI Secrets
1. Go to [RapidAPI Dashboard](https://rapidapi.com)
2. Navigate to your JSearch API subscription
3. Copy your API key → `RAPIDAPI_KEY`

### 3. Schedule

The workflow runs:
- **Automatically**: Every day at 9:00 AM PKT (4:00 AM UTC)
- **Manually**: Via GitHub Actions UI (click "Run workflow")

To change the schedule, edit the cron expression in `.github/workflows/fetch-jobs.yml`:
```yaml
- cron: '0 4 * * *'  # 4 AM UTC = 9 AM PKT
```

Cron format: `minute hour day month day-of-week`
- `0 4 * * *` = Every day at 4:00 AM UTC

### 4. Testing the Workflow

1. **Manual Trigger**: Go to **Actions** tab → Select "Fetch Jobs Daily" → Click "Run workflow"
2. **Check Logs**: Click on the workflow run to see detailed logs
3. **Verify Results**: Check your Supabase database to confirm jobs were saved

## Workflow Steps

1. ✅ Checkout code
2. ✅ Setup Node.js 20
3. ✅ Install dependencies (`npm ci`)
4. ✅ Run fetch-jobs script with secrets as environment variables
5. ✅ Notify on failure

## Troubleshooting

### Workflow fails with "Missing Supabase URL"
- Make sure all required secrets are added to GitHub repository
- Check that secret names match exactly (case-sensitive)

### Workflow fails with "Permission denied"
- Use `SUPABASE_SERVICE_ROLE_KEY` instead of anon key
- Check RLS policies in Supabase

### Script runs but no jobs saved
- Check workflow logs for errors
- Verify Supabase connection in logs
- Ensure `jobs` table exists in database

## Timezone Reference

- **PKT (Pakistan Time)**: UTC+5
- **9 AM PKT** = **4 AM UTC**

To change timezone, adjust the UTC time in the cron expression:
- 9 AM PKT = 4 AM UTC
- 10 AM PKT = 5 AM UTC
- 8 AM PKT = 3 AM UTC
