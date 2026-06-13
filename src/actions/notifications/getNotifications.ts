'use server';
import 'server-only';
import { throwIfError } from '@/src/lib/unwrap';
import type { Notifications } from '@/src/queries/notifications';
import { getOptionalUser } from '../getAuthUser';

export async function getNotifications(): Promise<Notifications> {
   const { supabase, user } = await getOptionalUser();
   if (!user) return [];

   const { data, error } = await supabase
      .from('notifications')
      .select(
         `
         id, type, read, created_at,
         post_id,
         comment_id,
         story_id,
         actor:profiles!actor_id(id, username, avatar_url, full_name),
         post:post_id(id, type, user:profiles!user_id(username))
      `,
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

   throwIfError({ error }, 'Failed to fetch notifications');
   return data ?? [];
}
