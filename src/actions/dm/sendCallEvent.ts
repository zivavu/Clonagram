'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';

export type CallEvent = 'audio_started' | 'audio_ended' | 'video_started' | 'video_ended';

export async function sendCallEvent(conversationId: string, event: CallEvent) {
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      call_event: event,
   });
   throwIfError({ error }, 'Failed to send call event');
}
