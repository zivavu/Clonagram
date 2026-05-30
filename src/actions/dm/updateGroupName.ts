'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function updateGroupName(conversationId: string, title: string) {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated');

   const { data: participant } = await supabase
      .from('conversation_participants')
      .select('role')
      .eq('conversation_id', conversationId)
      .eq('user_id', authProfile.id)
      .single();
   if (participant?.role !== 'admin') throw new Error('Only admins can rename the group');

   const { error } = await supabase
      .from('conversations')
      .update({ title: title.trim() || null })
      .eq('id', conversationId);
   if (error) throw error;
}
