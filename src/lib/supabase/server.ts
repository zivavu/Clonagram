import { createServerClient as createServerClientSupabase } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/src/types/database';

export async function createServerClient() {
   const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
   const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
   if (!url || !key) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
   }

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
            } catch {
               // setAll called from a Server Component — session refresh
               // is handled by the middleware instead, safe to ignore here.
            }
         },
      },
   });
}
