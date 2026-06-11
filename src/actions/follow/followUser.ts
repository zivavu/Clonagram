'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';
import { throwIfError } from '@/src/lib/unwrap';
import { FollowUserSchema, validate } from '@/src/lib/validation';

export async function followUser(targetUserId: string): Promise<void> {
   const { targetUserId: validatedTargetUserId } = validate(FollowUserSchema, { targetUserId });
   const supabase = await createServerClient();
   const authProfile = await getAuthProfile(supabase);

   if (!authProfile) throw new Error('Not authenticated');

   const { data: target, error: targetError } = await supabase
      .from('profiles')
      .select('is_private')
      .eq('id', validatedTargetUserId)
      .single();

   if (targetError || !target) throw new Error('User not found');

   if (target.is_private) {
      const { error } = await supabase
         .from('follow_requests')
         .insert({ requester_id: authProfile.id, target_id: validatedTargetUserId });
      throwIfError({ error }, 'Failed to send follow request');
   } else {
      const { error } = await supabase
         .from('follows')
         .insert({ follower_id: authProfile.id, following_id: validatedTargetUserId });
      throwIfError({ error }, 'Failed to follow user');
   }

   revalidatePath('/profile/[username]', 'page');
}
