'use client';

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { colors, radius } from '../../../../../styles/tokens.stylex';

const styles = stylex.create({
   card: {
      display: 'flex',
      flexDirection: 'column',
      width: '180px',
      borderRadius: radius.md,
      overflow: 'hidden',
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.bgSecondary,
      textDecoration: 'none',
      flexShrink: 0,
   },
   imageWrapper: {
      position: 'relative',
      width: '180px',
      height: '280px',
      flexShrink: 0,
   },
   image: {
      objectFit: 'cover',
   },
   footer: {
      padding: '8px 10px',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
   },
   label: {
      fontSize: '0.8rem',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   subtitle: {
      fontSize: '0.75rem',
      color: colors.textMuted,
   },
});

interface StoryLikeMessageProps {
   storyId: string;
   storyUsername: string;
   thumbnailUrl?: string | null;
}

export default function StoryLikeMessage({
   storyId,
   storyUsername,
   thumbnailUrl,
}: StoryLikeMessageProps) {
   return (
      <Link href={`/stories/${storyUsername}/${storyId}`} {...stylex.props(styles.card)}>
         {thumbnailUrl && (
            <div {...stylex.props(styles.imageWrapper)}>
               <Image src={thumbnailUrl} alt="" fill {...stylex.props(styles.image)} />
            </div>
         )}
         <div {...stylex.props(styles.footer)}>
            <span {...stylex.props(styles.label)}>View story</span>
            <span {...stylex.props(styles.subtitle)}>{storyUsername}</span>
         </div>
      </Link>
   );
}
