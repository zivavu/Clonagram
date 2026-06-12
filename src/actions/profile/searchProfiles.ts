'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';
import { throwIfError } from '@/src/lib/unwrap';
import type { UserProfiles } from '@/src/queries/userProfiles';

interface SearchProfilesOptions {
   search?: string;
   limit?: number;
   excludeId?: string;
}

export async function searchProfiles(options: SearchProfilesOptions): Promise<UserProfiles> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   let q = supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, is_private')
      .order('created_at', { ascending: false })
      .limit(options.limit ?? 10);

   if (options.search) {
      q = q.or(`username.ilike.%${options.search}%,full_name.ilike.%${options.search}%`);
   }

   if (options.excludeId) {
      q = q.neq('id', options.excludeId);
   } else if (user) {
      q = q.neq('id', user.id);
   }

   const { data, error } = await q;
   throwIfError({ error }, 'Failed to search profiles');
   return data ?? [];
}
