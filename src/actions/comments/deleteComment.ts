'use server';
import 'server-only';
import { throwIfError } from '@/src/lib/unwrap';
import { DeleteCommentSchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function deleteComment(params: { commentId: string }) {
   const { commentId } = validate(DeleteCommentSchema, params);
   const { supabase, user } = await getAuthUser();

   const { data: comment } = await supabase
      .from('comments')
      .select('user_id, post:posts!post_id(user_id)')
      .eq('id', commentId)
      .single();

   if (!comment) throw new Error('Comment not found');

   const post = Array.isArray(comment.post) ? comment.post[0] : comment.post;

   if (comment.user_id !== user.id && post?.user_id !== user.id) {
      throw new Error('Not authorized');
   }

   const { error } = await supabase
      .from('comments')
      .update({ is_deleted: true })
      .eq('id', commentId);

   throwIfError({ error }, 'Failed to delete comment');
}
