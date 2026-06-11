'use server';
import 'server-only';
import { randomUUID } from 'node:crypto';
import { getAuthUser } from '@/src/actions/getAuthUser';
import { CreateConversationSchema, validate } from '@/src/lib/validation';

export async function createConversation(participantIds: string[]): Promise<string> {
   const { participantIds: validatedParticipantIds } = validate(CreateConversationSchema, {
      participantIds,
   });
   const { supabase, user } = await getAuthUser();

   const uniqueParticipantIds = [...new Set(validatedParticipantIds.filter(id => id !== user.id))];

   if (uniqueParticipantIds.length === 1) {
      const { data: existingId } = await supabase.rpc('find_direct_conversation', {
         p_user_a: user.id,
         p_user_b: uniqueParticipantIds[0],
      });
      if (existingId) return existingId as string;
   }

   const convId = randomUUID();
   const { error: convError } = await supabase
      .from('conversations')
      .insert({ id: convId, title: null });
   if (convError) throw convError;

   const { data: followers } = await supabase
      .from('follows')
      .select('follower_id')
      .in('follower_id', uniqueParticipantIds)
      .eq('following_id', user.id);
   const followerSet = new Set((followers ?? []).map(r => r.follower_id));

   const participants = [
      { conversation_id: convId, user_id: user.id, role: 'admin', folder: 'primary' },
      ...uniqueParticipantIds.map(uid => ({
         conversation_id: convId,
         user_id: uid,
         role: 'member',
         folder: followerSet.has(uid) ? 'primary' : 'requests',
      })),
   ];

   const { error: partError } = await supabase
      .from('conversation_participants')
      .insert(participants);
   if (partError) throw partError;

   return convId;
}
