'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';

export async function addParticipants(conversationId: string, userIds: string[]): Promise<void> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw new Error('Not authenticated');

   const rows = userIds.map(uid => ({
      conversation_id: conversationId,
      user_id: uid,
      role: 'member',
      folder: 'primary',
   }));
   const { error } = await supabase.from('conversation_participants').upsert(rows, {
      onConflict: 'conversation_id,user_id',
      ignoreDuplicates: true,
   });
   if (error) throw error;
}
