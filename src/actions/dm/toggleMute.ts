'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';
import { ConversationWithMutedSchema, validate } from '@/src/lib/validation';

export async function toggleMute(params: { conversationId: string; muted: boolean }) {
   const { conversationId, muted } = validate(ConversationWithMutedSchema, params);
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('conversation_participants')
      .update({ is_muted: muted })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);
   throwIfError({ error }, 'Failed to toggle mute');
}
