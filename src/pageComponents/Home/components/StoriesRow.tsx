'use client';

import * as stylex from '@stylexjs/stylex';
import ArrowCircleLeftRounded from '@mui/icons-material/ArrowCircleLeftRounded';
import ArrowCircleRightRounded from '@mui/icons-material/ArrowCircleRightRounded';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { colors, radius, spacing } from '../../../styles/tokens.stylex';
import { STORIES } from './data';

const styles = stylex.create({
   root: {
      position: 'relative',
   },
   storiesRow: {
      display: 'flex',
      flexDirection: 'row',
      gap: '18px',
      overflowX: 'auto',
      paddingBottom: spacing.xs,
      borderBottom: `1px solid ${colors.borderMuted}`,
      paddingTop: '8px',
      paddingLeft: '12px',
      position: 'relative',
      scrollbarWidth: 'none',
   },
   storiesRowButton: {
      display: 'flex',
      padding: '8px',
      borderRadius: radius.full,
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      ':hover': {
         backgroundColor: 'rgba(255, 255, 255, 0.3)',
      },
      ':disabled': {
         color: colors.textPrimary,
      },
   },
   storiesRowButtonLeft: {
      left: '0',
   },
   storiesRowButtonRight: {
      right: '0',
   },
   storyLink: {
      display: 'contents',
   },
   storyItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      cursor: 'pointer',
      flexShrink: 0,
   },
   storyRing: {
      padding: '3px',
      borderRadius: radius.full,
      backgroundImage: 'linear-gradient(45deg, #f09433, #bc1888)',
   },
   storyRingInner: {
      padding: '3px',
      borderRadius: radius.full,
      backgroundColor: colors.bg,
   },
   storyAvatar: {
      borderRadius: radius.full,
   },
   storyUsername: {
      fontSize: '0.7rem',
      color: colors.textPrimary,
      maxWidth: '64px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      textAlign: 'center',
   },
});

const SCROLL_DURATION = 300;
const STORY_ITEM_WIDTH = 86 + 18;
const SCROLL_PAGES = 4;

function easeInOut(t: number): number {
   return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function StoriesRow() {
   const storiesRowRef = useRef<HTMLDivElement>(null);
   const [isScrolling, setIsScrolling] = useState(false);
   const rafRef = useRef<number | null>(null);

   const scrollBy = (amount: number) => {
      if (isScrolling || !storiesRowRef.current) return;

      const el = storiesRowRef.current;
      const start = el.scrollLeft;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const snapped = Math.round((start + amount) / STORY_ITEM_WIDTH) * STORY_ITEM_WIDTH;
      const target = Math.max(0, Math.min(snapped, maxScroll));

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

   const handlePrevious = () => scrollBy(-STORY_ITEM_WIDTH * SCROLL_PAGES);
   const handleNext = () => scrollBy(STORY_ITEM_WIDTH * SCROLL_PAGES);

   return (
      <div {...stylex.props(styles.root)}>
         <button
            {...stylex.props(styles.storiesRowButton, styles.storiesRowButtonLeft)}
            onClick={handlePrevious}
            disabled={isScrolling}
         >
            <ArrowCircleLeftRounded style={{ fontSize: 24, color: colors.textPrimary }} />
         </button>
         <button
            {...stylex.props(styles.storiesRowButton, styles.storiesRowButtonRight)}
            onClick={handleNext}
            disabled={isScrolling}
         >
            <ArrowCircleRightRounded style={{ fontSize: 24 }} />
         </button>
         <div {...stylex.props(styles.storiesRow)} ref={storiesRowRef}>
            {STORIES.map(story => {
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
