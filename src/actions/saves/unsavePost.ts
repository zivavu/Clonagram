'use server';
import 'server-only';
import { getAuthUser } from '../getAuthUser';

export async function unsavePostAction(params: { postId: string }): Promise<void> {
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('saves')
      .delete()
      .eq('post_id', params.postId)
      .eq('user_id', user.id);

   if (error) throw new Error(`Failed to unsave post: ${error.message}`);
}
