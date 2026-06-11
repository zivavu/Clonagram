'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';

export async function moveConversation(
   conversationId: string,
   folder: 'primary' | 'general',
): Promise<void> {
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('conversation_participants')
      .update({ folder })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);
   throwIfError({ error }, 'Failed to move conversation');
}
