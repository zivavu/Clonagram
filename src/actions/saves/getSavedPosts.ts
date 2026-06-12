'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';
import { throwIfError } from '@/src/lib/unwrap';
import { savedPostsQuery } from '@/src/queries/posts';

export async function getSavedPosts() {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   if (!user) return [];

   const { data, error } = await savedPostsQuery(supabase, user.id);
   throwIfError({ error }, 'Failed to get saved posts');

   return (data ?? []).map(item => item.post);
}
