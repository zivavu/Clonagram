import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export type NotificationType =
   | 'like'
   | 'comment'
   | 'follow'
   | 'mention'
   | 'message'
   | 'story_reply'
   | 'story_mention'
   | 'collaborator_invite'
   | 'story_like'
   | 'tag';

export function notificationsQuery(supabase: SupabaseClient<Database>, userId: string) {
   return supabase
      .from('notifications')
      .select(
         `
         id, type, read, created_at,
         post_id,
         comment_id,
         story_id,
         actor:profiles!actor_id(id, username, avatar_url, full_name)
      `,
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
}

export type Notifications = QueryData<ReturnType<typeof notificationsQuery>>;
export type NotificationRow = Notifications[number];
