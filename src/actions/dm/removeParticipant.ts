'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';
import { ConversationWithUserSchema, validate } from '@/src/lib/validation';

export async function removeParticipant(params: { conversationId: string; userId: string }) {
   const { conversationId, userId } = validate(ConversationWithUserSchema, params);
   const { supabase, user } = await getAuthUser();

   const { data: self } = await supabase
      .from('conversation_participants')
      .select('role')
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)
      .single();
   if (self?.role !== 'admin') throw new Error('Only admins can remove members');

   const { error } = await supabase
      .from('conversation_participants')
      .delete()
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);
   throwIfError({ error }, 'Failed to remove participant');
}
