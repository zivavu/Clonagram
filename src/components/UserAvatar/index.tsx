'use client';

import * as stylex from '@stylexjs/stylex';
import Image, { type ImageProps } from 'next/image';
import { MdPerson } from 'react-icons/md';
import ProfileHoverCard from '@/src/components/ProfileHoverCard';
import { colors } from '../../styles/tokens.stylex';

interface UserAvatarProps extends Omit<ImageProps, 'src'> {
   src: string | null;
   alt: string;
   size: number;
   userId?: string;
   useHoverCard?: boolean;
}

export default function UserAvatar({
   src,
   size,
   userId,
   useHoverCard = true,
   ...props
}: UserAvatarProps) {
   const avatar = src ? (
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

   if (!userId) return avatar;

   if (!useHoverCard) return avatar;

   return <ProfileHoverCard userId={userId}>{avatar}</ProfileHoverCard>;
}

const styles = stylex.create({
   image: {
      borderRadius: '50%',
      objectFit: 'cover',
   },
   placeholder: {
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.buttonHover,
      color: colors.textSecondary,
      flexShrink: 0,
   },
   placeholderIcon: {
      width: '60%',
      height: '60%',
   },
});
