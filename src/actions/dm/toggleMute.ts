'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function toggleMute(conversationId: string, muted: boolean) {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated');
   const { error } = await supabase
      .from('conversation_participants')
      .update({ is_muted: muted })
      .eq('conversation_id', conversationId)
      .eq('user_id', authProfile.id);
   if (error) throw error;
}
