'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';
import { SendMessageSchema, validate } from '@/src/lib/validation';
import { promoteParticipantToPrimary } from './promoteParticipantToPrimary';

export async function sendMessage(conversationId: string, content: string) {
   const { conversationId: cid, content: text } = validate(SendMessageSchema, {
      conversationId,
      content,
   });
   const { supabase, user } = await getAuthUser();

   const trimmed = text.trim();
   if (!trimmed) return;

   const { error } = await supabase.from('messages').insert({
      conversation_id: cid,
      sender_id: user.id,
      content: trimmed,
   });
   throwIfError({ error }, 'Failed to send message');

   await promoteParticipantToPrimary(supabase, cid, user.id);
}
