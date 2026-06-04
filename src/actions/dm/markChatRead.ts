'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';

export async function markChatRead(conversationId: string): Promise<void> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) return;

   const now = new Date().toISOString();

   await Promise.all([
      supabase
         .from('conversation_participants')
         .update({ last_read_at: now })
         .eq('conversation_id', conversationId)
         .eq('user_id', user.id),
      supabase
         .from('messages')
         .update({ read_at: now })
         .eq('conversation_id', conversationId)
         .neq('sender_id', user.id)
         .is('read_at', null),
   ]);
}
