'use server';
import 'server-only';
import { getAuthUser } from '../getAuthUser';

export async function likePostAction(params: { postId: string }): Promise<void> {
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('likes')
      .insert({ post_id: params.postId, user_id: user.id });

   if (error) throw new Error(`Failed to like post: ${error.message}`);
}
