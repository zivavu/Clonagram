'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';
import { ConversationIdSchema, validate } from '@/src/lib/validation';

export async function deleteConversation(params: { conversationId: string }): Promise<void> {
   const { conversationId } = validate(ConversationIdSchema, params);
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('conversation_participants')
      .delete()
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);
   throwIfError({ error }, 'Failed to delete conversation');
}
