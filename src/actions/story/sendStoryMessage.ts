import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { throwIfError } from '@/src/lib/unwrap';
import type { Database } from '@/src/types/database';

export async function sendStoryMessage(
   supabase: SupabaseClient<Database>,
   params: {
      conversationId: string;
      senderId: string;
      content: string;
      storyId: string;
      mediaUrl: string | null;
      ownerId: string;
      notificationType: 'story_reply' | 'story_like';
   },
) {
   const { conversationId, senderId, content, storyId, mediaUrl, ownerId, notificationType } =
      params;

   const { error: msgError } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      story_id: storyId,
      media_url: mediaUrl,
   });
   throwIfError({ error: msgError }, 'Failed to insert message');

   const { error: notifError } = await supabase.from('notifications').insert({
      user_id: ownerId,
      actor_id: senderId,
      type: notificationType,
      story_id: storyId,
   });
   throwIfError({ error: notifError }, 'Failed to insert notification');
}
