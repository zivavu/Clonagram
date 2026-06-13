'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
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
   }

   revalidatePath('/profile/[username]', 'page');
}
