# .env.local File Setup - Step by Step

## ✅ File Create Ho Gayi Hai!

`.env.local` file ab create ho chuki hai. Ab aapko sirf apne Supabase credentials add karne hain.

---

## 📝 Ab Kya Karna Hai:

### Step 1: Supabase se Credentials Copy Karein

1. Browser mein jayein: **https://app.supabase.com**
2. Apna project select karein
3. Left sidebar se **Settings** (⚙️) par click karein
4. **API** tab par click karein
5. Yahan se 2 cheezein copy karein:

   **a) Project URL:**
   ```
   https://xxxxx.supabase.co
   ```

   **b) anon public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   (Yeh ek lambi key hai, starting with `eyJ`)

---

### Step 2: .env.local File Mein Credentials Add Karein

1. VS Code ya koi bhi text editor mein `.env.local` file open karein
2. File mein yeh dikhega:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. **Replace karein:**
   - `https://your-project-id.supabase.co` ko apne actual Project URL se replace karein
   - `your-anon-key-here` ko apne actual anon public key se replace karein

### Example (After adding credentials):

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.example_key_here
```

---

### Step 3: File Save Karein

- File save karein (Ctrl+S)

---

### Step 4: Server Restart Karein

Terminal mein:
1. Server stop karein (Ctrl+C)
2. Phir start karein:
```bash
npm run dev
```

---

## ✅ Checklist

- [ ] Supabase se Project URL copy kar liya
- [ ] Supabase se anon public key copy kar liya
- [ ] `.env.local` file mein credentials add kar diye
- [ ] File save kar di
- [ ] Server restart kar diya

---

## ⚠️ Important Notes

1. **No Spaces**: `=` ke around spaces nahi hone chahiye
   - ✅ Correct: `NEXT_PUBLIC_SUPABASE_URL=https://...`
   - ❌ Wrong: `NEXT_PUBLIC_SUPABASE_URL = https://...`

2. **No Quotes**: Values ke around quotes nahi chahiye
   - ✅ Correct: `NEXT_PUBLIC_SUPABASE_URL=https://...`
   - ❌ Wrong: `NEXT_PUBLIC_SUPABASE_URL="https://..."`

3. **File Name**: File name exactly `.env.local` honi chahiye
   - ✅ Correct: `.env.local`
   - ❌ Wrong: `.env` or `env.local` or `.env.local.txt`

---

## 🎯 Ab Test Karein

Browser mein jayein: **http://localhost:3000**

Agar sab theek hai to:
- ✅ Website load hogi
- ✅ Jobs Supabase se load honge
- ✅ Koi error nahi aayega

---

## ❌ Agar Error Aaye

### "Missing Supabase environment variables"
- `.env.local` file check karein
- Credentials sahi hain ya nahi
- File name exactly `.env.local` hai ya nahi
- Server restart kiya ya nahi

### "Failed to fetch jobs"
- Supabase table create ho gayi hai ya nahi
- SQL Editor mein `SUPABASE_SETUP_COMPLETE.sql` run kiya ya nahi

---

Agar koi problem ho to mujhe batayein! 🚀
