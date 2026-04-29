import type { Database } from '@/src/types/database';
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
   const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
   const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
   if (!url || !key) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
   }
   return createBrowserClient<Database>(url, key);
}
