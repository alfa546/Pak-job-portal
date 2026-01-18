# Complete Setup Guide - Step by Step

## ✅ Step 1: Supabase Project Create Karein

1. Browser mein jayein: **https://app.supabase.com**
2. GitHub se login karein (aap already kar chuke hain ✅)
3. Dashboard par **"New Project"** button par click karein

### Project Details:
- **Name**: `Pakistan Job Board` (ya koi bhi naam)
- **Database Password**: Strong password set karein (save kar lein!)
- **Region**: `Southeast Asia (Singapore)` ya closest region
- **Pricing Plan**: **Free** select karein

4. **"Create new project"** par click karein
5. 2-3 minutes wait karein (project setup ho raha hai)

---

## ✅ Step 2: API Credentials Copy Karein

Project setup complete hone ke baad:

1. Left sidebar se **"Settings"** (⚙️ icon) par click karein
2. **"API"** tab par click karein
3. Yahan se 2 cheezein copy karein:

   **a) Project URL:**
   ```
   https://xxxxx.supabase.co
   ```
   (Yeh `NEXT_PUBLIC_SUPABASE_URL` hai)

   **b) anon public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   (Yeh `NEXT_PUBLIC_SUPABASE_ANON_KEY` hai)

---

## ✅ Step 3: Database Table Create Karein

1. Left sidebar se **"SQL Editor"** par click karein
2. **"New query"** button par click karein
3. `SUPABASE_SETUP_COMPLETE.sql` file open karein
4. **Saara code copy karein** aur SQL Editor mein paste karein
5. **"Run"** button par click karein (ya Ctrl+Enter press karein)
6. **"Success"** message aayega ✅

---

## ✅ Step 4: .env.local File Create Karein

Project root directory mein (`C:\Users\hp\OneDrive\Desktop\Pet store`):

1. **New file** create karein
2. **File name**: `.env.local` (exactly yeh naam)
3. File mein yeh add karein:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** Apne actual credentials se replace karein jo aapne Step 2 mein copy kiye the.

---

## ✅ Step 5: Server Restart Karein

Terminal mein:
1. Server stop karein (Ctrl+C)
2. Phir start karein:
```bash
npm run dev
```

---

## ✅ Step 6: Test Karein

Browser mein jayein: **http://localhost:3000**

Agar sab theek hai to:
- ✅ Jobs load honge Supabase se
- ✅ Search bar kaam karega
- ✅ Koi error nahi aayega

---

## 🎯 Quick Checklist

- [ ] Supabase project create kar liya
- [ ] API credentials copy kar liye
- [ ] Database table create kar di (SQL run kar di)
- [ ] `.env.local` file create kar di with credentials
- [ ] Server restart kar diya
- [ ] Website test kar liya

---

## ❌ Agar Error Aaye

### Error: "Missing Supabase environment variables"
- `.env.local` file check karein
- Credentials sahi hain ya nahi
- Server restart kiya ya nahi

### Error: "relation jobs does not exist"
- SQL Editor mein `SUPABASE_SETUP_COMPLETE.sql` run karein
- Success message check karein

### Error: "permission denied"
- RLS policy check karein
- SQL Editor mein policy create kar di hai ya nahi

---

## 📞 Help Chahiye?

Agar koi step unclear hai ya error aaye, mujhe batayein!
