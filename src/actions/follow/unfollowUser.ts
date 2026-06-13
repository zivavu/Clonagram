'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { throwIfError } from '@/src/lib/unwrap';
import { FollowUserSchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function unfollowUser(targetUserId: string) {
   const { targetUserId: validatedTargetUserId } = validate(FollowUserSchema, { targetUserId });
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', validatedTargetUserId);

   throwIfError({ error }, 'Failed to unfollow user');

   revalidatePath('/profile/[username]', 'page');
}
