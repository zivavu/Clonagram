'use server';
import 'server-only';

import { revalidatePath } from 'next/cache';
import { getAuthUser } from '../getAuthUser';

export async function deleteNoteAction() {
   const { supabase, user } = await getAuthUser();
   const { error } = await supabase.from('notes').delete().eq('user_id', user.id);
   if (error) throw new Error(`Failed to delete note: ${error.message}`);
   revalidatePath('/');
}
