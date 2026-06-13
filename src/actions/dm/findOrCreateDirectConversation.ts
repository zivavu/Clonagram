import 'server-only';
import { randomUUID } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import { throwIfError } from '@/src/lib/unwrap';
import type { Database } from '@/src/types/database';

export async function findOrCreateDirectConversation(
   supabase: SupabaseClient<Database>,
   authUserId: string,
   otherUserId: string,
): Promise<string> {
   const { data: existingId } = await supabase.rpc('find_direct_conversation', {
      p_user_a: authUserId,
      p_user_b: otherUserId,
   });
   if (existingId) return existingId;

   const conversationId = randomUUID();
   const { error: convError } = await supabase
      .from('conversations')
      .insert({ id: conversationId, title: null });
   throwIfError({ error: convError }, 'Failed to create conversation');

   const { data: followerData } = await supabase
      .from('follows')
      .select('follower_id')
      .eq('follower_id', otherUserId)
      .eq('following_id', authUserId)
      .eq('status', 'accepted')
      .single();

   const folder = followerData ? 'primary' : 'requests';

   const { error: partError } = await supabase.from('conversation_participants').insert([
      { conversation_id: conversationId, user_id: authUserId, role: 'admin', folder: 'primary' },
      { conversation_id: conversationId, user_id: otherUserId, role: 'member', folder },
   ]);
   throwIfError({ error: partError }, 'Failed to add conversation participants');

   return conversationId;
}
