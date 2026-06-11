'use server';
import 'server-only';

import { revalidatePath } from 'next/cache';
import { DeleteNoteSchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function deleteNote(noteId: string) {
   const { noteId: validatedNoteId } = validate(DeleteNoteSchema, { noteId });
   const { supabase, user } = await getAuthUser();
   const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', validatedNoteId)
      .eq('user_id', user.id);
   if (error) throw new Error(`Failed to delete note: ${error.message}`);
   revalidatePath('/');
   revalidatePath('/profile/[username]', 'page');
}
