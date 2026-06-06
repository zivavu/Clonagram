'use server';
import 'server-only';
import { getAuthUser } from '../actions/getAuthUser';

export async function toggleCommentLikeAction(params: {
   commentId: string;
   isLiked: boolean;
}): Promise<void> {
   const { supabase, user } = await getAuthUser();

   if (params.isLiked) {
      const { error } = await supabase
         .from('comment_likes')
         .delete()
         .eq('comment_id', params.commentId)
         .eq('user_id', user.id);
      if (error) throw new Error(`Failed to unlike comment: ${error.message}`);
   } else {
      const { error } = await supabase
         .from('comment_likes')
         .insert({ comment_id: params.commentId, user_id: user.id });
      if (error) throw new Error(`Failed to like comment: ${error.message}`);
   }
}
