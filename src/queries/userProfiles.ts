import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import { PROFILE_LIST_SELECT } from '@/src/lib/profileSelect';
import type { Database } from '@/src/types/database';

interface UserProfilesQueryOptions {
   limit?: number;
   order?: 'asc' | 'desc';
   search?: string;
   excludeId?: string;
}

export function userProfilesQuery(
   supabase: SupabaseClient<Database>,
   { limit, order, search, excludeId }: UserProfilesQueryOptions,
) {
   let q = supabase
      .from('profiles')
      .select(`${PROFILE_LIST_SELECT}, is_private`)
      .order('created_at', { ascending: order === 'asc' })
      .limit(limit ?? 10);

   if (search) {
      q = q.or(`username.ilike.%${search}%,full_name.ilike.%${search}%`);
   }

   if (excludeId) {
      q = q.neq('id', excludeId);
   }

   return q;
}

export type UserProfiles = QueryData<ReturnType<typeof userProfilesQuery>>;
export type UserProfile = UserProfiles[number];

export function userProfileCardQuery(supabase: SupabaseClient<Database>, userId: string) {
   return supabase
      .from('profiles')
      .select(
         `${PROFILE_LIST_SELECT}, is_private,
         followers:follows!following_id(count),
         following:follows!follower_id(count),
         posts!posts_user_id_fkey(count)`,
      )
      .eq('id', userId)
      .single();
}

export type UserProfileCard = QueryData<ReturnType<typeof userProfileCardQuery>>;
