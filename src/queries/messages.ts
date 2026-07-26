import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export const MESSAGES_PAGE_SIZE = 50;

export function getMessagesQuery(
   supabase: SupabaseClient<Database>,
   conversationId: string,
   limit: number = MESSAGES_PAGE_SIZE,
) {
   return supabase
      .from('messages')
      .select(
         `id, content, created_at, sender_id, is_deleted, reply_to_id, sticker_url, media_url, audio_url, call_event, read_at, story_id, post_id,
         sender:profiles!sender_id(id, username, full_name, avatar_url),
         story:story_id(id, user_id, profiles!stories_user_id_fkey(username)),
         post:post_id(
            id,
            caption,
            user:profiles!posts_user_id_fkey(id, username, avatar_url),
            images:post_images(url, position)
         )`,
      )
      .eq('conversation_id', conversationId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(limit);
}

export type ConversationMessages = QueryData<ReturnType<typeof getMessagesQuery>>;
export type ConversationMessage = ConversationMessages[number];

export async function fetchMessageWindow(
   supabase: SupabaseClient<Database>,
   conversationId: string,
   limit: number = MESSAGES_PAGE_SIZE,
) {
   const { data, error } = await getMessagesQuery(supabase, conversationId, limit);
   if (error) throw error;
   return (data ?? []).reverse();
}
