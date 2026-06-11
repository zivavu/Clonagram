'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';

export async function leaveConversation(conversationId: string): Promise<void> {
   const { supabase, user } = await getAuthUser();

   const { data: self } = await supabase
      .from('conversation_participants')
      .select('role')
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)
      .single();

   if (self?.role === 'admin') {
      const { data: nextAdmin } = await supabase
         .from('conversation_participants')
         .select('user_id')
         .eq('conversation_id', conversationId)
         .neq('user_id', user.id)
         .limit(1)
         .single();

      if (nextAdmin) {
         const { error: promoteError } = await supabase
            .from('conversation_participants')
            .update({ role: 'admin' })
            .eq('conversation_id', conversationId)
            .eq('user_id', nextAdmin.user_id);
         throwIfError({ error: promoteError }, 'Failed to promote new admin');
      }
   }

   const { error } = await supabase
      .from('conversation_participants')
      .delete()
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);
   throwIfError({ error }, 'Failed to leave conversation');
}
