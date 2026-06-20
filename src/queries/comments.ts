import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export function postCommentsQuery(
   supabase: SupabaseClient<Database>,
   postId: string,
   hideAi = false,
) {
   let query = supabase
      .from('comments')
      .select(
         `
          id, content, created_at, like_count, reply_count, parent_id, is_ai,
          user:profiles!user_id(id, username, avatar_url),
          comment_likes(user_id)
       `,
      )
      .eq('post_id', postId)
      .eq('is_deleted', false)
      .is('parent_id', null)
      .lte('created_at', new Date().toISOString())
      .order('created_at', { ascending: true });

   if (hideAi) {
      query = query.eq('is_ai', false);
   }

   return query;
}

export function commentRepliesQuery(
   supabase: SupabaseClient<Database>,
   parentId: string,
   hideAi = false,
) {
   let query = supabase
      .from('comments')
      .select(
         `
          id, content, created_at, like_count, reply_count, parent_id, is_ai,
          user:profiles!user_id(id, username, avatar_url),
          comment_likes(user_id)
       `,
      )
      .eq('parent_id', parentId)
      .eq('is_deleted', false)
      .lte('created_at', new Date().toISOString())
      .order('created_at', { ascending: true });

   if (hideAi) {
      query = query.eq('is_ai', false);
   }

   return query;
}

export async function fetchVisibleReplyCounts(
   supabase: SupabaseClient<Database>,
   parentIds: string[],
   hideAi = false,
) {
   const counts = new Map<string, number>();
   if (parentIds.length === 0) return counts;

   let query = supabase
      .from('comments')
      .select('parent_id')
      .in('parent_id', parentIds)
      .eq('is_deleted', false)
      .lte('created_at', new Date().toISOString());

   if (hideAi) {
      query = query.eq('is_ai', false);
   }

   const { data, error } = await query;
   if (error) throw error;

   for (const row of data ?? []) {
      if (row.parent_id) counts.set(row.parent_id, (counts.get(row.parent_id) ?? 0) + 1);
   }
   return counts;
}

export type PostComments = QueryData<ReturnType<typeof postCommentsQuery>>;
export type PostComment = PostComments[number];
