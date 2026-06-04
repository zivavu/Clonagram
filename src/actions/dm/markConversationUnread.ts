'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';

export async function markConversationUnread(conversationId: string): Promise<void> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) return;

   await supabase
      .from('conversation_participants')
      .update({ last_read_at: null })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);
}
