'use server';
import 'server-only';
import { getHideAiContent } from '@/src/lib/getHideAiContent';
import { throwIfError } from '@/src/lib/unwrap';
import { SearchProfilesSchema, validate } from '@/src/lib/validation';
import { getOptionalUser } from '../getAuthUser';

export async function searchProfiles(options: {
   search?: string;
   limit?: number;
   excludeId?: string;
}) {
   const validated = validate(SearchProfilesSchema, options);
   const { supabase, user } = await getOptionalUser();
   const hideAi = user ? await getHideAiContent(supabase) : false;

   let q = supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url, is_private')
      .order('created_at', { ascending: false })
      .limit(validated.limit ?? 10);

   if (hideAi) {
      q = q.eq('is_ai', false);
   }

   if (validated.search) {
      const trimmed = validated.search.trim();
      if (trimmed) {
         q = q.or(`username.ilike.%${trimmed}%,full_name.ilike.%${trimmed}%`);
      }
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
