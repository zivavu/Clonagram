import * as stylex from '@stylexjs/stylex';
import Image, { type ImageProps } from 'next/image';
import { colors } from '../../styles/tokens.stylex';

interface UserAvatarProps extends Omit<ImageProps, 'src'> {
   src: string | null;
   alt: string;
   size: number;
}

export default function UserAvatar({ src, size, ...props }: UserAvatarProps) {
   if (!src) {
      return (
         <div {...stylex.props(styles.placeholder)} style={{ width: size, height: size }}>
            <svg
               viewBox="0 0 24 24"
               fill="currentColor"
               role="img"
               aria-label="User avatar placeholder"
               {...stylex.props(styles.placeholderIcon)}
            >
               <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
         </div>
      );
   }

   return <Image src={src} width={size} height={size} {...stylex.props(styles.image)} {...props} />;
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
