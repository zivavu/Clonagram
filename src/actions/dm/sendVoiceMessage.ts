'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';

export async function sendVoiceMessage(conversationId: string, audioUrl: string) {
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      audio_url: audioUrl,
   });
   throwIfError({ error }, 'Failed to send voice message');

   await supabase
      .from('conversation_participants')
      .update({ folder: 'primary' })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)
      .eq('folder', 'requests');
}
