'use server';
import 'server-only';
import { throwIfError } from '@/src/lib/unwrap';
import { LikeCommentSchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function toggleCommentLike(params: {
   commentId: string;
   isLiked: boolean;
}): Promise<void> {
   const { commentId, isLiked } = validate(LikeCommentSchema, params);
   const { supabase, user } = await getAuthUser();

   if (isLiked) {
      const { error } = await supabase
         .from('comment_likes')
         .delete()
         .eq('comment_id', commentId)
         .eq('user_id', user.id);
      throwIfError({ error }, 'Failed to unlike comment');
   } else {
      const { error } = await supabase
         .from('comment_likes')
         .insert({ comment_id: commentId, user_id: user.id });
      throwIfError({ error }, 'Failed to like comment');
   }
}
