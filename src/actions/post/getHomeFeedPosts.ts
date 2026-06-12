'use server';
import 'server-only';
import { CursorSchema, validate } from '@/src/lib/validation';
import { createServerClient } from '../../lib/supabase/server';
import { throwIfError } from '../../lib/unwrap';
import type { PostsWithMedia } from '../../queries/posts';
import { POST_WITH_MEDIA_SELECT } from '../../queries/posts';
import { hideLikesForNonOwners } from '../../utils/posts';

const PAGE_SIZE = 10;

export interface HomeFeedPage {
   posts: PostsWithMedia;
   nextCursor: string | null;
}

export async function getHomeFeedPosts(params: {
   variant: 'home' | 'following';
   cursor?: string | null;
}): Promise<HomeFeedPage> {
   const { variant, cursor } = validate(CursorSchema, params);
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
      if (user) {
         query = query.eq('likes.user_id', user.id).eq('saves.user_id', user.id);
      }
      const { data, error } = await query;
      throwIfError({ error }, 'Failed to fetch home feed');
      const posts = data ?? [];
      const nextCursor =
         posts.length === PAGE_SIZE ? (posts[posts.length - 1].created_at ?? null) : null;
      return { posts: hideLikesForNonOwners(posts, user?.id), nextCursor };
   }

   if (!user) {
      return { posts: [], nextCursor: null };
   }

   const rpc = supabase.rpc as unknown as <T>(
      name: string,
      args: Record<string, unknown>,
   ) => Promise<{ data: T | null; error: { message: string } | null }>;
   const { data: postIds, error: rpcError } = await rpc<{ id: string; created_at: string }[]>(
      'get_following_posts',
      {
         follower_id: user.id,
         before_cursor: cursor,
         page_size: PAGE_SIZE,
      },
   );

   throwIfError({ error: rpcError }, 'Failed to fetch following feed');
   const ids = postIds as { id: string; created_at: string }[] | null;
   if (!ids || ids.length === 0) {
      return { posts: [], nextCursor: null };
   }

   const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select(POST_WITH_MEDIA_SELECT)
      .in(
         'id',
         ids.map(p => p.id),
      )
      .order('created_at', { ascending: false })
      .eq('likes.user_id', user.id)
      .eq('saves.user_id', user.id);

   throwIfError({ error: postsError }, 'Failed to fetch following feed');
   const safePosts = posts ?? [];
   const nextCursor =
      safePosts.length === PAGE_SIZE ? (ids[ids.length - 1].created_at ?? null) : null;
   return { posts: hideLikesForNonOwners(safePosts, user?.id), nextCursor };
}
