'use server';
import 'server-only';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function unfollowUser(targetUserId: string): Promise<void> {
   const [supabase, authProfile] = await Promise.all([createServerClient(), getAuthProfile()]);

   if (!authProfile) throw new Error('Not authenticated');

   const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', authProfile.id)
      .eq('following_id', targetUserId);

   if (error) throw error;
}
