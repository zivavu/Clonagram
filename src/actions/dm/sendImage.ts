'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';
import { throwIfError } from '@/src/lib/unwrap';
import { SendImageSchema, validate } from '@/src/lib/validation';

export async function sendImage(conversationId: string, mediaUrl: string): Promise<void> {
   const { conversationId: cid, mediaUrl: url } = validate(SendImageSchema, {
      conversationId,
      mediaUrl,
   });
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw new Error('Not authenticated');

   const { error } = await supabase.from('messages').insert({
      conversation_id: cid,
      sender_id: user.id,
      media_url: url,
   });
   throwIfError({ error }, 'Failed to send image');
}
