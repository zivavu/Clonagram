import type { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';
import type { Database } from '@/src/types/database';
import { createServerClient } from './server';

export const getAuthProfile = cache(async (supabase?: SupabaseClient<Database>) => {
   const client = supabase ?? (await createServerClient());
   const {
      data: { user },
   } = await client.auth.getUser();
   if (!user) return null;
   const { data: profile } = await client
      .from('profiles')
      .select('id, username, full_name, avatar_url, bio, website, gender')
      .eq('id', user.id)
      .single();
   return profile;
});

export type Profile = Awaited<ReturnType<typeof getAuthProfile>>;
