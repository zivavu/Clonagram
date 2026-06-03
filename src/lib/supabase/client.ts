import { createBrowserClient as createBrowserClientSupabase } from '@supabase/ssr';
import type { Database } from '@/src/types/database';
import { getSupabaseEnv } from './env';

export function createBrowserClient() {
   const { url, key } = getSupabaseEnv();
   return createBrowserClientSupabase<Database>(url, key);
}
