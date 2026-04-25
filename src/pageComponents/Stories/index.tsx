'use client';

import { STORIES } from '@/src/pageComponents/Home/components/data';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import { colors, radius } from '../../styles/tokens.stylex';

const DESKTOP_SIDE_W = 205;
const DESKTOP_SIDE_H = Math.round((DESKTOP_SIDE_W * 16) / 9);
const DESKTOP_GAP = 58;
const MOBILE_BP = 640;
const SWIPE_THRESHOLD = 40;

interface Layout {
   mainWidth: number;
   mainHeight: number;
   sideWidth: number;
   sideHeight: number;
   gap: number;
   xOffset: number;
   isMobile: boolean;
}

function computeLayout(index: number): Layout {
   const vw = window.innerWidth;
   const vh = window.innerHeight;

   if (vw < MOBILE_BP) {
      const mainW = vw;
      const mainH = Math.round((mainW * 16) / 9);
      return {
         mainWidth: mainW,
         mainHeight: mainH,
         sideWidth: mainW,
         sideHeight: mainH,
         gap: 0,
         xOffset: -index * mainW,
         isMobile: true,
      };
   }

   const mainH = Math.round(vh * 0.94);
   const mainW = Math.round((mainH * 9) / 16);
   return {
      mainWidth: mainW,
      mainHeight: mainH,
      sideWidth: DESKTOP_SIDE_W,
      sideHeight: DESKTOP_SIDE_H,
      gap: DESKTOP_GAP,
      xOffset: vw / 2 - index * (DESKTOP_SIDE_W + DESKTOP_GAP) - mainW / 2,
      isMobile: false,
   };
}

const styles = stylex.create({
   root: {
      position: 'relative',
      height: '100svh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
   },
   title: {
      position: 'absolute',
      top: '8px',
      left: '16px',
      zIndex: 10,
      fontFamily: 'var(--font-grand-hotel)',
      fontWeight: '200',
   },
   strip: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      willChange: 'transform',
      transition: 'transform 380ms cubic-bezier(0.4, 0, 0.2, 1)',
   },
   story: {
      position: 'relative',
      flexShrink: 0,
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'width 380ms cubic-bezier(0.4, 0, 0.2, 1), height 380ms cubic-bezier(0.4, 0, 0.2, 1)',
   },
   storyRounded: {
      borderRadius: radius.md,
   },
   sideStoryOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(38, 38, 38, 0.7)',
      zIndex: 1,
   },
   sideStoryUsername: {
      fontSize: '0.85rem',
      fontWeight: 600,
      color: colors.textPrimary,
      marginTop: 8,
   },
   sideStoryTimestamp: {
      fontSize: '0.85rem',
      fontWeight: 300,
      marginTop: 4,
   },
   navBtn: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,
      display: 'flex',
      padding: '0',
      transition: 'left 380ms cubic-bezier(0.4, 0, 0.2, 1), opacity 150ms ease',
      '@media (hover: none)': {
         display: 'none',
      },
   },
   navBtnHidden: {
      opacity: 0,
      pointerEvents: 'none',
   },
   navIcon: {
      stroke: colors.textMuted,
      fill: colors.textMuted,
      strokeWidth: 0.5,
      transition: 'all 0.2s ease-in-out',
      ':hover': {
         stroke: colors.textPrimary,
         fill: colors.textPrimary,
         scale: 1.05,
      },
   },
   navIconLeft: { transform: 'rotate(180deg)' },
});

const CARRET_ICON_PATH =
   'M12.005.503a11.5 11.5 0 1 0 11.5 11.5 11.513 11.513 0 0 0-11.5-11.5Zm3.707 12.22-4.5 4.488A1 1 0 0 1 9.8 15.795l3.792-3.783L9.798 8.21a1 1 0 1 1 1.416-1.412l4.5 4.511a1 1 0 0 1-.002 1.414Z';

interface StoriesPageProps {
   username: string;
   storyId: string | null;
}

export default function StoriesPage({ username }: StoriesPageProps) {
   const startIndex = Math.max(
      0,
      STORIES.findIndex(s => s.username === username),
   );

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
   const [isSpinning, setIsSpinning] = useState(false);

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
      setIsSpinning(true);
      if (spinTimer.current) clearTimeout(spinTimer.current);
      spinTimer.current = setTimeout(() => setIsSpinning(false), 380);
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

   const formatTimestamp = (timestamp: string): string => {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return '';

      const diff = Date.now() - date.getTime();
      const MINUTE = 60_000;
      const units: [number, string][] = [
         [365 * 24 * 60 * MINUTE, 'y'],
         [30 * 24 * 60 * MINUTE, 'mo'],
         [7 * 24 * 60 * MINUTE, 'w'],
         [24 * 60 * MINUTE, 'd'],
         [60 * MINUTE, 'h'],
         [MINUTE, 'm'],
      ];

      for (const [ms, label] of units) {
         if (diff >= ms) return `${Math.floor(diff / ms)}${label}`;
      }
      return 'just now';
   };

   return (
      <div {...stylex.props(styles.root)} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
         <Link href="/">
            <h1 {...stylex.props(styles.title)}>Clonagram</h1>
         </Link>

         <button
            onClick={() => goTo(currentUserIndex - 1)}
            {...stylex.props(styles.navBtn, isSpinning && styles.navBtnHidden)}
            style={{ left: `calc(50% - ${layout.mainWidth / 2 + 40}px)` }}
         >
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="24"
               height="24"
               viewBox="0 0 24 24"
               {...stylex.props(styles.navIcon, styles.navIconLeft)}
            >
               <path d={CARRET_ICON_PATH} />
            </svg>
         </button>

         <button
            onClick={() => goTo(currentUserIndex + 1)}
            {...stylex.props(styles.navBtn, isSpinning && styles.navBtnHidden)}
            style={{ left: `calc(50% + ${layout.mainWidth / 2 + 16}px)` }}
         >
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="24"
               height="24"
               viewBox="0 0 24 24"
               {...stylex.props(styles.navIcon)}
            >
               <path d={CARRET_ICON_PATH} />
            </svg>
         </button>

         <div
            {...stylex.props(styles.strip)}
            style={{ gap: `${layout.gap}px`, transform: `translateX(${layout.xOffset}px)` }}
         >
            {STORIES.map((story, i) => {
               const isCurrent = i === currentUserIndex;
               return (
                  <div
                     key={story.username}
                     {...stylex.props(styles.story, !layout.isMobile && styles.storyRounded)}
                     style={{
                        width: `${isCurrent ? layout.mainWidth : layout.sideWidth}px`,
                        height: `${isCurrent ? layout.mainHeight : layout.sideHeight}px`,
                     }}
                     onClick={() => goTo(i)}
                  >
                     {!isCurrent && (
                        <div {...stylex.props(styles.sideStoryOverlay)}>
                           <Image
                              src={story.avatarUrl}
                              alt={story.username}
                              width={64}
                              height={64}
                              loading="eager"
                              style={{ borderRadius: '50%' }}
                           />
                           <span {...stylex.props(styles.sideStoryUsername)}>{story.username}</span>
                           <span {...stylex.props(styles.sideStoryTimestamp)}>{formatTimestamp(story.timestamp)}</span>
                        </div>
                     )}
                     <Image
                        src={story.stories[0].storyImageUrl}
                        alt={story.username}
                        fill
                        loading="eager"
                        sizes="(max-width: 640px) 100vw, 33vw"
                     />
                  </div>
               );
            })}
         </div>
      </div>
   );
}
