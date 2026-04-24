'use client';

import * as stylex from '@stylexjs/stylex';
import { CircleChevronLeft, CircleChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { colors, radius, spacing } from '../../../styles/tokens.stylex';

interface Story {
   id: number;
   username: string;
   color: string;
   avatarUrl: string;
}

const STORIES: Story[] = [
   { id: 1, username: 'aurora.mp4', color: '#e056fd', avatarUrl: 'https://picsum.photos/seed/clona1/630/630' },
   { id: 2, username: 'darkwave99', color: '#ff6b6b', avatarUrl: 'https://picsum.photos/seed/clona2/630/630' },
   { id: 3, username: 'jpeg.ghost', color: '#48dbfb', avatarUrl: 'https://picsum.photos/seed/clona3/630/630' },
   { id: 4, username: 'velvet.avi', color: '#ff9f43', avatarUrl: 'https://picsum.photos/seed/clona4/630/630' },
   { id: 5, username: 'solarflux', color: '#1dd1a1', avatarUrl: 'https://picsum.photos/seed/clona5/630/630' },
   { id: 6, username: 'nxght.mode', color: '#a29bfe', avatarUrl: 'https://picsum.photos/seed/clona6/630/630' },
   { id: 7, username: 'glitch.muse', color: '#fd79a8', avatarUrl: 'https://picsum.photos/seed/clona7/630/630' },
   { id: 8, username: 'fog.machine', color: '#fdcb6e', avatarUrl: 'https://picsum.photos/seed/clona8/630/630' },
   { id: 9, username: 'pixl.witch', color: '#6c5ce7', avatarUrl: 'https://picsum.photos/seed/clona9/630/630' },
   { id: 10, username: 'static.eden', color: '#00b894', avatarUrl: 'https://picsum.photos/seed/clona10/630/630' },
   { id: 11, username: 'lo.fi.wolf', color: '#e17055', avatarUrl: 'https://picsum.photos/seed/clona11/630/630' },
   { id: 12, username: 'neon.relic', color: '#74b9ff', avatarUrl: 'https://picsum.photos/seed/clona12/630/630' },
   { id: 13, username: 'void.jpeg', color: '#d63031', avatarUrl: 'https://picsum.photos/seed/clona13/630/630' },
   { id: 14, username: 'synth.driftr', color: '#00cec9', avatarUrl: 'https://picsum.photos/seed/clona14/630/630' },
   { id: 15, username: 'cassette.era', color: '#fab1a0', avatarUrl: 'https://picsum.photos/seed/clona15/630/630' },
   { id: 16, username: 'analog.flow', color: '#45aaf2', avatarUrl: 'https://picsum.photos/seed/clona16/630/630' },
   { id: 17, username: 'digital.pulse', color: '#9980fa', avatarUrl: 'https://picsum.photos/seed/clona17/630/630' },
   { id: 18, username: 'noise.wave', color: '#ffbe76', avatarUrl: 'https://picsum.photos/seed/clona18/630/630' },
   { id: 19, username: 'pixel.dreams', color: '#4cd137', avatarUrl: 'https://picsum.photos/seed/clona19/630/630' },
   { id: 20, username: 'code.syntax', color: '#e84393', avatarUrl: 'https://picsum.photos/seed/clona20/630/630' },
] as const;

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
            <CircleChevronLeft size={24} strokeWidth={3} color={colors.textPrimary} />
         </button>
         <button
            {...stylex.props(styles.storiesRowButton, styles.storiesRowButtonRight)}
            onClick={handleNext}
            disabled={isScrolling}
         >
            <CircleChevronRight size={24} strokeWidth={3} />
         </button>
         <div {...stylex.props(styles.storiesRow)} ref={storiesRowRef}>
            {STORIES.map(story => {
               const { username, avatarUrl } = story;
               if (!avatarUrl) return null;

               return (
                  <div {...stylex.props(styles.storyItem)} key={username}>
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
               );
            })}
         </div>
      </div>
   );
}
