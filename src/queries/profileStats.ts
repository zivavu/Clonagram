import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export interface ProfileStats {
   followers: number;
   following: number;
}

export async function getProfileStats(
   supabase: SupabaseClient<Database>,
   targetUserId: string,
): Promise<ProfileStats> {
   const { data, error } = await supabase
      .from('profiles')
      .select(
         `followers:follows!following_id(count),
          following:follows!follower_id(count)`,
      )
      .eq('id', targetUserId)
      .single();

   if (error || !data) {
      return { followers: 0, following: 0 };
   }

   return {
      followers: (data.followers as { count: number }[])?.[0]?.count ?? 0,
      following: (data.following as { count: number }[])?.[0]?.count ?? 0,
   };
}
