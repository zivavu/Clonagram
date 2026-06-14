'use server';
import 'server-only';
import { CursorSchema, validate } from '@/src/lib/validation';
import { throwIfError } from '../../lib/unwrap';
import type { PostsWithMedia } from '../../queries/posts';
import { POST_WITH_MEDIA_SELECT } from '../../queries/posts';
import { hideLikesForNonOwners, nextCursorFrom, scopeLikesAndSavesToUser } from '../../utils/posts';
import { getOptionalUser } from '../getAuthUser';

const PAGE_SIZE = 10;

export interface HomeFeedPage {
   posts: PostsWithMedia;
   nextCursor: string | null;
}

export async function getHomeFeedPosts(params: {
   variant: 'home' | 'following';
   cursor?: string | null;
}) {
   const { variant, cursor } = validate(CursorSchema, params);
   const { supabase, user } = await getOptionalUser();

   if (variant === 'home') {
      let query = supabase
         .from('posts')
         .select(POST_WITH_MEDIA_SELECT)
         .lte('created_at', new Date().toISOString())
         .order('created_at', { ascending: false })
         .limit(PAGE_SIZE);
      if (cursor) query = query.lt('created_at', cursor);
      if (user) {
         query = scopeLikesAndSavesToUser(query, user.id);
      }
      const { data, error } = await query;
      throwIfError({ error }, 'Failed to fetch home feed');
      const posts = data ?? [];
      return {
         posts: hideLikesForNonOwners(posts, user?.id),
         nextCursor: nextCursorFrom(posts, PAGE_SIZE),
      };
   }

   if (!user) {
      return { posts: [], nextCursor: null };
   }

   const { data: postIds, error: rpcError } = await supabase.rpc('get_following_posts', {
      follower_id: user.id,
      before_cursor: cursor ?? undefined,
      page_size: PAGE_SIZE,
   });

   throwIfError({ error: rpcError }, 'Failed to fetch following feed');
   if (!postIds || postIds.length === 0) {
      return { posts: [], nextCursor: null };
   }

   let postsQuery = supabase
      .from('posts')
      .select(POST_WITH_MEDIA_SELECT)
      .in(
         'id',
         postIds.map(p => p.id),
      )
      .lte('created_at', new Date().toISOString())
      .order('created_at', { ascending: false });
   postsQuery = scopeLikesAndSavesToUser(postsQuery, user.id);
   const { data: posts, error: postsError } = await postsQuery;

   throwIfError({ error: postsError }, 'Failed to fetch following feed');
   const safePosts = posts ?? [];
   const nextCursor = nextCursorFrom(postIds, PAGE_SIZE);
   return { posts: hideLikesForNonOwners(safePosts, user?.id), nextCursor };
}
