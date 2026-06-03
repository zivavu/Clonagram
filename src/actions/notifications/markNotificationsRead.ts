'use server';
import 'server-only';
import { getAuthUser } from '../getAuthUser';

export async function markNotificationsReadAction() {
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

   if (error) throw new Error(`Failed to mark notifications as read: ${error.message}`);
}
