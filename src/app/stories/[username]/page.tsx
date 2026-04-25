import { STORIES } from '@/src/pageComponents/Home/components/data';
import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { colors, radius } from '../../../styles/tokens.stylex';

export default async function StoriesPage({ params }: { params: { username: string } }) {
   const { username } = await params;

   const story = STORIES.find(story => story.username === username);
   if (!story) {
      return notFound();
   }

   const styles = stylex.create({
      root: {
         display: 'flex',
         flexDirection: 'column',
         justifyContent: 'center',
         alignItems: 'center',
         position: 'relative',
         width: '100%',
         height: '100%',
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
      },
      storyMedia: {
         position: 'relative',
         aspectRatio: '9 / 16',
         height: '94%',
         borderRadius: radius.md,
         overflow: 'hidden',
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
            transform: 'scale(1.05)',
         },
      },
      storyNavigationIconRight: {
         transform: 'rotate(180deg)',
      },
   });
   return (
      <div {...stylex.props(styles.root)}>
         <Link href="/">
            <h1 {...stylex.props(styles.title)}>Clonagram</h1>
         </Link>
         <div {...stylex.props(styles.storiesContainer)}>
            <button {...stylex.props(styles.storyNavigationButton)}>
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  {...stylex.props(styles.storyNavigationIcon, styles.storyNavigationIconRight)}
               >
                  <path d="M12.005.503a11.5 11.5 0 1 0 11.5 11.5 11.513 11.513 0 0 0-11.5-11.5Zm3.707 12.22-4.5 4.488A1 1 0 0 1 9.8 15.795l3.792-3.783L9.798 8.21a1 1 0 1 1 1.416-1.412l4.5 4.511a1 1 0 0 1-.002 1.414Z" />
               </svg>
            </button>
            <div {...stylex.props(styles.storyMedia)}>
               <Image
                  src={story.storyImageUrl}
                  alt={story.username}
                  fill
                  loading="eager"
                  preload
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               />
            </div>
            <button {...stylex.props(styles.storyNavigationButton)}>
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  {...stylex.props(styles.storyNavigationIcon)}
               >
                  <path d="M12.005.503a11.5 11.5 0 1 0 11.5 11.5 11.513 11.513 0 0 0-11.5-11.5Zm3.707 12.22-4.5 4.488A1 1 0 0 1 9.8 15.795l3.792-3.783L9.798 8.21a1 1 0 1 1 1.416-1.412l4.5 4.511a1 1 0 0 1-.002 1.414Z" />
               </svg>
            </button>
         </div>
      </div>
   );
}
