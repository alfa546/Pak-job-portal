# GitHub Actions Setup Guide

## Quick Setup

### 1. Add Secrets to Your Repository

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

#### Required Secrets:

- **`SUPABASE_URL`** - Your Supabase project URL
  - Example: `https://xxxxx.supabase.co`
  - Get from: Supabase Dashboard → Settings → API → Project URL

- **`SUPABASE_ANON_KEY`** - Supabase anonymous/public key
  - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - Get from: Supabase Dashboard → Settings → API → anon public

- **`SUPABASE_SERVICE_ROLE_KEY`** - Supabase service role key (recommended)
  - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - Get from: Supabase Dashboard → Settings → API → service_role
  - ⚠️ **Keep this secret!** This bypasses Row Level Security

- **`RAPIDAPI_KEY`** - Your RapidAPI key
  - Example: `abc123def456...`
  - Get from: RapidAPI Dashboard → Your API subscriptions

#### Optional Secrets:

- **`RAPIDAPI_HOST`** - RapidAPI host (defaults to `jsearch.p.rapidapi.com`)
  - Only add if you need a different host

### 2. Verify Workflow File

The workflow file is located at: `.github/workflows/fetch-jobs.yml`

It will:
- ✅ Run automatically every day at 9 AM PKT (4 AM UTC)
- ✅ Install dependencies using `npm ci`
- ✅ Run your script at `scripts/fetch-jobs.ts`
- ✅ Use secrets as environment variables

### 3. Test the Workflow

#### Manual Test:
1. Go to **Actions** tab in your GitHub repository
2. Select **"Fetch Jobs Daily"** workflow
3. Click **"Run workflow"** → **"Run workflow"** button
4. Watch the workflow execute and check logs

#### Automatic Schedule:
- The workflow runs automatically at 9 AM PKT daily
- Check the **Actions** tab to see past runs

## Workflow Details

### Schedule
- **Time**: 9:00 AM PKT (Pakistan Time)
- **UTC**: 4:00 AM UTC
- **Cron**: `0 4 * * *` (every day at 4 AM UTC)

### Steps
1. **Checkout** - Gets your code
2. **Setup Node.js** - Installs Node.js 20 with npm cache
3. **Install dependencies** - Runs `npm ci` (clean install)
4. **Run script** - Executes `npm run fetch-jobs` with secrets
5. **Error handling** - Notifies on failure

### Environment Variables

The workflow passes these as environment variables to your script:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAPIDAPI_KEY`
- `RAPIDAPI_HOST` (optional, defaults to `jsearch.p.rapidapi.com`)

## Troubleshooting

### ❌ "Missing Supabase URL" error
- **Solution**: Make sure `SUPABASE_URL` secret is added correctly
- Check secret name is exactly `SUPABASE_URL` (case-sensitive)

### ❌ "Permission denied" error
- **Solution**: Use `SUPABASE_SERVICE_ROLE_KEY` instead of anon key
- Service role key bypasses RLS policies

### ❌ Workflow not running on schedule
- **Solution**: 
  - GitHub Actions schedules may be delayed by a few minutes
  - Free accounts have limited concurrent workflows
  - Check Actions tab for any queued runs

### ❌ Script fails but no error shown
- **Solution**: Check the workflow logs in Actions tab
- Look for the "Run fetch-jobs script" step logs
- The script outputs detailed error messages

### ❌ "npm ci" fails
- **Solution**: Make sure `package-lock.json` is committed to repository
- Run `npm install` locally and commit the lock file

## Changing the Schedule

Edit `.github/workflows/fetch-jobs.yml` and modify the cron expression:

```yaml
- cron: '0 4 * * *'  # Current: 9 AM PKT (4 AM UTC)
```

Examples:
- `0 5 * * *` - 10 AM PKT (5 AM UTC)
- `0 3 * * *` - 8 AM PKT (3 AM UTC)
- `0 4 * * 1` - Every Monday at 9 AM PKT
- `0 4 * * 1-5` - Weekdays only at 9 AM PKT

Cron format: `minute hour day-of-month month day-of-week`

## Security Notes

✅ **Best Practices:**
- Never commit secrets to your repository
- Use GitHub Secrets for all sensitive data
- Service role key should only be in secrets, never in code
- Regularly rotate your API keys

✅ **Secrets are:**
- Encrypted at rest
- Only visible to repository admins
- Not exposed in logs (GitHub automatically masks them)
- Available only to workflows in your repository

## Monitoring

### Check Workflow Status
1. Go to **Actions** tab
2. See all workflow runs with status (✅ success / ❌ failure)
3. Click any run to see detailed logs

### Get Notifications
- GitHub will email you on workflow failures (if enabled)
- Configure notifications in repository Settings → Notifications

## Next Steps

1. ✅ Add all required secrets
2. ✅ Test workflow manually
3. ✅ Verify jobs are being saved to Supabase
4. ✅ Monitor the Actions tab for scheduled runs

Your workflow is now set up to automatically fetch jobs every day at 9 AM PKT! 🎉
