'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function sendMessage(conversationId: string, content: string) {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated');

   const trimmed = content.trim();
   if (!trimmed) return;

   const { error: msgError } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: authProfile.id,
      content: trimmed,
   });
   if (msgError) throw msgError;

   const now = new Date().toISOString();

   const [{ error: convError }, { error: partError }] = await Promise.all([
      supabase
         .from('conversations')
         .update({
            last_message_preview: trimmed.slice(0, 100),
            last_message_at: now,
            last_message_sender_id: authProfile.id,
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
