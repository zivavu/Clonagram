'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';

export async function updateGroupName(conversationId: string, title: string): Promise<void> {
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
