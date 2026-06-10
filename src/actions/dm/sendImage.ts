'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';

export async function sendImage(conversationId: string, mediaUrl: string): Promise<void> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw new Error('Not authenticated');

   const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      media_url: mediaUrl,
   });
   if (error) throw error;
}
