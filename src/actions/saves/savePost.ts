'use server';
import 'server-only';
import { getAuthUser } from '../getAuthUser';

export async function savePostAction(params: { postId: string }): Promise<void> {
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('saves')
      .insert({ post_id: params.postId, user_id: user.id });

   if (error) throw new Error(`Failed to save post: ${error.message}`);
}
