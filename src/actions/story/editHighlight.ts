'use server';
import 'server-only';

import { revalidatePath } from 'next/cache';
import { throwIfError } from '@/src/lib/unwrap';
import { EditHighlightSchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function editHighlight(params: { id: string; title: string }) {
   const { id, title } = validate(EditHighlightSchema, params);
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('story_highlights')
      .update({ title })
      .eq('id', id)
      .eq('user_id', user.id);

   throwIfError({ error }, 'Failed to update highlight');
   revalidatePath('/profile');
   revalidatePath('/profile/[username]', 'page');
}
