import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export function postsWithMediaQuery(supabase: SupabaseClient<Database>) {
   return supabase
      .from('posts')
      .select(
         `
         id, caption, created_at, like_count, comment_count, aspect_ratio,
         user:profiles!user_id(id, username, avatar_url),
         images:post_images(id, url, position),
         videos:post_videos(id, mux_playback_id, duration, position)
      `,
      )
      .order('created_at', { ascending: false });
}

export type PostsWithMedia = QueryData<ReturnType<typeof postsWithMediaQuery>>;
export type PostWithMedia = PostsWithMedia[number];
