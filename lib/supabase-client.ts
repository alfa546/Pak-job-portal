/**
 * Supabase client configuration for Node.js scripts
 * This file loads environment variables and creates a Supabase client
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Missing Supabase URL. Please set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL in your .env file'
  );
}

if (!supabaseAnonKey && !supabaseServiceKey) {
  throw new Error(
    'Missing Supabase key. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_ANON_KEY) or SUPABASE_SERVICE_ROLE_KEY in your .env file'
  );
}

// Create admin client with service role key if available (bypasses RLS)
// Otherwise use anon key
const supabaseKey = supabaseServiceKey || supabaseAnonKey!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Log connection status
console.log('✓ Supabase client initialized');
console.log(`  URL: ${supabaseUrl}`);
console.log(`  Using: ${supabaseServiceKey ? 'Service Role Key' : 'Anon Key'}`);
