'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function addParticipants(conversationId: string, userIds: string[]) {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated');

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
