'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';
import { ConversationWithFolderSchema, validate } from '@/src/lib/validation';

export async function moveConversation(params: {
   conversationId: string;
   folder: 'primary' | 'general';
}) {
   const { conversationId, folder } = validate(ConversationWithFolderSchema, params);
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('conversation_participants')
      .update({ folder })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);
   throwIfError({ error }, 'Failed to move conversation');
}
