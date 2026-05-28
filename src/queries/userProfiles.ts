import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

interface UserProfilesQueryOptions {
   limit?: number;
   order?: 'asc' | 'desc';
   search?: string;
}

export function userProfilesQuery(
   supabase: SupabaseClient<Database>,
   { limit, order, search }: UserProfilesQueryOptions,
) {
   let q = supabase
      .from('profiles')
      .select(`id, username, full_name, avatar_url`)
      .order('created_at', { ascending: order === 'asc' })
      .limit(limit ?? 10);

   if (search) {
      q = q.or(`username.ilike.%${search}%,full_name.ilike.%${search}%`);
   }

   return q;
}

export type UserProfiles = QueryData<ReturnType<typeof userProfilesQuery>>;
export type UserProfile = UserProfiles[number];

export function userProfileCardQuery(supabase: SupabaseClient<Database>, userId: string) {
   return supabase
      .from('profiles')
      .select(
         `id, username, full_name, avatar_url,
         followers:follows!following_id(count),
         following:follows!follower_id(count),
         posts(count)`,
      )
      .eq('id', userId)
      .single();
}

export type UserProfileCard = QueryData<ReturnType<typeof userProfileCardQuery>>;
