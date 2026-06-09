'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';
import { savedPostsQuery } from '@/src/queries/posts';

export async function getSavedPosts() {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   if (!user) return [];

   const { data, error } = await savedPostsQuery(supabase, user.id);
   if (error) throw new Error(`Failed to get saved posts: ${error.message}`);

   return (data ?? []).map(item => item.post);
}
