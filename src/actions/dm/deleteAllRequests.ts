'use server';
import 'server-only';
import { createServerClient } from '@/src/lib/supabase/server';

export async function deleteAllRequests(): Promise<void> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();
   if (!user) throw new Error('Not authenticated');

   const { error } = await supabase
      .from('conversation_participants')
      .delete()
      .eq('user_id', user.id)
      .eq('folder', 'requests');
   if (error) throw error;
}
