'use client';

import { STORIES, Story } from '@/src/pageComponents/Home/components/data';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { colors, radius } from '../../styles/tokens.stylex';

const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      height: '100dvh',
   },
   title: {
      position: 'absolute',
      top: '8px',
      left: '16px',
      fontFamily: 'var(--font-grand-hotel)',
      fontWeight: '200',
   },
   storiesContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '18px',
      width: '100%',
      height: '100%',
      overflowX: 'hidden',
   },
   storyMedia: {
      position: 'relative',
      aspectRatio: '9 / 16',
      height: '94%',
      borderRadius: radius.md,
      overflow: 'hidden',
      flexShrink: 0,
   },
   storyNavigationButton: {
      display: 'flex',
      borderRadius: radius.full,
   },
   storyNavigationIcon: {
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
   storyNavigationIconLeft: {
      transform: 'rotate(180deg)',
   },
   sideStoriesContainer: {
      flex: 1,
      height: '50%',
      display: 'flex',
      alignItems: 'center',
      gap: '36px',
      scrollbarWidth: 'none',
      overflow: 'hidden',
   },
   sideStoriesLeft: {
      justifyContent: 'flex-end',
   },
   sideStoriesRight: {
      justifyContent: 'flex-start',
   },
   sideStory: {
      position: 'relative',
      aspectRatio: '9 / 16',
      width: '205px',
      flexShrink: 0,
      borderRadius: radius.md,
      overflow: 'hidden',
   },
});

export default function StoriesPage({ username }: { username: string }) {
   const initialStoryIndex = STORIES.findIndex(story => story.username === username);
   const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(initialStoryIndex);

   const currentStory = STORIES[currentStoryIndex];
   const storiesArr = STORIES.filter(story => story.username !== username);
   const storiesArrLeft = storiesArr.slice(0, currentStoryIndex - 1);
   const storiesArrRight = storiesArr.slice(currentStoryIndex + 1, storiesArr.length);

   if (!currentStory) {
      return notFound();
   }

   return (
      <div {...stylex.props(styles.root)}>
         <Link href="/">
            <h1 {...stylex.props(styles.title)}>Clonagram</h1>
         </Link>
         <div {...stylex.props(styles.storiesContainer)}>
            <div {...stylex.props(styles.sideStoriesContainer, styles.sideStoriesLeft)}>
               {storiesArrLeft.map(story => (
                  <SideStory key={story.username} story={story} />
               ))}
            </div>
            <StoryNavigationButton isLeft={true} onClick={() => setCurrentStoryIndex(currentStoryIndex - 1)} />
            <div {...stylex.props(styles.storyMedia)}>
               <Image
                  src={currentStory.storyImageUrl}
                  alt={currentStory.username}
                  fill
                  loading="eager"
                  preload
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               />
            </div>
            <StoryNavigationButton isLeft={false} onClick={() => setCurrentStoryIndex(currentStoryIndex + 1)} />
            <div {...stylex.props(styles.sideStoriesContainer, styles.sideStoriesRight)}>
               {storiesArrRight.map(story => (
                  <SideStory key={story.username} story={story} />
               ))}
            </div>
         </div>
      </div>
   );
}

function SideStory({ story }: { story: Story }) {
   return (
      <div {...stylex.props(styles.sideStory)}>
         <Image
            src={story.storyImageUrl}
            alt={story.username}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="eager"
            preload
         />
      </div>
   );
}

function StoryNavigationButton({ isLeft, onClick }: { isLeft: boolean; onClick: () => void }) {
   return (
      <button {...stylex.props(styles.storyNavigationButton)} onClick={onClick}>
         <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            {...stylex.props(styles.storyNavigationIcon, isLeft && styles.storyNavigationIconLeft)}
         >
            <path d="M12.005.503a11.5 11.5 0 1 0 11.5 11.5 11.513 11.513 0 0 0-11.5-11.5Zm3.707 12.22-4.5 4.488A1 1 0 0 1 9.8 15.795l3.792-3.783L9.798 8.21a1 1 0 1 1 1.416-1.412l4.5 4.511a1 1 0 0 1-.002 1.414Z" />
         </svg>
      </button>
   );
}
