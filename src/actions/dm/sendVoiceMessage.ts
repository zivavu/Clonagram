'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';
import { promoteParticipantToPrimary } from './promoteParticipantToPrimary';

export async function sendVoiceMessage(conversationId: string, audioUrl: string) {
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      audio_url: audioUrl,
   });
   throwIfError({ error }, 'Failed to send voice message');

   await promoteParticipantToPrimary(supabase, conversationId, user.id);
}
