'use server';
import 'server-only';
import { createServerClient } from '../../lib/supabase/server';
import type { PostsWithMedia } from '../../queries/posts';

const EXPLORE_SELECT = `
    id, caption, created_at, aspect_ratio, hide_likes, comments_off, location_name,
    likes(user_id),
    saves(user_id),
    comments(count),
    user:profiles!user_id(id, username, avatar_url, is_private),
    collaborators:post_collaborators(user:profiles!user_id(id, username, avatar_url)),
    images:post_images(id, url, position, width, height, blur_data_url, alt_text, tags:post_image_tags(id, x, y, user:profiles!user_id(id, username, avatar_url))),
    videos:post_videos(id, mux_playback_id, duration, position, width, height)
 `;

export interface ExploreFeedPage {
   posts: PostsWithMedia;
   nextCursor: string | null;
}

const PAGE_SIZE = 45;

export async function getExplorePosts(
   variant: 'for_you' | 'nonpersonalized',
   cursor?: string | null,
): Promise<ExploreFeedPage> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   let query = supabase
      .from('posts')
      .select(EXPLORE_SELECT)
      .order('created_at', { ascending: false });

   if (cursor) query = query.lt('created_at', cursor);

   if (!user) {
      const { data, error } = await query.limit(PAGE_SIZE);
      if (error) throw new Error(`Failed to fetch explore feed: ${error.message}`);
      const posts = (data ?? []) as PostsWithMedia;
      const nextCursor =
         posts.length === PAGE_SIZE ? (posts[posts.length - 1].created_at ?? null) : null;
      return { posts, nextCursor };
   }

   const { data: followedData, error: followError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id);

   if (followError) throw new Error(`Failed to fetch followed users: ${followError.message}`);

   const followedIds = followedData?.map(f => f.following_id) ?? [];

   if (variant === 'for_you') {
      if (followedIds.length === 0) return { posts: [], nextCursor: null };
      query = query.in('user_id', followedIds);
   } else {
      const excludeIds = [user.id, ...followedIds];
      query = query.not('user_id', 'in', `(${excludeIds.join(',')})`);
   }

   const { data, error } = await query.limit(PAGE_SIZE);
   if (error) throw new Error(`Failed to fetch explore feed: ${error.message}`);
   const posts = (data ?? []) as PostsWithMedia;
   const nextCursor =
      posts.length === PAGE_SIZE ? (posts[posts.length - 1].created_at ?? null) : null;
   return { posts, nextCursor };
}
