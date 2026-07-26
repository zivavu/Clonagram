'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const SCROLL_DOWN_ROOT_MARGIN = '0px 0px 1500px 0px';

interface UseInfiniteScrollSentinelProps {
   hasNextPage: boolean;
   isFetchingNextPage: boolean;
   fetchNextPage: () => void;
   rootMargin?: string;
}

export function useInfiniteScrollSentinel({
   hasNextPage,
   isFetchingNextPage,
   fetchNextPage,
   rootMargin = SCROLL_DOWN_ROOT_MARGIN,
}: UseInfiniteScrollSentinelProps) {
   const { ref, inView } = useInView({ threshold: 0, rootMargin });

   useEffect(() => {
      if (inView && hasNextPage && !isFetchingNextPage) {
         fetchNextPage();
      }
   }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

   return ref;
}
