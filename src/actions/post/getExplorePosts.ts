'use server';
import 'server-only';
import { CursorSchema, validate } from '@/src/lib/validation';
import { createServerClient } from '../../lib/supabase/server';
import { throwIfError } from '../../lib/unwrap';
import type { PostsWithMedia } from '../../queries/posts';
import { POST_WITH_MEDIA_SELECT } from '../../queries/posts';
import { hideLikesForNonOwners } from '../../utils/posts';

export interface ExploreFeedPage {
   posts: PostsWithMedia;
   nextCursor: string | null;
}

const PAGE_SIZE = 45;

export async function getExplorePosts(params: {
   variant: 'for_you' | 'nonpersonalized';
   cursor?: string | null;
}): Promise<ExploreFeedPage> {
   const { variant, cursor } = validate(CursorSchema, params);
   const supabase = await createServerClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   let query = supabase
      .from('posts')
      .select(POST_WITH_MEDIA_SELECT)
      .order('created_at', { ascending: false });

   if (cursor) query = query.lt('created_at', cursor);

   if (!user) {
      const { data, error } = await query.limit(PAGE_SIZE);
      throwIfError({ error }, 'Failed to fetch explore feed');
      const posts = data ?? [];
      const nextCursor =
         posts.length === PAGE_SIZE ? (posts[posts.length - 1].created_at ?? null) : null;
      return { posts: hideLikesForNonOwners(posts, undefined), nextCursor };
   }

   query = query.eq('likes.user_id', user.id).eq('saves.user_id', user.id);

   const { data: followedData, error: followError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id);

   throwIfError({ error: followError }, 'Failed to fetch followed users');

   const followedIds = followedData?.map(f => f.following_id) ?? [];

   if (variant === 'for_you') {
      if (followedIds.length === 0) return { posts: [], nextCursor: null };
      query = query.in('user_id', followedIds);
   } else {
      const excludeIds = [user.id, ...followedIds];
      query = query.not('user_id', 'in', `(${excludeIds.join(',')})`);
   }

   const { data, error } = await query.limit(PAGE_SIZE);
   throwIfError({ error }, 'Failed to fetch explore feed');
   const posts = data ?? [];
   const nextCursor =
      posts.length === PAGE_SIZE ? (posts[posts.length - 1].created_at ?? null) : null;
   return { posts: hideLikesForNonOwners(posts, user.id), nextCursor };
}
