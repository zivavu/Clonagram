'use server';
import 'server-only';
import { getHideAiContent } from '@/src/lib/getHideAiContent';
import { throwIfError } from '@/src/lib/unwrap';
import { UserIdSchema, validate } from '@/src/lib/validation';
import { POST_WITH_MEDIA_SELECT } from '@/src/queries/posts';
import { scopePostEngagementToUser } from '@/src/utils/posts';
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
      query = scopePostEngagementToUser(query, user.id, 'post');
   }

   const { data, error } = await query;
   throwIfError({ error }, 'Failed to get reposted posts');

   return (data ?? []).map(item => item.post).filter(Boolean);
}
