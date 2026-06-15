'use server';
import 'server-only';
import { throwIfError } from '@/src/lib/unwrap';
import { UserIdSchema, validate } from '@/src/lib/validation';
import { getHideAiContent } from '@/src/lib/getHideAiContent';
import { POST_WITH_MEDIA_SELECT } from '@/src/queries/posts';
import { getOptionalUser } from '../getAuthUser';

export async function getRepostedPosts(params: { userId: string }) {
   const { userId } = validate(UserIdSchema, params);
   const { supabase, user } = await getOptionalUser();
   const hideAi = user ? await getHideAiContent(supabase) : false;

   let query = supabase
      .from('reposts')
      .select(`post:posts!post_id(${POST_WITH_MEDIA_SELECT})`)
      .eq('user_id', userId)
      .lte('post.created_at', new Date().toISOString())
      .order('created_at', { ascending: false });

   if (hideAi) query = query.eq('post.is_ai', false);

   if (user) {
      query = query
         .eq('post.likes.user_id', user.id)
         .eq('post.saves.user_id', user.id)
         .eq('post.reposts.user_id', user.id);
   }

   const { data, error } = await query;
   throwIfError({ error }, 'Failed to get reposted posts');

   return (data ?? []).map(item => item.post).filter(Boolean);
}
