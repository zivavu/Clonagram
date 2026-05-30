'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';

export async function leaveConversation(conversationId: string): Promise<void> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw new Error('Not authenticated');

   const { error } = await supabase
      .from('conversation_participants')
      .delete()
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);
   if (error) throw error;
}
