import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export async function promoteParticipantToPrimary(
   supabase: SupabaseClient<Database>,
   conversationId: string,
   userId: string,
) {
   await supabase
      .from('conversation_participants')
      .update({ folder: 'primary' })
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .eq('folder', 'requests');
}
