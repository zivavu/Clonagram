'use client';

import { STORIES } from '@/src/pageComponents/Stories/data';
import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import StoryCard from './components/StoryCard';
import StoryNavigationButton from './components/StoryNavigationButton';
import { DESKTOP_GAP, DESKTOP_SIDE_H, DESKTOP_SIDE_W, SWIPE_THRESHOLD } from './constants';
import { styles } from './styles';
import { Layout, StoriesPageProps } from './types';
import { computeLayout, formatTimestamp } from './utils';

export default function StoriesPage({ username, storyId }: StoriesPageProps) {
   const startIndex = Math.max(
      0,
      STORIES.findIndex(s => s.username === username),
   );

   const [currentStoryIndex] = useState(() => {
      if (!storyId) return 0;
      const storyIndex = STORIES[startIndex]?.stories.findIndex(el => el.id === storyId) ?? -1;
      return storyIndex >= 0 ? storyIndex : 0;
   });
   const [currentUserIndex, setCurrentUserIndex] = useState(startIndex);
   const [layout, setLayout] = useState<Layout>({
      mainWidth: DESKTOP_SIDE_W,
      mainHeight: DESKTOP_SIDE_H,
      sideWidth: DESKTOP_SIDE_W,
      sideHeight: DESKTOP_SIDE_H,
      gap: DESKTOP_GAP,
      xOffset: 0,
      isMobile: false,
   });
   const [isMoving, setIsMoving] = useState(false);

   const currentRef = useRef(startIndex);
   const spinTimer = useRef<ReturnType<typeof setTimeout>>(null);
   const touchStartX = useRef(0);
   const touchStartY = useRef(0);

   useLayoutEffect(() => {
      const apply = () => setLayout(computeLayout(currentRef.current));
      apply();
      window.addEventListener('resize', apply);
      return () => window.removeEventListener('resize', apply);
   }, []);

   const goTo = (raw: number) => {
      const idx = ((raw % STORIES.length) + STORIES.length) % STORIES.length;
      currentRef.current = idx;
      setCurrentUserIndex(idx);
      setLayout(computeLayout(idx));
      window.history.replaceState(null, '', `/stories/${STORIES[idx].username}`);
      setIsMoving(true);
      if (spinTimer.current) clearTimeout(spinTimer.current);
      spinTimer.current = setTimeout(() => setIsMoving(false), 380);
   };

   const onTouchStart = (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
   };

   const onTouchEnd = (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
         goTo(currentRef.current + (dx < 0 ? 1 : -1));
      }
   };

   return (
      <div {...stylex.props(styles.root)} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
         <Link href="/">
            <h1 {...stylex.props(styles.title)}>Clonagram</h1>
         </Link>

         <StoryNavigationButton
            onClick={() => goTo(currentUserIndex - 1)}
            left={`calc(50% - ${layout.mainWidth / 2 + 40}px)`}
            isMoving={isMoving}
            isLeft
         />
         <StoryNavigationButton
            onClick={() => goTo(currentUserIndex + 1)}
            left={`calc(50% + ${layout.mainWidth / 2 + 16}px)`}
            isMoving={isMoving}
         />

         <div
            {...stylex.props(styles.strip)}
            style={{ gap: `${layout.gap}px`, transform: `translateX(${layout.xOffset}px)` }}
         >
            {STORIES.map((story, i) => {
               const isCurrent = i === currentUserIndex;
               return (
                  <StoryCard
                     key={story.username}
                     story={story}
                     isCurrent={isCurrent}
                     layout={layout}
                     currentStoryIndex={currentStoryIndex}
                     onClick={() => goTo(i)}
                     formatTimestamp={formatTimestamp}
                  />
               );
            })}
         </div>
      </div>
   );
}
