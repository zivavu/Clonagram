'use server';
import 'server-only';
import { throwIfError } from '@/src/lib/unwrap';
import { savedPostsQuery } from '@/src/queries/posts';
import { getOptionalUser } from '../getAuthUser';

export async function getSavedPosts() {
   const { supabase, user } = await getOptionalUser();

   if (!user) return [];

   const { data, error } = await savedPostsQuery(supabase, user.id);
   throwIfError({ error }, 'Failed to get saved posts');

   return (data ?? []).map(item => item.post);
}
