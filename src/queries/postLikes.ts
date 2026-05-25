import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export function postLikesQuery(supabase: SupabaseClient<Database>, postId: string) {
   return supabase
      .from('likes')
      .select(`created_at, post_id, user_id`)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
}

export type PostLikes = QueryData<ReturnType<typeof postLikesQuery>>;
export type PostLike = PostLikes[number];
