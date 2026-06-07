'use server';
import 'server-only';
import { createServerClient } from '../../lib/supabase/server';
import type { PostsWithMedia } from '../../queries/posts';

const EXPLORE_SELECT = `
   id, caption, created_at, aspect_ratio, hide_likes,
   likes(user_id),
   comments(count),
   user:profiles!user_id(id, username, avatar_url),
   images:post_images(id, url, position, width, height, blur_data_url, alt_text, tags:post_image_tags(id, x, y, user:profiles!user_id(id, username, avatar_url))),
   videos:post_videos(id, mux_playback_id, duration, position, width, height)
`;

export async function getExplorePosts(
   variant: 'for_you' | 'nonpersonalized',
): Promise<PostsWithMedia> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   if (!user) {
      const { data } = await supabase
         .from('posts')
         .select(EXPLORE_SELECT)
         .order('created_at', { ascending: false })
         .limit(45);
      return (data ?? []) as PostsWithMedia;
   }

   const { data: followedData } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id);

   const followedIds = followedData?.map(f => f.following_id) ?? [];

   if (variant === 'for_you') {
      if (followedIds.length === 0) return [];
      const { data } = await supabase
         .from('posts')
         .select(EXPLORE_SELECT)
         .in('user_id', followedIds)
         .order('created_at', { ascending: false })
         .limit(45);
      return (data ?? []) as PostsWithMedia;
   }

   const excludeIds = [user.id, ...followedIds];
   const { data } = await supabase
      .from('posts')
      .select(EXPLORE_SELECT)
      .not('user_id', 'in', `(${excludeIds.join(',')})`)
      .order('created_at', { ascending: false })
      .limit(45);
   return (data ?? []) as PostsWithMedia;
}
