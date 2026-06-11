'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';
import { SendMessageSchema, validate } from '@/src/lib/validation';

export async function sendMessage(conversationId: string, content: string): Promise<void> {
   const { conversationId: cid, content: text } = validate(SendMessageSchema, {
      conversationId,
      content,
   });
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw new Error('Not authenticated');

   const trimmed = text.trim();
   if (!trimmed) return;

   const { error } = await supabase.from('messages').insert({
      conversation_id: cid,
      sender_id: user.id,
      content: trimmed,
   });
   if (error) throw error;
}
