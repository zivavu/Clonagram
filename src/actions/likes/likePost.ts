'use server';
import 'server-only';
import type { PostComment } from '@/src/queries/comments';
import { getAuthUser } from '../getAuthUser';

export async function likePostAction(params: { postId: string }): Promise<PostComment> {
   const { supabase, user } = await getAuthUser();

   const { data, error } = await supabase
      .from('likes')
      .insert({ post_id: params.postId, user_id: user.id })
      .single();

   if (error || !data) throw new Error(`Failed to like post: ${error?.message ?? 'unknown error'}`);
   return data;
}
