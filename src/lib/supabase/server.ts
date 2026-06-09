import { createServerClient as createServerClientSupabase } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/src/types/database';
import { getSupabaseEnv } from './env';

export async function createServerClient() {
   const { url, key } = getSupabaseEnv();
   const cookieStore = await cookies();

   return createServerClientSupabase<Database>(url, key, {
      cookies: {
         getAll() {
            return cookieStore.getAll();
         },
         setAll(cookiesToSet) {
            try {
               cookiesToSet.forEach(({ name, value, options }) => {
                  cookieStore.set(name, value, options);
               });
            } catch {}
         },
      },
   });
}
