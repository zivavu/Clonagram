'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';

export async function sendMessage(conversationId: string, content: string): Promise<void> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw new Error('Not authenticated');

   const trimmed = content.trim();
   if (!trimmed) return;

   const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: trimmed,
   });
   if (error) throw error;
}
