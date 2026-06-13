'use client';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { recordStoryView } from '@/src/actions/story/recordStoryView';
import EditHighlightStoriesModal from '../../components/EditHighlightStoriesModal';
import HighlightActionsModal from '../../components/HighlightActionsModal';
import StoryCard from './components/StoryCard';
import StoryNavigationButton from './components/StoryNavigationButton';
import { DESKTOP_GAP, DESKTOP_SIDE_H, DESKTOP_SIDE_W, SWIPE_THRESHOLD } from './constants';
import { styles } from './index.stylex';
import type { Layout, StoriesPageProps } from './types';
import { computeLayout } from './utils';

export default function StoriesPage({
   startSlug,
   basePath,
   showReply = true,
   closeHref = '/',
   showHighlightActions = false,
   entries,
   viewedStoryIds,
   reactedStoryIds,
   currentUserId = null,
}: StoriesPageProps) {
   const startIndex = Math.max(
      0,
      entries.findIndex(s => s.slug === startSlug),
   );

   const [currentUserIndex, setCurrentUserIndex] = useState(startIndex);
   const [currentStoryMediaIndex, setCurrentStoryMediaIndex] = useState(0);
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
   const [ready, setReady] = useState(false);

   const currentUserIndexRef = useRef(startIndex);
   const spinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
   const touchStartX = useRef(0);
   const touchStartY = useRef(0);
   const recordedSet = useRef(new Set<string>(viewedStoryIds));

   const recordView = (userIdx: number, mediaIdx: number) => {
      const entry = entries[userIdx];
      if (!entry) return;
      const storyId = entry.stories[mediaIdx]?.storyId;
      if (!storyId) return;
      if (recordedSet.current.has(storyId)) return;
      recordedSet.current.add(storyId);
      recordStoryView(storyId).catch(() => {});
   };

   useLayoutEffect(() => {
      const entry = entries[startIndex];
      const storyId = entry?.stories[0]?.storyId;
      if (storyId && !recordedSet.current.has(storyId)) {
         recordedSet.current.add(storyId);
         recordStoryView(storyId).catch(() => {});
      }
   }, [entries, startIndex]);

   useLayoutEffect(() => {
      const apply = () => setLayout(computeLayout(currentUserIndexRef.current));
      apply();
      setReady(true);
      window.addEventListener('resize', apply);
      return () => window.removeEventListener('resize', apply);
   }, []);

   const goToStoryUserCard = (newUserIndex: number) => {
      const index = ((newUserIndex % entries.length) + entries.length) % entries.length;
      currentUserIndexRef.current = index;
      setCurrentUserIndex(index);
      setCurrentStoryMediaIndex(0);
      setLayout(computeLayout(index));
      window.history.replaceState(null, '', `${basePath}/${entries[index].slug}`);
      setIsMoving(true);
      recordView(index, 0);
      if (spinTimerRef.current) clearTimeout(spinTimerRef.current);
      spinTimerRef.current = setTimeout(() => setIsMoving(false), 380);
   };

   const goToNextStoryMedia = () => {
      const entry = entries[currentUserIndex];
      if (currentStoryMediaIndex < entry.stories.length - 1) {
         const nextIdx = currentStoryMediaIndex + 1;
         setCurrentStoryMediaIndex(nextIdx);
         recordView(currentUserIndex, nextIdx);
      } else {
         goToStoryUserCard(currentUserIndex + 1);
      }
   };

   const goToPreviousStoryMedia = () => {
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
      } else if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
         const target = e.target as HTMLElement;
         if (target.closest('button, a, input, textarea')) return;
         if (e.changedTouches[0].clientX < window.innerWidth / 2) {
            goToPreviousStoryMedia();
         } else {
            goToNextStoryMedia();
         }
      }
   };

   return (
      <div {...stylex.props(styles.root)} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
         <Link href="/" {...stylex.props(styles.titleLink)}>
            <h1 {...stylex.props(styles.titleLinkText)}>Clonagram</h1>
         </Link>
         <Link href={closeHref} {...stylex.props(styles.closeLink)}>
            <MdClose size={38} />
         </Link>
         {showHighlightActions && <HighlightActionsModal />}
         {showHighlightActions && <EditHighlightStoriesModal />}
         {ready && (
            <>
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
                  {entries.map((entry, i) => (
                     <StoryCard
                        key={entry.slug}
                        story={entry}
                        isCurrent={i === currentUserIndex}
                        layout={layout}
                        onClick={() => goToStoryUserCard(i)}
                        currentStoryMediaIndex={currentStoryMediaIndex}
                        goToNextStoryMedia={goToNextStoryMedia}
                        closeHref={closeHref}
                        showReply={showReply}
                        showHighlightActions={showHighlightActions}
                        currentUserId={currentUserId}
                        reactedStoryIds={reactedStoryIds}
                     />
                  ))}
               </div>
            </>
         )}
      </div>
   );
}
