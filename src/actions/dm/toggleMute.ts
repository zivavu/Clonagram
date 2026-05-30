'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';

export async function toggleMute(conversationId: string, muted: boolean): Promise<void> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw new Error('Not authenticated');

   const { error } = await supabase
      .from('conversation_participants')
      .update({ is_muted: muted })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);
   if (error) throw error;
}
