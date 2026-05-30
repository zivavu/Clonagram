import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export function getConversationsQuery(
   supabase: SupabaseClient<Database>,
   authUserId: string,
   folder: 'primary' | 'general' | 'requests',
) {
   return supabase
      .from('conversation_participants')
      .select(
         `conversation_id,
         folder,
         is_muted,
         last_read_at,
         role,
         conversation:conversations!conversation_id(
            id,
            title,
            updated_at,
            last_message_preview,
            last_message_at,
            last_message_sender_id,
            participants:conversation_participants(
               user_id,
               role,
               user:profiles!user_id(id, username, full_name, avatar_url)
            )
         )`,
      )
      .eq('user_id', authUserId)
      .eq('folder', folder)
      .order('last_message_at', { ascending: false });
}

export type ConversationSummaries = QueryData<ReturnType<typeof getConversationsQuery>>;
export type ConversationSummary = ConversationSummaries[number];

export function getConversationQuery(supabase: SupabaseClient<Database>, conversationId: string) {
   return supabase
      .from('conversations')
      .select(
         `id, title, updated_at, last_message_preview, last_message_at, last_message_sender_id,
         participants:conversation_participants(
            user_id,
            role,
            is_muted,
            folder,
            user:profiles!user_id(id, username, full_name, avatar_url)
         )`,
      )
      .eq('id', conversationId)
      .single();
}

export type ConversationDetail = QueryData<ReturnType<typeof getConversationQuery>>;
