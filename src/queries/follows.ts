import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import { PROFILE_LIST_SELECT } from '@/src/lib/profileSelect';
import type { Database } from '@/src/types/database';

export function followedUsersQuery(supabase: SupabaseClient<Database>, userId: string) {
   return supabase
      .from('follows')
      .select(`user:profiles!following_id(${PROFILE_LIST_SELECT})`)
      .eq('follower_id', userId);
}

export type FollowedUsers = QueryData<ReturnType<typeof followedUsersQuery>>;
