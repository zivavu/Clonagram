'use server';
import 'server-only';
import { DislikePostSchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function dislikePostAction(params: { postId: string }): Promise<void> {
   const { postId } = validate(DislikePostSchema, params);
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id);

   if (error) throw new Error(`Failed to dislike post: ${error.message}`);
}
