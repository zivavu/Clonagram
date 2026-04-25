'use client';

import { STORIES } from '@/src/pageComponents/Home/components/data';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import { colors, radius } from '../../styles/tokens.stylex';

const SIDE_W = 205;
const SIDE_H = Math.round((SIDE_W * 16) / 9); // 365px
const GAP = 24;

function computeLayout(index: number) {
   const mainH = Math.round(window.innerHeight * 0.94);
   const mainW = Math.round((mainH * 9) / 16);
   const tx = window.innerWidth / 2 - index * (SIDE_W + GAP) - mainW / 2;
   return { mainW, mainH, tx };
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
      gap: `${GAP}px`,
      flexShrink: 0,
      willChange: 'transform',
      transition: 'transform 380ms cubic-bezier(0.4, 0, 0.2, 1)',
   },
   story: {
      position: 'relative',
      flexShrink: 0,
      overflow: 'hidden',
      cursor: 'pointer',
      borderRadius: radius.md,
      transition: 'width 380ms cubic-bezier(0.4, 0, 0.2, 1), height 380ms cubic-bezier(0.4, 0, 0.2, 1)',
   },
   navBtn: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,
      display: 'flex',
      padding: '0',
      transition: 'left 380ms cubic-bezier(0.4, 0, 0.2, 1), opacity 150ms ease',
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
   const [tx, setTx] = useState(0);
   const [mainW, setMainW] = useState(SIDE_W);
   const [mainH, setMainH] = useState(SIDE_H);
   const [isMoving, setIsMoving] = useState(false);
   const moveTimer = useRef<ReturnType<typeof setTimeout>>(null);

   useLayoutEffect(() => {
      const layout = computeLayout(startIndex);
      setMainW(layout.mainW);
      setMainH(layout.mainH);
      setTx(layout.tx);
   }, []);

   const goTo = (raw: number) => {
      const idx = ((raw % STORIES.length) + STORIES.length) % STORIES.length;
      const layout = computeLayout(idx);
      setMainW(layout.mainW);
      setMainH(layout.mainH);
      setTx(layout.tx);
      setCurrent(idx);
      window.history.replaceState(null, '', `/stories/${STORIES[idx].username}`);

      setIsMoving(true);
      if (moveTimer.current) clearTimeout(moveTimer.current);
      moveTimer.current = setTimeout(() => setIsMoving(false), 380);
   };

   function GoToButton({ direction }: { direction: 'left' | 'right' }) {
      return (
         <button
            onClick={() => goTo(current + (direction === 'left' ? -1 : 1))}
            {...stylex.props(styles.navBtn, isMoving && styles.navBtnHidden)}
            style={{
               left: direction === 'left' ? `calc(50% - ${mainW / 2 + 40}px)` : `calc(50% + ${mainW / 2 + 16}px)`,
            }}
         >
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="24"
               height="24"
               viewBox="0 0 24 24"
               {...stylex.props(styles.navIcon, direction === 'left' && styles.navIconLeft)}
            >
               <path d={ICON_PATH} />
            </svg>
         </button>
      );
   }

   return (
      <div {...stylex.props(styles.root)}>
         <Link href="/">
            <h1 {...stylex.props(styles.title)}>Clonagram</h1>
         </Link>

         <GoToButton direction="left" />
         <GoToButton direction="right" />

         <div {...stylex.props(styles.strip)} style={{ transform: `translateX(${tx}px)` }}>
            {STORIES.map((story, i) => {
               const isCurrent = i === current;
               return (
                  <div
                     key={story.username}
                     {...stylex.props(styles.story)}
                     style={{
                        width: `${isCurrent ? mainW : SIDE_W}px`,
                        height: `${isCurrent ? mainH : SIDE_H}px`,
                     }}
                     onClick={() => goTo(i)}
                  >
                     <Image
                        src={story.stories[0].storyImageUrl}
                        alt={story.username}
                        fill
                        loading="eager"
                        sizes="(max-width: 768px) 100vw, 33vw"
                     />
                  </div>
               );
            })}
         </div>
      </div>
   );
}
