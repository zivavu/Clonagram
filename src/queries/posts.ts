import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/src/types/database';

export function postsWithMediaQuery(supabase: SupabaseClient<Database>) {
   return supabase
      .from('posts')
      .select(
         `
         id, caption, created_at, aspect_ratio, hide_likes,
         likes(user_id),
         comments(count),
         user:profiles!user_id(id, username, avatar_url),
         images:post_images(id, url, position, width, height, blur_data_url),
         videos:post_videos(id, mux_playback_id, duration, position, width, height)
      `,
      )
      .order('created_at', { ascending: false })
      .limit(10);
}

export type PostsWithMedia = QueryData<ReturnType<typeof postsWithMediaQuery>>;
export type PostWithMedia = PostsWithMedia[number];

export function userRecentPostsQuery(supabase: SupabaseClient<Database>, userId: string) {
   return supabase
      .from('posts')
      .select(
         'id, images:post_images(url, position), videos:post_videos(mux_playback_id, position)',
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3);
}

export type UserRecentPosts = QueryData<ReturnType<typeof userRecentPostsQuery>>;
export type UserRecentPost = UserRecentPosts[number];

export function reelsQuery(supabase: SupabaseClient<Database>) {
   return supabase
      .from('posts')
      .select(
         `
         id, caption, created_at, aspect_ratio, hide_likes, comments_off,
         like_count, comment_count, location_name,
         likes(user_id),
         user:profiles!user_id(id, username, avatar_url, is_verified),
         videos:post_videos(id, mux_playback_id, duration, position, width, height)
      `,
      )
      .eq('type', 'reel')
      .order('created_at', { ascending: false })
      .limit(5);
}

export type Reels = QueryData<ReturnType<typeof reelsQuery>>;
export type Reel = Reels[number];
