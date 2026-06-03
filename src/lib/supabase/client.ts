import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/src/types/database';
import { getSupabaseEnv } from './env';

const { url, key } = getSupabaseEnv();
export const supabase = createBrowserClient<Database>(url, key);
