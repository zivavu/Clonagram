'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';

export async function sendImage(conversationId: string, mediaUrl: string): Promise<void> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw new Error('Not authenticated');

   const { error: msgError } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      media_url: mediaUrl,
   });
   if (msgError) throw msgError;

   const now = new Date().toISOString();

   const [{ error: convError }, { error: partError }] = await Promise.all([
      supabase
         .from('conversations')
         .update({
            last_message_preview: '📷 Photo',
            last_message_at: now,
            last_message_sender_id: user.id,
            updated_at: now,
         })
         .eq('id', conversationId),
      supabase
         .from('conversation_participants')
         .update({ last_message_at: now })
         .eq('conversation_id', conversationId),
   ]);
   if (convError) throw convError;
   if (partError) throw partError;
}
