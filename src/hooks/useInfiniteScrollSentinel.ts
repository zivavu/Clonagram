'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseInfiniteScrollSentinelProps {
   hasNextPage: boolean;
   isFetchingNextPage: boolean;
   fetchNextPage: () => void;
}

export function useInfiniteScrollSentinel({
   hasNextPage,
   isFetchingNextPage,
   fetchNextPage,
}: UseInfiniteScrollSentinelProps) {
   const { ref, inView } = useInView({ threshold: 0 });

   useEffect(() => {
      if (inView && hasNextPage && !isFetchingNextPage) {
         fetchNextPage();
      }
   }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

   return ref;
}
