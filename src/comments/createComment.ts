'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import type { PostComment } from '@/src/queries/comments';
import { getAuthUser } from '../actions/getAuthUser';

export async function createCommentAction(params: {
   postId: string;
   content: string;
   parentId?: string;
}): Promise<PostComment> {
   const { supabase, user } = await getAuthUser();

   const { data, error } = await supabase
      .from('comments')
      .insert({
         post_id: params.postId,
         user_id: user.id,
         content: params.content,
         parent_id: params.parentId ?? null,
      })
      .select(
         'id, content, created_at, like_count, reply_count, parent_id, user:profiles!user_id(id, username, avatar_url), comment_likes(user_id)',
      )
      .single();

   if (error || !data)
      throw new Error(`Failed to post comment: ${error?.message ?? 'unknown error'}`);
   revalidatePath('/');
   return data;
}
