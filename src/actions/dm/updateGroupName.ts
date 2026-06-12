'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';
import { ConversationWithTitleSchema, validate } from '@/src/lib/validation';

export async function updateGroupName(params: {
   conversationId: string;
   title: string;
}): Promise<void> {
   const { conversationId, title } = validate(ConversationWithTitleSchema, params);
   const { supabase, user } = await getAuthUser();

   const { data: participant } = await supabase
      .from('conversation_participants')
      .select('role')
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)
      .single();
   if (!participant) throw new Error('Not a participant');

   const { error } = await supabase
      .from('conversations')
      .update({ title: title.trim() || null })
      .eq('id', conversationId);
   throwIfError({ error }, 'Failed to update group name');
}
