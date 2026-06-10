'use server';
import 'server-only';
import { revalidatePath } from 'next/cache';
import { getAuthProfile } from '@/src/lib/supabase/getAuthProfile';
import { createServerClient } from '@/src/lib/supabase/server';

export async function followUser(targetUserId: string): Promise<void> {
   const supabase = await createServerClient();
   const authProfile = await getAuthProfile(supabase);

   if (!authProfile) throw new Error('Not authenticated');

   const { data: target, error: targetError } = await supabase
      .from('profiles')
      .select('is_private')
      .eq('id', targetUserId)
      .single();

   if (targetError || !target) throw new Error('User not found');

   if (target.is_private) {
      const { error } = await supabase
         .from('follow_requests')
         .insert({ requester_id: authProfile.id, target_id: targetUserId });
      if (error) throw error;
   } else {
      const { error } = await supabase
         .from('follows')
         .insert({ follower_id: authProfile.id, following_id: targetUserId });
      if (error) throw error;
   }

   revalidatePath('/profile/[username]', 'page');
}
