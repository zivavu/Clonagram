import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export function postCommentsQuery(supabase: SupabaseClient<Database>, postId: string) {
   return supabase
      .from('comments')
      .select(
         `
         id, content, created_at, like_count, reply_count, parent_id,
         user:profiles!user_id(id, username, avatar_url),
         comment_likes(user_id)
      `,
      )
      .eq('post_id', postId)
      .eq('is_deleted', false)
      .is('parent_id', null)
      .order('created_at', { ascending: true });
}

export function commentRepliesQuery(supabase: SupabaseClient<Database>, parentId: string) {
   return supabase
      .from('comments')
      .select(
         `
         id, content, created_at, like_count, reply_count, parent_id,
         user:profiles!user_id(id, username, avatar_url),
         comment_likes(user_id)
      `,
      )
      .eq('parent_id', parentId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });
}

export type PostComments = QueryData<ReturnType<typeof postCommentsQuery>>;
export type PostComment = PostComments[number];
