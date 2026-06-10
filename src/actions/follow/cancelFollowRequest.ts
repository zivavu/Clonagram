'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function cancelFollowRequest(targetUserId: string): Promise<void> {
   const supabase = await createServerClient();
   const authProfile = await getAuthProfile(supabase);

   if (!authProfile) throw new Error('Not authenticated');

   const { error } = await supabase
      .from('follow_requests')
      .delete()
      .eq('requester_id', authProfile.id)
      .eq('target_id', targetUserId);

   if (error) throw error;

   revalidatePath('/profile/[username]', 'page');
}
