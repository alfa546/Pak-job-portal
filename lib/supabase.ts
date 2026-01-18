import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  const errorMessage = `
❌ Missing Supabase Environment Variables

Missing: ${missingVars.join(', ')}

To fix this:
1. Create a file named '.env.local' in your project root
2. Add the following variables:

   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

3. Get your credentials from: https://app.supabase.com
   → Select your project → Settings → API

4. Restart your Next.js development server after adding the file

Note: Make sure the file is named '.env.local' (not just '.env')
  `.trim();

  // In development, show helpful error
  if (process.env.NODE_ENV === 'development') {
    console.error(errorMessage);
  }

  throw new Error(errorMessage);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
