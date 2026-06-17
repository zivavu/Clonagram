'use client';

import * as stylex from '@stylexjs/stylex';
import Image, { type ImageProps } from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { MdPerson } from 'react-icons/md';
import ProfileHoverCard from '@/src/components/ProfileHoverCard';
import { useStoryStatus } from '@/src/hooks/useStoryStatus';
import { styles } from './index.stylex';

interface UserAvatarProps extends Omit<ImageProps, 'src'> {
   src: string | null;
   alt: string;
   size: number;
   userId?: string;
   username: string;
   useHoverCard?: boolean;
   showStoryRing?: boolean;
   ringState?: { hasStories: boolean; allStoriesViewed: boolean };
   disableLink?: boolean;
   href?: string;
   ringWidth?: number;
}

export default function UserAvatar({
   src,
   size,
   userId,
   username,
   useHoverCard = true,
   showStoryRing = true,
   ringState,
   disableLink = false,
   href,
   ringWidth = 2,
   ...props
}: UserAvatarProps) {
   const { data: hookStoryStatus } = useStoryStatus(
      showStoryRing && !ringState ? userId : undefined,
   );
   const effectiveRingState = ringState ?? hookStoryStatus;

   const resolvedHref = disableLink
      ? undefined
      : (href ?? (effectiveRingState?.hasStories && username ? `/stories/${username}` : undefined));

   let content = src ? (
      <Image src={src} width={size} height={size} {...stylex.props(styles.image)} {...props} />
   ) : (
      <div {...stylex.props(styles.placeholder)} style={{ width: size, height: size }}>
         <MdPerson {...stylex.props(styles.placeholderIcon)} />
      </div>
   );

   if (userId && useHoverCard) {
      content = <ProfileHoverCard userId={userId}>{content}</ProfileHoverCard>;
   }

   if (effectiveRingState?.hasStories) {
      content = (
         <div
            {...stylex.props(styles.ring, effectiveRingState.allStoriesViewed && styles.ringViewed)}
            style={
               {
                  '--ring-width': `${ringWidth}px`,
                  '--ring-inner-width': `${Math.max(1, ringWidth - 1)}px`,
               } as React.CSSProperties
            }
         >
            <div {...stylex.props(styles.ringInner)}>{content}</div>
         </div>
      );
   }

   if (resolvedHref) {
      content = (
         <Link href={resolvedHref} {...stylex.props(styles.link)}>
            {content}
         </Link>
      );
   }

   return content;
}
