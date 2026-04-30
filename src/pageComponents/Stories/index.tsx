'use client';

import { CloseRounded } from '@mui/icons-material';
import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import { STORIES } from '@/src/pageComponents/Stories/data';
import StoryCard from './components/StoryCard';
import StoryNavigationButton from './components/StoryNavigationButton';
import { DESKTOP_GAP, DESKTOP_SIDE_H, DESKTOP_SIDE_W, SWIPE_THRESHOLD } from './constants';
import { styles } from './styles';
import type { Layout, StoriesPageProps } from './types';
import { computeLayout } from './utils';

export default function StoriesPage({ username }: StoriesPageProps) {
   const startIndex = Math.max(
      0,
      STORIES.findIndex(s => s.username === username),
   );

   const [currentUserIndex, setCurrentUserIndex] = useState(startIndex);
   const [currentStoryMediaIndex, setCurrentStoryMediaIndex] = useState(0);
   const [playTime, setPlayTime] = useState(0);

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

   // Ref mirrors state so resize/touch handlers always read the latest index
   // without creating stale closures via the event listener.
   const currentUserIndexRef = useRef(startIndex);
   const spinTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
   const touchStartX = useRef(0);
   const touchStartY = useRef(0);

   useLayoutEffect(() => {
      const apply = () => setLayout(computeLayout(currentUserIndexRef.current));
      apply();
      window.addEventListener('resize', apply);
      return () => window.removeEventListener('resize', apply);
   }, []);

   const goToStoryUserCard = (newUserIndex: number) => {
      const idx = ((newUserIndex % STORIES.length) + STORIES.length) % STORIES.length;
      currentUserIndexRef.current = idx;
      setCurrentUserIndex(idx);
      setCurrentStoryMediaIndex(0);
      setPlayTime(0);
      setLayout(computeLayout(idx));
      window.history.replaceState(null, '', `/stories/${STORIES[idx].username}`);
      setIsMoving(true);
      if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
      spinTimerRef.current = setTimeout(() => setIsMoving(false), 380);
   };

   const goToNextStoryMedia = () => {
      setPlayTime(0);
      if (currentStoryMediaIndex < STORIES[currentUserIndex].stories.length - 1) {
         setCurrentStoryMediaIndex(prev => prev + 1);
      } else {
         goToStoryUserCard(currentUserIndex + 1);
      }
   };

   const goToPreviousStoryMedia = () => {
      setPlayTime(0);
      if (currentStoryMediaIndex > 0) {
         setCurrentStoryMediaIndex(prev => prev - 1);
      } else {
         goToStoryUserCard(currentUserIndex - 1);
      }
   };

   const onTouchStart = (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
   };

   const onTouchEnd = (e: React.TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
         goToStoryUserCard(currentUserIndexRef.current + (dx < 0 ? 1 : -1));
      }
   };

   return (
      <div {...stylex.props(styles.root)} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
         <Link href="/" {...stylex.props(styles.titleLink)}>
            <h1 {...stylex.props(styles.titleLinkText)}>Clonagram</h1>
         </Link>
         <Link href="/" {...stylex.props(styles.closeLink)}>
            <CloseRounded style={{ fontSize: 38 }} />
         </Link>
         <StoryNavigationButton
            onClick={goToPreviousStoryMedia}
            left={`calc(50% - ${layout.mainWidth / 2 + 40}px)`}
            isMoving={isMoving}
            isLeft
         />
         <StoryNavigationButton
            onClick={goToNextStoryMedia}
            left={`calc(50% + ${layout.mainWidth / 2 + 16}px)`}
            isMoving={isMoving}
         />

         <div
            {...stylex.props(styles.strip)}
            style={{ gap: `${layout.gap}px`, transform: `translateX(${layout.xOffset}px)` }}
         >
            {STORIES.map((story, i) => (
               <StoryCard
                  key={story.username}
                  story={story}
                  isCurrent={i === currentUserIndex}
                  layout={layout}
                  onClick={() => goToStoryUserCard(i)}
                  currentStoryMediaIndex={currentStoryMediaIndex}
                  playTime={playTime}
                  setPlayTime={setPlayTime}
                  goToNextStoryMedia={goToNextStoryMedia}
               />
            ))}
         </div>
      </div>
   );
}
