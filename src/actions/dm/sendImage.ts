'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';
import { SendImageSchema, validate } from '@/src/lib/validation';

export async function sendImage(conversationId: string, mediaUrl: string) {
   const { conversationId: cid, mediaUrl: url } = validate(SendImageSchema, {
      conversationId,
      mediaUrl,
   });
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase.from('messages').insert({
      conversation_id: cid,
      sender_id: user.id,
      media_url: url,
   });
   throwIfError({ error }, 'Failed to send image');
}
