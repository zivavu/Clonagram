import { createBrowserClient as createBrowserClientSupabase } from '@supabase/ssr';
import type { Database } from '@/src/types/database';

export function createBrowserClient() {
   const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
   const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
   if (!url || !key) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
   }
   return createBrowserClientSupabase<Database>(url, key);
}
