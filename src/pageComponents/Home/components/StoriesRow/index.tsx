'use client';

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { MdExpandCircleDown } from 'react-icons/md';
import { STORIES } from '@/src/mocks/stories';
import { colors } from '../../../../styles/tokens.stylex';
import { styles } from './index.stylex';

// avatar width (74px) + ring padding (3px * 2) + ring inner padding (3px * 2) = 86, plus gap
const STORY_ITEM_WIDTH = 86 + 18;
const SCROLL_DURATION = 300;
const SCROLL_PAGES = 4;

function easeInOut(t: number): number {
   return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function StoriesRow() {
   const storiesRowRef = useRef<HTMLDivElement>(null);
   const [isScrolling, setIsScrolling] = useState(false);
   const [scrollLeft, setScrollLeft] = useState(0);
   const [scrollMax, setScrollMax] = useState(Infinity);
   const rafRef = useRef<number | null>(null);

   useEffect(() => {
      return () => {
         if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      };
   }, []);

   const handleScroll = () => {
      const el = storiesRowRef.current;
      if (!el) return;
      setScrollLeft(el.scrollLeft);
      setScrollMax(el.scrollWidth - el.clientWidth);
   };

   const scrollBy = (amount: number) => {
      if (isScrolling || !storiesRowRef.current) return;

      const el = storiesRowRef.current;
      const start = el.scrollLeft;
      const max = el.scrollWidth - el.clientWidth;
      const snapped = Math.round((start + amount) / STORY_ITEM_WIDTH) * STORY_ITEM_WIDTH;
      const target = Math.max(0, Math.min(snapped, max));

      if (target === start) return;

      const startTime = performance.now();
      setIsScrolling(true);

      const animate = (now: number) => {
         if (!storiesRowRef.current) return;
         const progress = Math.min((now - startTime) / SCROLL_DURATION, 1);
         storiesRowRef.current.scrollLeft = start + (target - start) * easeInOut(progress);
         if (progress < 1) {
            rafRef.current = requestAnimationFrame(animate);
         } else {
            setIsScrolling(false);
         }
      };

      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(animate);
   };

   const isFirst = scrollLeft === 0;
   const isLast = scrollLeft >= scrollMax;

   return (
      <div {...stylex.props(styles.root)}>
         <button
            {...stylex.props(styles.storiesRowButton, styles.storiesRowButtonLeft, isFirst && styles.hidden)}
            onClick={() => scrollBy(-STORY_ITEM_WIDTH * SCROLL_PAGES)}
            disabled={isScrolling}
         >
            <MdExpandCircleDown
               {...stylex.props(styles.navIcon, styles.navIconLeft)}
               style={{ color: colors.textPrimary }}
            />
         </button>
         <button
            {...stylex.props(styles.storiesRowButton, styles.storiesRowButtonRight, isLast && styles.hidden)}
            onClick={() => scrollBy(STORY_ITEM_WIDTH * SCROLL_PAGES)}
            disabled={isScrolling}
         >
            <MdExpandCircleDown {...stylex.props(styles.navIcon, styles.navIconRight)} />
         </button>
         <div {...stylex.props(styles.storiesRow)} ref={storiesRowRef} onScroll={handleScroll}>
            {STORIES.map((story, index) => {
               const { username, avatarUrl } = story;
               if (!avatarUrl) return null;

               return (
                  <Link href={`/stories/${username}`} key={username} {...stylex.props(styles.storyLink)}>
                     <div {...stylex.props(styles.storyItem)}>
                        <div {...stylex.props(styles.storyRing)}>
                           <div {...stylex.props(styles.storyRingInner)}>
                              <Image
                                 {...stylex.props(styles.storyAvatar)}
                                 src={avatarUrl}
                                 alt={username}
                                 width={74}
                                 height={74}
                                 preload={index < 6}
                                 loading={index < 6 ? 'eager' : 'lazy'}
                              />
                           </div>
                        </div>
                        <span {...stylex.props(styles.storyUsername)}>{username}</span>
                     </div>
                  </Link>
               );
            })}
         </div>
      </div>
   );
}
