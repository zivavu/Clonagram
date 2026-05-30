'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function blockAndDeleteRequest(conversationId: string, senderUserId: string) {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated');

   await Promise.all([
      supabase
         .from('blocks')
         .insert({ blocker_id: authProfile.id, blocked_id: senderUserId })
         .then(({ error }) => {
            if (error) throw error;
         }),
      supabase
         .from('conversation_participants')
         .delete()
         .eq('conversation_id', conversationId)
         .eq('user_id', authProfile.id)
         .then(({ error }) => {
            if (error) throw error;
         }),
   ]);
}
