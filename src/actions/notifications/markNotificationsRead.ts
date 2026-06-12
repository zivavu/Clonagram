'use server';
import 'server-only';
import { throwIfError } from '@/src/lib/unwrap';
import { MarkNotificationsReadSchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function markNotificationsRead(ids: string[]) {
   const { ids: validatedIds } = validate(MarkNotificationsReadSchema, { ids });
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .in('id', validatedIds);

   throwIfError({ error }, 'Failed to mark notifications as read');
}
