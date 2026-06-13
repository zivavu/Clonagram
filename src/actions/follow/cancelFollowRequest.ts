'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { throwIfError } from '@/src/lib/unwrap';
import { FollowUserSchema, validate } from '@/src/lib/validation';
import { getAuthUser } from '../getAuthUser';

export async function cancelFollowRequest(targetUserId: string): Promise<void> {
   const { targetUserId: validatedTargetUserId } = validate(FollowUserSchema, { targetUserId });
   const { supabase, user } = await getAuthUser();

   const { error } = await supabase
      .from('follow_requests')
      .delete()
      .eq('requester_id', user.id)
      .eq('target_id', validatedTargetUserId);

   throwIfError({ error }, 'Failed to cancel follow request');

   revalidatePath('/profile/[username]', 'page');
}
