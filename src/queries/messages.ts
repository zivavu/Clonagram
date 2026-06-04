import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export function getMessagesQuery(supabase: SupabaseClient<Database>, conversationId: string) {
   return supabase
      .from('messages')
      .select(
         `id, content, created_at, sender_id, is_deleted, reply_to_id, sticker_url, read_at,
         sender:profiles!sender_id(id, username, full_name, avatar_url)`,
      )
      .eq('conversation_id', conversationId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });
}

export type ConversationMessages = QueryData<ReturnType<typeof getMessagesQuery>>;
export type ConversationMessage = ConversationMessages[number];
