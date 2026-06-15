'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { throwIfError } from '@/src/lib/unwrap';
import { getAuthUser } from '../getAuthUser';

export async function toggleHideAiContent(hideAiContent: boolean) {
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('profiles')
      .update({ hide_ai_content: hideAiContent })
      .eq('id', user.id);

   throwIfError({ error }, 'Failed to update AI content setting');
   revalidatePath('/', 'layout');
}
