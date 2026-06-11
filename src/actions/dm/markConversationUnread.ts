'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';

export async function markConversationUnread(conversationId: string): Promise<void> {
   const { supabase, user } = await getAuthUser();

   await supabase
      .from('conversation_participants')
      .update({ last_read_at: null })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);
}
