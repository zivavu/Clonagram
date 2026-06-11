'use server';
import 'server-only';
import { UnsavePostSchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function unsavePost(params: { postId: string }): Promise<void> {
   const { postId } = validate(UnsavePostSchema, params);
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('saves')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id);

   if (error) throw new Error(`Failed to unsave post: ${error.message}`);
}
