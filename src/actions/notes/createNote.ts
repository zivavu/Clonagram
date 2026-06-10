'use server';
import 'server-only';

import { revalidatePath } from 'next/cache';
import { getAuthUser } from '../getAuthUser';

export async function createNoteAction(content: string) {
   if (!content.trim() || content.length > 60) {
      throw new Error('Note must be between 1 and 60 characters');
   }
   const { supabase, user } = await getAuthUser();
   const { error } = await supabase
      .from('notes')
      .upsert({ user_id: user.id, content: content.trim() }, { onConflict: 'user_id' });
   if (error) throw new Error(`Failed to save note: ${error.message}`);
   revalidatePath('/');
   revalidatePath('/profile/[username]', 'page');
}
