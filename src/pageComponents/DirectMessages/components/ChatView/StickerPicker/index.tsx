'use client';

import { type DotLottie, DotLottieReact } from '@lottiefiles/dotlottie-react';
import * as Popover from '@radix-ui/react-popover';
import * as stylex from '@stylexjs/stylex';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { LuSticker } from 'react-icons/lu';
import { queryKeys } from '@/src/lib/queryKeys';
import {
   fetchFeaturedAnimations,
   type LottieAnimation,
   searchAnimations,
} from '@/src/utils/lottieApi';
import { styles as inputStyles } from '../../../index.stylex';
import { styles } from './index.stylex';

function StickerCell({
   anim,
   onSelect,
}: {
   anim: LottieAnimation;
   onSelect: (url: string) => void;
}) {
   const lottieRef = useRef<DotLottie | null>(null);
   return (
      <button
         type="button"
         {...stylex.props(styles.cell)}
         onClick={() => onSelect(anim.jsonUrl)}
         onMouseEnter={() => lottieRef.current?.play()}
         onMouseLeave={() => lottieRef.current?.pause()}
      >
         <DotLottieReact
            src={anim.jsonUrl}
            dotLottieRefCallback={ref => {
               lottieRef.current = ref;
            }}
            style={{ width: '100%', height: '100%' }}
         />
      </button>
   );
}

interface StickerPickerProps {
   onSelect: (url: string) => void;
}

async function fetchStickers(query: string): Promise<LottieAnimation[]> {
   const trimmed = query.trim();
   if (!trimmed) return fetchFeaturedAnimations();
   return searchAnimations(trimmed);
}

export default function StickerPicker({ onSelect }: StickerPickerProps) {
   const [query, setQuery] = useState('');
   const [debouncedQuery, setDebouncedQuery] = useState('');

   useEffect(() => {
      const timer = setTimeout(() => setDebouncedQuery(query), 350);
      return () => clearTimeout(timer);
   }, [query]);

   const { data: animations = [], isLoading } = useQuery({
      queryKey: queryKeys.stickers(debouncedQuery),
      queryFn: () => fetchStickers(debouncedQuery),
      staleTime: 5 * 60 * 1000,
   });

   return (
      <Popover.Root>
         <Popover.Trigger asChild>
            <LuSticker {...stylex.props(inputStyles.inputIcon)} />
         </Popover.Trigger>
         <Popover.Portal>
            <Popover.Content side="top" sideOffset={8} align="end">
               <div {...stylex.props(styles.popover)}>
                  <div {...stylex.props(styles.searchWrapper)}>
                     <input
                        {...stylex.props(styles.searchInput)}
                        placeholder="Search stickers..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                     />
                  </div>
                  <div {...stylex.props(styles.grid)}>
                     {!isLoading && animations.length === 0 && (
                        <span {...stylex.props(styles.empty)}>No stickers found</span>
                     )}
                     {animations.map(anim => (
                        <StickerCell
                           key={anim.id}
                           anim={anim}
                           onSelect={url => {
                              onSelect(url);
                           }}
                        />
                     ))}
                  </div>
               </div>
            </Popover.Content>
         </Popover.Portal>
      </Popover.Root>
   );
}
