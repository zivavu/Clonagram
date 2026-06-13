'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';
import { ConversationWithBlockSchema, validate } from '@/src/lib/validation';

export async function blockAndDeleteRequest(params: {
   conversationId: string;
   senderUserId: string;
}) {
   const { conversationId, senderUserId } = validate(ConversationWithBlockSchema, params);
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
