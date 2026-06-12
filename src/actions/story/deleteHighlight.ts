'use server';
import 'server-only';

import { revalidatePath } from 'next/cache';
import { getAuthUser } from '../getAuthUser';

export async function deleteHighlight(id: string) {
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('story_highlights')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

   if (error) throw new Error(`Failed to delete highlight: ${error.message}`);
   revalidatePath('/profile');
}
