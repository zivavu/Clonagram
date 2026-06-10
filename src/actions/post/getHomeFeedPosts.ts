'use server';
import 'server-only';
import { createServerClient } from '../../lib/supabase/server';
import type { PostsWithMedia } from '../../queries/posts';
import { POST_WITH_MEDIA_SELECT } from '../../queries/posts';

const PAGE_SIZE = 10;

export interface HomeFeedPage {
   posts: PostsWithMedia;
   nextCursor: string | null;
}

export async function getHomeFeedPosts(
   variant: 'home' | 'following',
   cursor?: string | null,
): Promise<HomeFeedPage> {
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   if (variant === 'home') {
      let query = supabase
         .from('posts')
         .select(POST_WITH_MEDIA_SELECT)
         .order('created_at', { ascending: false })
         .limit(PAGE_SIZE);
      if (cursor) query = query.lt('created_at', cursor);
      const { data, error } = await query;
      if (error) throw new Error(`Failed to fetch home feed: ${error.message}`);
      const posts = data ?? [];
      const nextCursor =
         posts.length === PAGE_SIZE ? (posts[posts.length - 1].created_at ?? null) : null;
      return { posts, nextCursor };
   }

   if (!user) {
      return { posts: [], nextCursor: null };
   }

   const { data: followedData, error: followError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id);

   if (followError) throw new Error(`Failed to fetch followed users: ${followError.message}`);

   const followedIds = followedData?.map(f => f.following_id) ?? [];

   if (followedIds.length === 0) {
      return { posts: [], nextCursor: null };
   }

   let query = supabase
      .from('posts')
      .select(POST_WITH_MEDIA_SELECT)
      .in('user_id', followedIds)
      .order('created_at', { ascending: false })
      .limit(PAGE_SIZE);
   if (cursor) query = query.lt('created_at', cursor);

   const { data, error: postsError } = await query;

   if (postsError) throw new Error(`Failed to fetch following feed: ${postsError.message}`);
   const posts = data ?? [];
   const nextCursor =
      posts.length === PAGE_SIZE ? (posts[posts.length - 1].created_at ?? null) : null;
   return { posts, nextCursor };
}
