import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export function postCommentsQuery(supabase: SupabaseClient<Database>, postId: string) {
   return supabase
      .from('comments')
      .select(
         `
         id, content, created_at, like_count, parent_id,
         user:profiles!user_id(id, username, avatar_url)
      `,
      )
      .eq('post_id', postId)
      .eq('is_deleted', false)
      .is('parent_id', null)
      .order('created_at', { ascending: true });
}

export type PostComments = QueryData<ReturnType<typeof postCommentsQuery>>;
export type PostComment = PostComments[number];
