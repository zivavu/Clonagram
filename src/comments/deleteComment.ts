'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { getAuthUser } from '../actions/getAuthUser';

export async function deleteCommentAction(params: { commentId: string }) {
   const { supabase, user } = await getAuthUser();

   const { data: comment } = await supabase
      .from('comments')
      .select('user_id, post:posts!post_id(user_id)')
      .eq('id', params.commentId)
      .single();

   if (!comment) throw new Error('Comment not found');

   const post = Array.isArray(comment.post) ? comment.post[0] : comment.post;

   if (comment.user_id !== user.id && post?.user_id !== user.id) {
      throw new Error('Not authorized');
   }

   const { error } = await supabase.from('comments').delete().eq('id', params.commentId);

   if (error) throw new Error(`Failed to delete comment: ${error.message}`);

   revalidatePath('/');
}
