'use server';
import 'server-only';

import { revalidatePath } from 'next/cache';
import { getAuthUser } from '../getAuthUser';

export async function editHighlight(id: string, title: string) {
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('story_highlights')
      .update({ title })
      .eq('id', id)
      .eq('user_id', user.id);

   if (error) throw new Error(`Failed to update highlight: ${error.message}`);
   revalidatePath('/profile');
}
