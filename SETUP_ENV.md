# Environment Variables Setup - Quick Fix

## ❌ Error: "Missing Supabase environment variables"

This error means your `.env.local` file is missing or incomplete.

## ✅ Quick Fix Steps

### Step 1: Create `.env.local` file

In your project root directory (`C:\Users\hp\OneDrive\Desktop\Pet store`), create a file named `.env.local`

**Important:** The file must be named exactly `.env.local` (not `.env` or `.env.example`)

### Step 2: Add your Supabase credentials

Open `.env.local` and add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Get your Supabase credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Restart your development server

After creating/updating `.env.local`:

1. **Stop** your Next.js server (Ctrl+C)
2. **Start** it again: `npm run dev`

## Example `.env.local` file

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.example_key_here
```

## ⚠️ Important Notes

- File name must be `.env.local` (not `.env`)
- No spaces around the `=` sign
- No quotes needed around values
- Restart server after changes
- `.env.local` is already in `.gitignore` (won't be committed)

## Still having issues?

1. **Check file location**: Make sure `.env.local` is in the project root (same folder as `package.json`)
2. **Check file name**: Must be exactly `.env.local` (case-sensitive)
3. **Check values**: Make sure there are no extra spaces or quotes
4. **Restart server**: Always restart after creating/updating `.env.local`

## Need help getting Supabase credentials?

1. Visit: https://app.supabase.com
2. Sign up or log in
3. Create a new project (or select existing)
4. Wait for project to finish setting up
5. Go to Settings → API
6. Copy the URL and anon key
