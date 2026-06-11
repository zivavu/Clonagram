'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';

export async function removeParticipant(conversationId: string, userId: string): Promise<void> {
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
