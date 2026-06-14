'use server';
import 'server-only';
import { throwIfError } from '@/src/lib/unwrap';
import { FollowUserSchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function followUser(targetUserId: string) {
   const { targetUserId: validatedTargetUserId } = validate(FollowUserSchema, { targetUserId });
   const { supabase, user } = await getAuthUser();

   const { data: target, error: targetError } = await supabase
      .from('profiles')
      .select('is_private')
      .eq('id', validatedTargetUserId)
      .single();

   if (targetError || !target) throw new Error('User not found');

   if (target.is_private) {
      const { error } = await supabase
         .from('follow_requests')
         .insert({ requester_id: user.id, target_id: validatedTargetUserId });
      throwIfError({ error }, 'Failed to send follow request');
   } else {
      const { error } = await supabase
         .from('follows')
         .insert({ follower_id: user.id, following_id: validatedTargetUserId });
      throwIfError({ error }, 'Failed to follow user');

      const { data: conversationId } = await supabase.rpc('find_direct_conversation', {
         p_user_a: user.id,
         p_user_b: validatedTargetUserId,
      });
      if (conversationId) {
         await supabase
            .from('conversation_participants')
            .update({ folder: 'primary' })
            .eq('conversation_id', conversationId)
            .eq('user_id', user.id)
            .eq('folder', 'requests');
      }

      const { data: adminConvos } = await supabase
         .from('conversation_participants')
         .select('conversation_id')
         .eq('user_id', validatedTargetUserId)
         .eq('role', 'admin');

      if (adminConvos && adminConvos.length > 0) {
         await supabase
            .from('conversation_participants')
            .update({ folder: 'primary' })
            .eq('user_id', user.id)
            .eq('folder', 'requests')
            .in(
               'conversation_id',
               adminConvos.map(c => c.conversation_id),
            );
      }
   }
}
