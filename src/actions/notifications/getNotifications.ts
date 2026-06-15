'use server';
import 'server-only';
import { getHideAiContent } from '@/src/lib/getHideAiContent';
import { throwIfError } from '@/src/lib/unwrap';
import { getOptionalUser } from '../getAuthUser';

export async function getNotifications() {
   const { supabase, user } = await getOptionalUser();
   if (!user) return [];

   const hideAi = await getHideAiContent(supabase);

   let query = supabase
      .from('notifications')
      .select(
         `
          id, type, read, created_at,
          post_id,
          comment_id,
          story_id,
          actor:profiles!actor_id(id, username, avatar_url, full_name, is_ai),
          post:post_id(id, type, user:profiles!user_id(username))
       `,
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

   if (hideAi) {
      query = query.eq('actor.is_ai', false);
   }

   const { data, error } = await query;

   throwIfError({ error }, 'Failed to fetch notifications');
   return data ?? [];
}
