'use server';
import 'server-only';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { throwIfError } from '@/src/lib/unwrap';
import { ConversationIdSchema, validate } from '@/src/lib/validation';

export async function addParticipants(params: {
   conversationId: string;
   userIds: string[];
}): Promise<void> {
   const { conversationId, userIds } = params;
   validate(ConversationIdSchema, { conversationId });
   const { supabase, user } = await getAuthUser();

   const { data: followers } = await supabase
      .from('follows')
      .select('follower_id')
      .in('follower_id', userIds)
      .eq('following_id', user.id);
   const followerSet = new Set((followers ?? []).map(r => r.follower_id));

   const rows = userIds.map(uid => ({
      conversation_id: conversationId,
      user_id: uid,
      role: 'member',
      folder: followerSet.has(uid) ? 'primary' : 'requests',
   }));
   const { error } = await supabase.from('conversation_participants').upsert(rows, {
      onConflict: 'conversation_id,user_id',
      ignoreDuplicates: true,
   });
   throwIfError({ error }, 'Failed to add participants');
}
