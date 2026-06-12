'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';
import { throwIfError } from '@/src/lib/unwrap';
import { SearchProfilesSchema, validate } from '@/src/lib/validation';
import type { UserProfiles } from '@/src/queries/userProfiles';

export async function searchProfiles(options: {
   search?: string;
   limit?: number;
   excludeId?: string;
}): Promise<UserProfiles> {
   const validated = validate(SearchProfilesSchema, options);
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   let q = supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, is_private')
      .order('created_at', { ascending: false })
      .limit(validated.limit ?? 10);

   if (validated.search) {
      q = q.or(`username.ilike.%${validated.search}%,full_name.ilike.%${validated.search}%`);
   }

   if (validated.excludeId) {
      q = q.neq('id', validated.excludeId);
   } else if (user) {
      q = q.neq('id', user.id);
   }

   const { data, error } = await q;
   throwIfError({ error }, 'Failed to search profiles');
   return data ?? [];
}
