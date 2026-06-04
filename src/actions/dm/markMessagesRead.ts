'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';

export async function markMessagesRead(conversationId: string): Promise<void> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) return;

   const now = new Date().toISOString();

   await supabase
      .from('messages')
      .update({ read_at: now })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id)
      .is('read_at', null);
}
