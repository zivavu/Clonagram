'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';

export async function blockAndDeleteRequest(
   conversationId: string,
   senderUserId: string,
): Promise<void> {
   const { supabase, user } = await getAuthUser();

   await Promise.all([
      supabase
         .from('blocks')
         .insert({ blocker_id: user.id, blocked_id: senderUserId })
         .then(({ error }) => {
            throwIfError({ error }, 'Failed to block user');
         }),
      supabase
         .from('conversation_participants')
         .delete()
         .eq('conversation_id', conversationId)
         .eq('user_id', user.id)
         .then(({ error }) => {
            throwIfError({ error }, 'Failed to delete conversation');
         }),
   ]);
}
