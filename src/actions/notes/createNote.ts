'use server';
import 'server-only';

import { revalidatePath } from 'next/cache';
import { throwIfError } from '@/src/lib/unwrap';
import { CreateNoteSchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function createNote(content: string) {
   const { content: validatedContent } = validate(CreateNoteSchema, { content });
   const { supabase, user } = await getAuthUser();
   const { error } = await supabase
      .from('notes')
      .upsert({ user_id: user.id, content: validatedContent.trim() }, { onConflict: 'user_id' });
   throwIfError({ error }, 'Failed to save note');
   revalidatePath('/');
   revalidatePath('/profile/[username]', 'page');
}
