'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';

export async function blockAndDeleteRequest(
   conversationId: string,
   senderUserId: string,
): Promise<void> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw new Error('Not authenticated');

   await Promise.all([
      supabase
         .from('blocks')
         .insert({ blocker_id: user.id, blocked_id: senderUserId })
         .then(({ error }) => {
            if (error) throw error;
         }),
      supabase
         .from('conversation_participants')
         .delete()
         .eq('conversation_id', conversationId)
         .eq('user_id', user.id)
         .then(({ error }) => {
            if (error) throw error;
         }),
   ]);
}
