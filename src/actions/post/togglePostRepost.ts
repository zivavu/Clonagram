'use server';
import 'server-only';
import { throwIfError } from '@/src/lib/unwrap';
import { TogglePostRepostSchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function togglePostRepost(params: { postId: string; isReposted: boolean }) {
   const { postId, isReposted } = validate(TogglePostRepostSchema, params);
   const { supabase, user } = await getAuthUser();

   if (isReposted) {
      const { error } = await supabase
         .from('reposts')
         .delete()
         .eq('post_id', postId)
         .eq('user_id', user.id);
      throwIfError({ error }, 'Failed to remove repost');
   } else {
      const { error } = await supabase
         .from('reposts')
         .insert({ post_id: postId, user_id: user.id });
      throwIfError({ error }, 'Failed to repost');
   }
}
