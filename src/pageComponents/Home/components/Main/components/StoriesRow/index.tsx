'use client';

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { BsPlus } from 'react-icons/bs';
import { MdExpandCircleDown } from 'react-icons/md';
import type { StoryEntry } from '@/src/actions/story/getActiveStories';
import { useCreateStoryModalStore } from '@/src/store/useCreateStoryModalStore';
import { useAuthUser } from '../../../../../../hooks/useAuthUser';
import { colors } from '../../../../../../styles/tokens.stylex';
import { styles } from './index.stylex';

const STORY_ITEM_WIDTH = 86 + 18;
const SCROLL_DURATION = 300;
const SCROLL_PAGES = 4;

function easeInOut(t: number): number {
   return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

interface OptionalLinkProps {
   href?: string;
   children: ReactNode;
   styleProps: stylex.StyleXStyles;
}

function OptionalLink({ href, children, styleProps }: OptionalLinkProps) {
   if (href) {
      return (
         <Link href={href} {...stylex.props(styleProps)}>
            {children}
         </Link>
      );
   }
   return <div {...stylex.props(styleProps)}>{children}</div>;
}

interface StoriesRowProps {
   entries: StoryEntry[];
   viewedStoryIds: string[];
   currentUserAvatarUrl: string | null;
}

export default function StoriesRow({
   entries,
   viewedStoryIds,
   currentUserAvatarUrl,
}: StoriesRowProps) {
   const { open: openCreateStory } = useCreateStoryModalStore();
   const storiesRowRef = useRef<HTMLDivElement>(null);
   const [isScrolling, setIsScrolling] = useState(false);
   const [scrollLeft, setScrollLeft] = useState(0);
   const [scrollMax, setScrollMax] = useState(Infinity);
   const rafRef = useRef<number | null>(null);
   const viewedSet = new Set(viewedStoryIds);

   const { data: currentUser } = useAuthUser();

   const currentUserStory = entries.find(entry => entry.username === currentUser?.username);

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
         if (progress < 1) rafRef.current = requestAnimationFrame(animate);
         else setIsScrolling(false);
      };
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(animate);
   };

   const isFirst = scrollLeft === 0;
   const isLast = scrollLeft >= scrollMax || entries.length <= 6;

   return (
      <div {...stylex.props(styles.root)}>
         <button
            {...stylex.props(
               styles.storiesRowButton,
               styles.storiesRowButtonLeft,
               isFirst && styles.hidden,
            )}
            onClick={() => scrollBy(-STORY_ITEM_WIDTH * SCROLL_PAGES)}
            disabled={isScrolling}
         >
            <MdExpandCircleDown
               {...stylex.props(styles.navIcon, styles.navIconLeft)}
               style={{ color: colors.textPrimary }}
            />
         </button>
         <button
            {...stylex.props(
               styles.storiesRowButton,
               styles.storiesRowButtonRight,
               isLast && styles.hidden,
            )}
            onClick={() => scrollBy(STORY_ITEM_WIDTH * SCROLL_PAGES)}
            disabled={isScrolling}
         >
            <MdExpandCircleDown {...stylex.props(styles.navIcon, styles.navIconRight)} />
         </button>
         <div {...stylex.props(styles.storiesRow)} ref={storiesRowRef} onScroll={handleScroll}>
            <div {...stylex.props(styles.addStoryCard)}>
               <OptionalLink
                  href={currentUserStory ? `/stories/${currentUser?.username}` : undefined}
                  styleProps={styles.addStoryRingWrapper}
               >
                  {currentUserAvatarUrl ? (
                     <div {...stylex.props(styles.storyRing, styles.storyRingViewed)}>
                        <div {...stylex.props(styles.storyRingInner)}>
                           <Image
                              src={currentUserAvatarUrl}
                              alt="Your story"
                              width={74}
                              height={74}
                              {...stylex.props(styles.addStoryAvatar)}
                           />
                        </div>
                     </div>
                  ) : (
                     <div
                        style={{
                           width: 74,
                           height: 74,
                           borderRadius: '50%',
                           background: '#888',
                        }}
                     />
                  )}
                  <button
                     type="button"
                     {...stylex.props(styles.addStoryPlusBadge)}
                     onClick={
                        currentUserStory
                           ? e => {
                                e.stopPropagation();
                                openCreateStory();
                             }
                           : openCreateStory
                     }
                     aria-label="Add story"
                  >
                     <BsPlus fontSize={22} />
                  </button>
               </OptionalLink>
               <span {...stylex.props(styles.storyUsername)}>Your story</span>
            </div>

            {entries
               .filter(entry => entry.username !== currentUser?.username)
               .map(entry => {
                  const allViewed = entry.stories.every(s => viewedSet.has(s.id));
                  return (
                     <Link
                        href={`/stories/${entry.username}`}
                        key={entry.username}
                        {...stylex.props(styles.storyLink)}
                     >
                        <div {...stylex.props(styles.storyItem)}>
                           <div
                              {...stylex.props(
                                 styles.storyRing,
                                 allViewed && styles.storyRingViewed,
                              )}
                           >
                              <div {...stylex.props(styles.storyRingInner)}>
                                 <Image
                                    {...stylex.props(styles.storyAvatar)}
                                    src={entry.avatarUrl}
                                    alt={entry.username}
                                    width={74}
                                    height={74}
                                 />
                              </div>
                           </div>
                           <span {...stylex.props(styles.storyUsername)}>{entry.username}</span>
                        </div>
                     </Link>
                  );
               })}
         </div>
      </div>
   );
}
