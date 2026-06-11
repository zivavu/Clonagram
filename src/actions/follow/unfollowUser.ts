'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';
import { throwIfError } from '@/src/lib/unwrap';
import { FollowUserSchema, validate } from '@/src/lib/validation';

export async function unfollowUser(targetUserId: string): Promise<void> {
   const { targetUserId: validatedTargetUserId } = validate(FollowUserSchema, { targetUserId });
   const supabase = await createServerClient();
   const authProfile = await getAuthProfile(supabase);

   if (!authProfile) throw new Error('Not authenticated');

   const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', authProfile.id)
      .eq('following_id', validatedTargetUserId);

   throwIfError({ error }, 'Failed to unfollow user');

   revalidatePath('/profile/[username]', 'page');
}
