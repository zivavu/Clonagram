'use client';

import * as stylex from '@stylexjs/stylex';
import Image, { type ImageProps } from 'next/image';
import Link from 'next/link';
import { MdPerson } from 'react-icons/md';
import ProfileHoverCard from '@/src/components/ProfileHoverCard';
import { useStoryStatus } from '@/src/hooks/useStoryStatus';
import { styles } from './index.stylex';

interface UserAvatarProps extends Omit<ImageProps, 'src'> {
   src: string | null;
   alt: string;
   size: number;
   userId?: string;
   useHoverCard?: boolean;
   showStoryRing?: boolean;
   href?: string;
}

export default function UserAvatar({
   src,
   size,
   userId,
   useHoverCard = true,
   showStoryRing = true,
   href,
   ...props
}: UserAvatarProps) {
   const { data: storyStatus } = useStoryStatus(showStoryRing ? userId : undefined);

   let content = src ? (
      <Image
         src={src}
         width={size}
         height={size}
         {...stylex.props(styles.image)}
         preload
         {...props}
      />
   ) : (
      <div {...stylex.props(styles.placeholder)} style={{ width: size, height: size }}>
         <MdPerson {...stylex.props(styles.placeholderIcon)} />
      </div>
   );

   if (userId && useHoverCard) {
      content = <ProfileHoverCard userId={userId}>{content}</ProfileHoverCard>;
   }

   if (storyStatus?.hasStories) {
      content = (
         <div {...stylex.props(styles.ring, storyStatus.allStoriesViewed && styles.ringViewed)}>
            <div {...stylex.props(styles.ringInner)}>{content}</div>
         </div>
      );
   }

   if (href) {
      content = (
         <Link href={href} {...stylex.props(styles.link)}>
            {content}
         </Link>
      );
   }

   return content;
}
