'use client';

import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import Link from 'next/link';
import { colors, radius } from '../../../../../styles/tokens.stylex';

const styles = stylex.create({
   card: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginTop: 8,
      padding: 8,
      borderRadius: radius.md,
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.bgSecondary,
      textDecoration: 'none',
   },
   thumbnail: {
      borderRadius: radius.sm,
      objectFit: 'cover',
      flexShrink: 0,
   },
   info: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      minWidth: 0,
   },
   label: {
      fontSize: '0.8rem',
      fontWeight: 600,
      color: colors.textPrimary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
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
            <Image
               src={thumbnailUrl}
               alt=""
               width={40}
               height={40}
               {...stylex.props(styles.thumbnail)}
            />
         )}
         <div {...stylex.props(styles.info)}>
            <span {...stylex.props(styles.label)}>View story</span>
            <span {...stylex.props(styles.subtitle)}>{storyUsername}</span>
         </div>
      </Link>
   );
}
