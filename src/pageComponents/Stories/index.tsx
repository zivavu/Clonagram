import { STORIES, Story } from '@/src/pageComponents/Home/components/data';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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

interface StoriesPageProps {
   username: string;
   storyId: string | null;
}

export default function StoriesPage({ username, storyId }: StoriesPageProps) {
   const currentIndex = STORIES.findIndex(story => story.username === username);

   if (currentIndex === -1) {
      return notFound();
   }

   const currentStory = STORIES[currentIndex];
   const previousStory = STORIES[currentIndex - 1] ?? STORIES[STORIES.length - 1];
   const nextStory = STORIES[currentIndex + 1] ?? STORIES[0];

   const storiesLeft = STORIES.slice(0, Math.max(0, currentIndex));
   const storiesRight = STORIES.slice(currentIndex + 1);

   return (
      <div {...stylex.props(styles.root)}>
         <Link href="/">
            <h1 {...stylex.props(styles.title)}>Clonagram</h1>
         </Link>
         <div {...stylex.props(styles.storiesContainer)}>
            <div {...stylex.props(styles.sideStoriesContainer, styles.sideStoriesLeft)}>
               {storiesLeft.map(story => (
                  <SideStory key={story.username} story={story} />
               ))}
            </div>
            <StoryNavigationButton isLeft={true} username={previousStory.username} />
            <div {...stylex.props(styles.storyMedia)}>
               <Image
                  src={currentStory.stories[0].storyImageUrl}
                  alt={currentStory.username}
                  fill
                  loading="eager"
                  preload
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               />
            </div>
            <StoryNavigationButton isLeft={false} username={nextStory.username} />
            <div {...stylex.props(styles.sideStoriesContainer, styles.sideStoriesRight)}>
               {storiesRight.map(story => (
                  <SideStory key={story.username} story={story} />
               ))}
            </div>
         </div>
      </div>
   );
}

function SideStory({ story }: { story: Story }) {
   return (
      <Link href={`/stories/${story.username}`} replace {...stylex.props(styles.sideStory)}>
         <Image
            src={story.stories[0].storyImageUrl}
            alt={story.username}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="eager"
            preload
         />
      </Link>
   );
}

function StoryNavigationButton({ isLeft, username }: { isLeft: boolean; username: string }) {
   return (
      <Link href={`/stories/${username}`} replace {...stylex.props(styles.storyNavigationButton)}>
         <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            {...stylex.props(styles.storyNavigationIcon, isLeft && styles.storyNavigationIconLeft)}
         >
            <path d="M12.005.503a11.5 11.5 0 1 0 11.5 11.5 11.513 11.513 0 0 0-11.5-11.5Zm3.707 12.22-4.5 4.488A1 1 0 0 1 9.8 15.795l3.792-3.783L9.798 8.21a1 1 0 1 1 1.416-1.412l4.5 4.511a1 1 0 0 1-.002 1.414Z" />
         </svg>
      </Link>
   );
}
