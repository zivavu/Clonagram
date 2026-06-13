'use client';

import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { BsPlus } from 'react-icons/bs';
import { MdExpandCircleDown } from 'react-icons/md';
import type { StoryEntry } from '@/src/actions/story/getActiveStories';
import UserAvatar from '@/src/components/UserAvatar';
import type { Profile } from '@/src/lib/supabase/getAuthProfile';
import { useCreateStoryModalStore } from '@/src/store/createModalStore';
import { colors } from '../../../../../../styles/tokens.stylex';
import { styles } from './index.stylex';

const STORY_ITEM_WIDTH = 86 + 18;
const SCROLL_DURATION = 300;
const SCROLL_PAGES = 4;

function easeInOut(t: number) {
   return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

interface StoriesRowProps {
   entries: StoryEntry[];
   viewedStoryIds: string[];
   currentUser: Profile | undefined;
   isAnonymous: boolean;
}

export default function StoriesRow({
   entries,
   viewedStoryIds,
   currentUser,
   isAnonymous,
}: StoriesRowProps) {
   const { open: openCreateStory } = useCreateStoryModalStore();
   const storiesRowRef = useRef<HTMLDivElement>(null);
   const [isScrolling, setIsScrolling] = useState(false);
   const [scrollLeft, setScrollLeft] = useState(0);
   const [scrollMax, setScrollMax] = useState(Infinity);
   const rafRef = useRef<number | null>(null);
   const viewedSet = new Set(viewedStoryIds);

   const currentUserStory = entries.find(entry => entry.username === currentUser?.username);
   const allOwnStoriesViewed =
      !currentUserStory || currentUserStory.stories.every(s => viewedSet.has(s.storyId));

   const otherEntries = entries.filter(entry => entry.username !== currentUser?.username);

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

   const totalItems = (isAnonymous ? 0 : 1) + otherEntries.length;
   const isFirst = scrollLeft === 0;
   const isLast = scrollLeft >= scrollMax || totalItems <= 6;

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
            {!isAnonymous && (
               <div {...stylex.props(styles.addStoryCard)}>
                  <div {...stylex.props(styles.addStoryRingWrapper)}>
                     <UserAvatar
                        src={currentUser?.avatar_url ?? null}
                        alt="Your story"
                        username={currentUser?.username ?? ''}
                        size={74}
                        ringState={{
                           hasStories: !!currentUserStory,
                           allStoriesViewed: allOwnStoriesViewed,
                        }}
                        ringWidth={3}
                        href={currentUserStory ? `/stories/${currentUser?.username}` : undefined}
                        disableLink={!currentUserStory}
                        useHoverCard={false}
                     />
                  </div>
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
                  <span {...stylex.props(styles.storyUsername)}>{currentUser?.username}</span>
               </div>
            )}

            {otherEntries.map(entry => {
               const allViewed = entry.stories.every(s => viewedSet.has(s.storyId));
               return (
                  <Link
                     href={`/stories/${entry.username}`}
                     {...stylex.props(styles.storyLink)}
                     key={entry.username}
                  >
                     <div {...stylex.props(styles.storyItem)}>
                        <UserAvatar
                           src={entry.avatarUrl || null}
                           alt={entry.username}
                           username={entry.username}
                           size={74}
                           ringState={{ hasStories: true, allStoriesViewed: allViewed }}
                           ringWidth={3}
                           disableLink={true}
                           useHoverCard={false}
                        />
                        <span {...stylex.props(styles.storyUsername)}>{entry.username}</span>
                     </div>
                  </Link>
               );
            })}
         </div>
      </div>
   );
}
