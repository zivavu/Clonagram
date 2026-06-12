'use client';

import * as stylex from '@stylexjs/stylex';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { BiNotificationOff } from 'react-icons/bi';
import { useInView } from 'react-intersection-observer';
import { getHomeFeedPosts } from '@/src/actions/post/getHomeFeedPosts';
import { queryKeys } from '@/src/lib/queryKeys';
import HomepagePost from './HomepagePost';
import { styles } from './index.stylex';

export default function HomepageFeed({ variant }: { variant: 'home' | 'following' }) {
   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
      queryKey: queryKeys.homeFeed(variant),
      queryFn: ({ pageParam }) => getHomeFeedPosts(variant, pageParam),
      initialPageParam: null as string | null,
      getNextPageParam: lastPage => lastPage.nextCursor,
   });

   const { ref, inView } = useInView({ threshold: 0 });

   useEffect(() => {
      if (inView && hasNextPage && !isFetchingNextPage) {
         fetchNextPage();
      }
   }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

   const posts = data?.pages.flatMap(page => page.posts) ?? [];

   if (isLoading) {
      return <div {...stylex.props(styles.postsContainer)} />;
   }

   if (posts.length === 0) {
      return (
         <div {...stylex.props(styles.emptyState)}>
            <BiNotificationOff {...stylex.props(styles.emptyStateIcon)} />
            <span {...stylex.props(styles.emptyStateTitle)}>No posts yet</span>
            <span {...stylex.props(styles.emptyStateSubtitle)}>
               {variant === 'following'
                  ? 'Follow people to see their photos and videos here.'
                  : 'Be the first to share a photo or video.'}
            </span>
         </div>
      );
   }

   return (
      <>
         <div {...stylex.props(styles.postsContainer)}>
            {posts.map((post, index) => (
               <HomepagePost key={post.id} post={post} index={index} />
            ))}
         </div>
         <div ref={ref} />
         {isFetchingNextPage && <div {...stylex.props(styles.postsContainer)} />}
      </>
   );
}
