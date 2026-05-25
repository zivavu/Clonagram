'use server';
import 'server-only';
import type { PostComment } from '@/src/queries/comments';
import { getAuthUser } from '../getAuthUser';

export async function createComment(params: {
   postId: string;
   content: string;
}): Promise<PostComment> {
   const { supabase, user } = await getAuthUser();

   const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: params.postId, user_id: user.id, content: params.content })
      .select(
         'id, content, created_at, like_count, parent_id, user:profiles!user_id(id, username, avatar_url)',
      )
      .single();

   if (error || !data)
      throw new Error(`Failed to post comment: ${error?.message ?? 'unknown error'}`);
   return data;
}
