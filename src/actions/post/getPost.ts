'use server';
import 'server-only';
import { getHideAiContent } from '@/src/lib/getHideAiContent';
import { PostIdSchema, validate } from '@/src/lib/validation';
import { throwIfError } from '../../lib/unwrap';
import { POST_WITH_MEDIA_SELECT } from '../../queries/posts';
import { hideLikesForNonOwners } from '../../utils/posts';
import { getOptionalUser } from '../getAuthUser';

export async function getPost(params: { postId: string }) {
   const { postId } = validate(PostIdSchema, params);
   const { supabase, user } = await getOptionalUser();
   const hideAi = user ? await getHideAiContent(supabase) : false;

   let query = supabase
      .from('posts')
      .select(POST_WITH_MEDIA_SELECT)
      .eq('id', postId)
      .eq('likes.user_id', user?.id ?? '00000000-0000-0000-0000-000000000000')
      .eq('saves.user_id', user?.id ?? '00000000-0000-0000-0000-000000000000')
      .eq('reposts.user_id', user?.id ?? '00000000-0000-0000-0000-000000000000');

   if (hideAi) query = query.eq('is_ai', false);

   const { data: postData, error } = await query.single();

   throwIfError({ error }, 'Failed to get post');
   if (!postData) throw new Error('Failed to get post: no data returned');
   return hideLikesForNonOwners([postData], user?.id)[0];
}
