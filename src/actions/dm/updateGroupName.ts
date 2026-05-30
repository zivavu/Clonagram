'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';

export async function updateGroupName(conversationId: string, title: string): Promise<void> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw new Error('Not authenticated');

   const { data: participant } = await supabase
      .from('conversation_participants')
      .select('role')
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)
      .single();
   if (participant?.role !== 'admin') throw new Error('Only admins can rename the group');

   const { error } = await supabase
      .from('conversations')
      .update({ title: title.trim() || null })
      .eq('id', conversationId);
   if (error) throw error;
}
