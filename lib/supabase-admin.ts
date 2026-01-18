import { createClient } from '@supabase/supabase-js';

// Use this client for server-side operations that need to bypass RLS
// Requires service role key (keep this secret!)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL');
}

// Use service role key if available, otherwise fall back to anon key
// Service role key bypasses RLS policies
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Fallback to regular client if service role key is not set
import { supabase } from './supabase';
export const supabaseForInserts = supabaseAdmin || supabase;
