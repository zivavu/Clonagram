'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function acceptRequest(conversationId: string) {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated');
   const { error } = await supabase
      .from('conversation_participants')
      .update({ folder: 'primary' })
      .eq('conversation_id', conversationId)
      .eq('user_id', authProfile.id);
   if (error) throw error;
}
