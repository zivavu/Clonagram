'use client';

import { STORIES } from '@/src/pageComponents/Home/components/data';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import { colors, radius } from '../../styles/tokens.stylex';

const DESKTOP_SIDE_W = 205;
const DESKTOP_SIDE_H = Math.round((DESKTOP_SIDE_W * 16) / 9);
const DESKTOP_GAP = 24;
const MOBILE_BP = 640;
const SWIPE_THRESHOLD = 40;

interface Layout {
   mainW: number;
   mainH: number;
   sideW: number;
   sideH: number;
   gap: number;
   tx: number;
   mobile: boolean;
}

function computeLayout(index: number): Layout {
   const vw = window.innerWidth;
   const vh = window.innerHeight;

   if (vw < MOBILE_BP) {
      const mainW = vw;
      const mainH = Math.round((mainW * 16) / 9);
      return { mainW, mainH, sideW: mainW, sideH: mainH, gap: 0, tx: -index * mainW, mobile: true };
   }

   const mainH = Math.round(vh * 0.94);
   const mainW = Math.round((mainH * 9) / 16);
   return {
      mainW,
      mainH,
      sideW: DESKTOP_SIDE_W,
      sideH: DESKTOP_SIDE_H,
      gap: DESKTOP_GAP,
      tx: vw / 2 - index * (DESKTOP_SIDE_W + DESKTOP_GAP) - mainW / 2,
      mobile: false,
   };
}

const styles = stylex.create({
   root: {
      position: 'relative',
      height: '100dvh',
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

const ICON_PATH =
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

   const [current, setCurrent] = useState(startIndex);
   const [layout, setLayout] = useState<Layout>({
      mainW: DESKTOP_SIDE_W,
      mainH: DESKTOP_SIDE_H,
      sideW: DESKTOP_SIDE_W,
      sideH: DESKTOP_SIDE_H,
      gap: DESKTOP_GAP,
      tx: 0,
      mobile: false,
   });
   const [spinning, setSpinning] = useState(false);

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
      setCurrent(idx);
      setLayout(computeLayout(idx));
      window.history.replaceState(null, '', `/stories/${STORIES[idx].username}`);
      setSpinning(true);
      if (spinTimer.current) clearTimeout(spinTimer.current);
      spinTimer.current = setTimeout(() => setSpinning(false), 380);
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

         <button
            onClick={() => goTo(current - 1)}
            {...stylex.props(styles.navBtn, spinning && styles.navBtnHidden)}
            style={{ left: `calc(50% - ${layout.mainW / 2 + 40}px)` }}
         >
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="24"
               height="24"
               viewBox="0 0 24 24"
               {...stylex.props(styles.navIcon, styles.navIconLeft)}
            >
               <path d={ICON_PATH} />
            </svg>
         </button>

         <button
            onClick={() => goTo(current + 1)}
            {...stylex.props(styles.navBtn, spinning && styles.navBtnHidden)}
            style={{ left: `calc(50% + ${layout.mainW / 2 + 16}px)` }}
         >
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="24"
               height="24"
               viewBox="0 0 24 24"
               {...stylex.props(styles.navIcon)}
            >
               <path d={ICON_PATH} />
            </svg>
         </button>

         <div
            {...stylex.props(styles.strip)}
            style={{ gap: `${layout.gap}px`, transform: `translateX(${layout.tx}px)` }}
         >
            {STORIES.map((story, i) => {
               const isCurrent = i === current;
               return (
                  <div
                     key={story.username}
                     {...stylex.props(styles.story, !layout.mobile && styles.storyRounded)}
                     style={{
                        width: `${isCurrent ? layout.mainW : layout.sideW}px`,
                        height: `${isCurrent ? layout.mainH : layout.sideH}px`,
                     }}
                     onClick={() => goTo(i)}
                  >
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
