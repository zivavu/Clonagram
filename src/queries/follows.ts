import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export function followedUsersQuery(supabase: SupabaseClient<Database>, userId: string) {
   return supabase
      .from('follows')
      .select('user:profiles!following_id(id, username, full_name, avatar_url)')
      .eq('follower_id', userId);
}

export type FollowedUsers = QueryData<ReturnType<typeof followedUsersQuery>>;
