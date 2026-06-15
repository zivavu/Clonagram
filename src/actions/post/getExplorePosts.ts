'use server';
import 'server-only';
import { getHideAiContent } from '@/src/lib/getHideAiContent';
import { CursorSchema, validate } from '@/src/lib/validation';
import { throwIfError } from '../../lib/unwrap';
import type { PostsWithMedia } from '../../queries/posts';
import { POST_WITH_MEDIA_SELECT } from '../../queries/posts';
import { hideLikesForNonOwners, nextCursorFrom, scopeLikesAndSavesToUser } from '../../utils/posts';
import { getOptionalUser } from '../getAuthUser';

export interface ExploreFeedPage {
   posts: PostsWithMedia;
   nextCursor: string | null;
}

const PAGE_SIZE = 45;

export async function getExplorePosts(params: {
   variant: 'for_you' | 'nonpersonalized';
   cursor?: string | null;
}) {
   const { variant, cursor } = validate(CursorSchema, params);
   const { supabase, user } = await getOptionalUser();
   const hideAi = user ? await getHideAiContent(supabase) : false;

   let query = supabase
      .from('posts')
      .select(POST_WITH_MEDIA_SELECT)
      .lte('created_at', new Date().toISOString())
      .order('created_at', { ascending: false });

   if (cursor) query = query.lt('created_at', cursor);
   if (hideAi) query = query.eq('is_ai', false);

   if (!user) {
      const { data, error } = await query.limit(PAGE_SIZE);
      throwIfError({ error }, 'Failed to fetch explore feed');
      const posts = data ?? [];
      return {
         posts: hideLikesForNonOwners(posts, undefined),
         nextCursor: nextCursorFrom(posts, PAGE_SIZE),
      };
   }

   query = scopeLikesAndSavesToUser(query, user.id);

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
   return {
      posts: hideLikesForNonOwners(posts, user.id),
      nextCursor: nextCursorFrom(posts, PAGE_SIZE),
   };
}
