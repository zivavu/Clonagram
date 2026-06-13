'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';
import { ConversationIdSchema, validate } from '@/src/lib/validation';

export async function markChatRead(params: { conversationId: string }) {
   const { conversationId } = validate(ConversationIdSchema, params);
   const { supabase, user } = await getAuthUser();

   const now = new Date().toISOString();

   const [{ error: partError }, { error: msgError }] = await Promise.all([
      supabase
         .from('conversation_participants')
         .update({ last_read_at: now })
         .eq('conversation_id', conversationId)
         .eq('user_id', user.id),
      supabase
         .from('messages')
         .update({ read_at: now })
         .eq('conversation_id', conversationId)
         .neq('sender_id', user.id)
         .is('read_at', null),
   ]);
   throwIfError({ error: partError }, 'Failed to mark chat read');
   throwIfError({ error: msgError }, 'Failed to mark chat read');
}
