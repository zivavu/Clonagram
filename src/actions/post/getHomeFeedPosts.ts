'use server';
import 'server-only';
import { createServerClient } from '../../lib/supabase/server';
import type { PostsWithMedia } from '../../queries/posts';

const HOME_FEED_SELECT = `
    id, caption, created_at, aspect_ratio, hide_likes, location_name,
    likes(user_id),
    comments(count),
    user:profiles!user_id(id, username, avatar_url, is_private),
    collaborators:post_collaborators(user:profiles!user_id(id, username, avatar_url)),
    images:post_images(id, url, position, width, height, blur_data_url, alt_text, tags:post_image_tags(id, x, y, user:profiles!user_id(id, username, avatar_url))),
    videos:post_videos(id, mux_playback_id, duration, position, width, height)
 `;

export async function getHomeFeedPosts(variant: 'home' | 'following'): Promise<PostsWithMedia> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   if (variant === 'home') {
      const { data } = await supabase
         .from('posts')
         .select(HOME_FEED_SELECT)
         .order('created_at', { ascending: false })
         .limit(10);
      return (data ?? []) as PostsWithMedia;
   }

   if (!user) {
      return [];
   }

   const { data: followedData } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id);

   const followedIds = followedData?.map(f => f.following_id) ?? [];

   if (followedIds.length === 0) {
      return [];
   }

   const { data } = await supabase
      .from('posts')
      .select(HOME_FEED_SELECT)
      .in('user_id', followedIds)
      .order('created_at', { ascending: false })
      .limit(10);

   return (data ?? []) as PostsWithMedia;
}
