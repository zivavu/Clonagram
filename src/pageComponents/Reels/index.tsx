'use client';

import * as stylex from '@stylexjs/stylex';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getReelById } from '@/src/actions/post/getReelById';
import { getReels } from '@/src/actions/post/getReels';
import { queryKeys } from '@/src/lib/queryKeys';
import { REELS_PAGE_SIZE, type Reel } from '@/src/queries/posts';
import ReelItem from './components/ReelItem';
import ReelNavArrows from './components/ReelNavArrows';
import { styles } from './index.stylex';

export default function Reels() {
   const scrollerRef = useRef<HTMLDivElement>(null);
   const [openComments, setOpenComments] = useState<Reel | null>(null);
   const searchParams = useSearchParams();
   const initialId = searchParams.get('id');

   const { data: initialReel } = useQuery({
      queryKey: queryKeys.reelById(initialId ?? ''),
      queryFn: () => getReelById({ postId: initialId! }),
      enabled: !!initialId,
      staleTime: 60_000,
   });

   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
      queryKey: queryKeys.reels(),
      queryFn: async ({ pageParam }) => getReels({ cursor: pageParam }),
      initialPageParam: null as string | null,
      getNextPageParam: lastPage =>
         lastPage.length === REELS_PAGE_SIZE ? lastPage[lastPage.length - 1].created_at : null,
   });

   const feedReels = data?.pages.flat() ?? [];

   const reels = useMemo(() => {
      if (!initialReel) return feedReels;
      const withoutDuplicate = feedReels.filter(r => r.id !== initialReel.id);
      return [initialReel, ...withoutDuplicate];
   }, [initialReel, feedReels]);

   function scrollByItem(direction: 1 | -1) {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      scroller.scrollBy({ top: direction * scroller.clientHeight, behavior: 'smooth' });
   }

   useEffect(() => {
      function handleKey(e: KeyboardEvent) {
         const target = e.target as HTMLElement;
         if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
         if (e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            scrollByItem(1);
         } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            scrollByItem(-1);
         }
      }
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
      // biome-ignore lint/correctness/useExhaustiveDependencies: React Compiler stabilizes this function
   }, [scrollByItem]);

   function handleScroll() {
      setOpenComments(null);
      const scroller = scrollerRef.current;
      if (!scroller || !hasNextPage || isFetchingNextPage) return;
      const remaining = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
      if (remaining < scroller.clientHeight * 2) fetchNextPage();
   }

   return (
      <div {...stylex.props(styles.viewport)}>
         <div ref={scrollerRef} onScroll={handleScroll} {...stylex.props(styles.scroller)}>
            {isLoading ? (
               <p {...stylex.props(styles.loading)}>Loading reels…</p>
            ) : (
               reels.map(reel => (
                  <ReelItem
                     key={reel.id}
                     reel={reel}
                     isCommentsOpen={openComments?.id === reel.id}
                     onToggleComments={() => setOpenComments(prev => (prev === reel ? null : reel))}
                     onCloseComments={() => setOpenComments(null)}
                  />
               ))
            )}
         </div>
         <ReelNavArrows onUp={() => scrollByItem(-1)} onDown={() => scrollByItem(1)} />
      </div>
   );
}
