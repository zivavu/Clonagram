'use server';
import 'server-only';
import { TogglePostSaveSchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function toggleSavePost(params: { postId: string; isSaved: boolean }) {
   const { postId, isSaved } = validate(TogglePostSaveSchema, params);
   const { supabase, user } = await getAuthUser();

   if (isSaved) {
      const { error } = await supabase
         .from('saves')
         .delete()
         .eq('post_id', postId)
         .eq('user_id', user.id);
      if (error) throw new Error(`Failed to unsave post: ${error.message}`);
   } else {
      const { error } = await supabase.from('saves').insert({ post_id: postId, user_id: user.id });
      if (error) throw new Error(`Failed to save post: ${error.message}`);
   }
}
