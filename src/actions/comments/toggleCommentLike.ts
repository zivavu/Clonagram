'use server';
import 'server-only';
import { LikeCommentSchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function toggleCommentLikeAction(params: {
   commentId: string;
   isLiked: boolean;
}): Promise<void> {
   const { commentId } = validate(LikeCommentSchema, { commentId: params.commentId });
   const { supabase, user } = await getAuthUser();

   if (params.isLiked) {
      const { error } = await supabase
         .from('comment_likes')
         .delete()
         .eq('comment_id', commentId)
         .eq('user_id', user.id);
      if (error) throw new Error(`Failed to unlike comment: ${error.message}`);
   } else {
      const { error } = await supabase
         .from('comment_likes')
         .insert({ comment_id: commentId, user_id: user.id });
      if (error) throw new Error(`Failed to like comment: ${error.message}`);
   }
}
