'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function createConversation(participantIds: string[]) {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);
   if (!authProfile) throw new Error('Not authenticated');

   const allIds = [...new Set([authProfile.id, ...participantIds])];

   if (allIds.length === 2) {
      const otherId = participantIds[0];
      const { data: otherConvIds } = await supabase
         .from('conversation_participants')
         .select('conversation_id')
         .eq('user_id', otherId);
      const otherIds = (otherConvIds ?? []).map(r => r.conversation_id);
      if (otherIds.length > 0) {
         const { data: existing } = await supabase
            .from('conversation_participants')
            .select('conversation_id')
            .eq('user_id', authProfile.id)
            .in('conversation_id', otherIds)
            .limit(1)
            .maybeSingle();
         if (existing) return existing.conversation_id;
      }
   }

   const { data: conv, error: convError } = await supabase
      .from('conversations')
      .insert({ title: null })
      .select('id')
      .single();
   if (convError || !conv) throw convError ?? new Error('Failed to create conversation');

   const { data: followers } = await supabase
      .from('follows')
      .select('follower_id')
      .in('follower_id', participantIds)
      .eq('following_id', authProfile.id);
   const followerSet = new Set((followers ?? []).map(r => r.follower_id));

   const participants = [
      { conversation_id: conv.id, user_id: authProfile.id, role: 'admin', folder: 'primary' },
      ...participantIds.map(uid => ({
         conversation_id: conv.id,
         user_id: uid,
         role: 'member',
         folder: followerSet.has(uid) ? 'primary' : 'requests',
      })),
   ];

   const { error: partError } = await supabase
      .from('conversation_participants')
      .insert(participants);
   if (partError) throw partError;

   return conv.id;
}
