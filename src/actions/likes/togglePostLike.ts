'use server';
import 'server-only';
import { TogglePostLikeSchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function togglePostLike(params: { postId: string; isLiked: boolean }) {
   const { postId, isLiked } = validate(TogglePostLikeSchema, params);
   const { supabase, user } = await getAuthUser();

   if (isLiked) {
      const { error } = await supabase
         .from('likes')
         .delete()
         .eq('post_id', postId)
         .eq('user_id', user.id);
      if (error) throw new Error(`Failed to unlike post: ${error.message}`);
   } else {
      const { error } = await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
      if (error) throw new Error(`Failed to like post: ${error.message}`);
   }
}
