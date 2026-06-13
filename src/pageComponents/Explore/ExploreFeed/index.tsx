'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { getExplorePosts } from '@/src/actions/post/getExplorePosts';
import { useInfiniteScrollSentinel } from '@/src/hooks/useInfiniteScrollSentinel';
import { queryKeys } from '@/src/lib/queryKeys';
import type { PostsWithMedia } from '@/src/queries/posts';
import ExploreGrid from '../ExploreGrid';

interface ExploreFeedProps {
   variant: 'for_you' | 'nonpersonalized';
   initialPosts: PostsWithMedia;
}

export default function ExploreFeed({ variant, initialPosts }: ExploreFeedProps) {
   const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
      queryKey: queryKeys.explore(variant),
      queryFn: ({ pageParam }) => getExplorePosts({ variant, cursor: pageParam }),
      initialPageParam: null as string | null,
      getNextPageParam: lastPage => lastPage.nextCursor,
      initialData: { pages: [{ posts: initialPosts, nextCursor: null }], pageParams: [null] },
   });

   const sentinelRef = useInfiniteScrollSentinel({
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
   });

   const posts = data?.pages.flatMap(page => page.posts) ?? [];

   return (
      <>
         <ExploreGrid posts={posts} />
         <div ref={sentinelRef} />
      </>
   );
}
