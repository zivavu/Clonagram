import * as stylex from '@stylexjs/stylex';
import type { UnsplashAttribution as UnsplashAttributionType } from '@/src/types/unsplash';
import { colors } from '../../styles/tokens.stylex';

const styles = stylex.create({
   root: {
      display: 'flex',
      alignItems: 'center',
      gap: '3px',
      fontSize: '11px',
      lineHeight: 1,
      color: 'rgba(255,255,255,0.85)',
      textShadow: '0 1px 3px rgba(0,0,0,0.6)',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
   },
   link: {
      color: 'rgba(255,255,255,0.85)',
      textDecoration: 'underline',
      textDecorationColor: 'rgba(255,255,255,0.4)',
      ':hover': {
         color: 'rgb(255,255,255)',
         textDecorationColor: 'rgba(255,255,255,0.8)',
      },
   },
   overlayRoot: {
      position: 'absolute',
      bottom: '8px',
      left: '8px',
      zIndex: 3,
   },
   inlineRoot: {
      color: colors.textSecondary,
      textShadow: 'none',
   },
   inlineLink: {
      color: colors.textSecondary,
      textDecoration: 'underline',
      textDecorationColor: colors.textMuted,
      ':hover': {
         color: colors.textPrimary,
      },
   },
});

interface UnsplashAttributionProps {
   attribution: UnsplashAttributionType;
   variant?: 'overlay' | 'inline';
}

export default function UnsplashAttribution({
   attribution,
   variant = 'overlay',
}: UnsplashAttributionProps) {
   const isOverlay = variant === 'overlay';
   return (
      <span {...stylex.props(styles.root, isOverlay ? styles.overlayRoot : styles.inlineRoot)}>
         Photo by{' '}
         <a
            href={`${attribution.photographerUrl}?utm_source=clonagram&utm_medium=referral`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            {...stylex.props(isOverlay ? styles.link : styles.inlineLink)}
         >
            {attribution.photographerName}
         </a>
         {' on '}
         <a
            href="https://unsplash.com/?utm_source=clonagram&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            {...stylex.props(isOverlay ? styles.link : styles.inlineLink)}
         >
            Unsplash
         </a>
      </span>
   );
}
