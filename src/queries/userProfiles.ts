import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

interface UserProfilesQueryOptions {
   limit?: number;
   order?: 'asc' | 'desc';
}

export function userProfilesQuery(
   supabase: SupabaseClient<Database>,
   { limit, order }: UserProfilesQueryOptions,
) {
   return supabase
      .from('profiles')
      .select(`id, username, full_name, avatar_url`)
      .order('created_at', { ascending: order === 'asc' })
      .limit(limit ?? 10);
}

export type PostComments = QueryData<ReturnType<typeof userProfilesQuery>>;
export type PostComment = PostComments[number];
