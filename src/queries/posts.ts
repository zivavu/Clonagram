import type { QueryData, SupabaseClient } from '@supabase/supabase-js';
import { PROFILE_LIST_SELECT, PROFILE_LIST_SELECT_BADGES } from '@/src/lib/profileSelect';
import type { Database } from '@/src/types/database';
import { scopePostEngagementToUser } from '@/src/utils/posts';

export const POST_WITH_MEDIA_SELECT = `
   id, caption, created_at, aspect_ratio, hide_likes, comments_off, location_name,
   like_count, comment_count, repost_count,
   likes(user_id),
   saves(user_id),
   reposts(user_id),
   user:profiles!user_id(${PROFILE_LIST_SELECT_BADGES}),
   collaborators:post_collaborators(user:profiles!user_id(${PROFILE_LIST_SELECT})),
   images:post_images(id, url, position, width, height, blur_data_url, alt_text, unsplash_attribution, tags:post_image_tags(id, x, y, user:profiles!user_id(${PROFILE_LIST_SELECT}))),
    videos:post_videos(id, mux_playback_id, duration, position, width, height)
` as const;

export function postsWithMediaQuery(supabase: SupabaseClient<Database>) {
   return supabase
      .from('posts')
      .select(POST_WITH_MEDIA_SELECT)
      .lte('created_at', new Date().toISOString())
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
      .lte('created_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(3);
}

export type UserRecentPosts = QueryData<ReturnType<typeof userRecentPostsQuery>>;
export type UserRecentPost = UserRecentPosts[number];

export const REELS_PAGE_SIZE = 10;

export function reelsQuery(
   supabase: SupabaseClient<Database>,
   userId?: string,
   cursor?: string | null,
   hideAi?: boolean,
) {
   let query = supabase
      .from('posts')
      .select(
         `
            id, caption, created_at, aspect_ratio, hide_likes, comments_off,
            like_count, comment_count, repost_count, location_name,
            likes(user_id),
            saves(user_id),
            reposts(user_id),
            user:profiles!user_id(${PROFILE_LIST_SELECT_BADGES}),
            videos:post_videos(id, mux_playback_id, duration, position, width, height)
         `,
      )
      .eq('type', 'reel')
      .lte('created_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(REELS_PAGE_SIZE);

   if (hideAi) {
      query = query.eq('is_ai', false);
   }

   if (userId) {
      query = scopePostEngagementToUser(query, userId);
   }
   if (cursor) {
      query = query.lt('created_at', cursor);
   }

   return query;
}

export type Reels = QueryData<ReturnType<typeof reelsQuery>>;
export type Reel = Reels[number];

export function savedPostsQuery(
   supabase: SupabaseClient<Database>,
   userId: string,
   hideAi?: boolean,
) {
   let query = supabase
      .from('saves')
      .select(`post_id, post:posts!post_id(${POST_WITH_MEDIA_SELECT})`)
      .eq('user_id', userId)
      .eq('post.likes.user_id', userId)
      .eq('post.saves.user_id', userId)
      .eq('post.reposts.user_id', userId)
      .lte('post.created_at', new Date().toISOString())
      .order('created_at', { ascending: false });

   if (hideAi) {
      query = query.eq('post.is_ai', false);
   }

   return query;
}

export type SavedPosts = QueryData<ReturnType<typeof savedPostsQuery>>;
export type SavedPost = SavedPosts[number];
