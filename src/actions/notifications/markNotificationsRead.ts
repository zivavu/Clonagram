'use server';
import 'server-only';
import { MarkNotificationsReadSchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function markNotificationsReadAction(ids: string[]) {
   const { ids: validatedIds } = validate(MarkNotificationsReadSchema, { ids });
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .in('id', validatedIds);

   if (error) throw new Error(`Failed to mark notifications as read: ${error.message}`);
}
