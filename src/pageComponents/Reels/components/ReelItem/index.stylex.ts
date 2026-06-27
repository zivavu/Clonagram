import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   section: {
      height: '100dvh',
      scrollSnapAlign: 'center',
      scrollSnapStop: 'always',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
   anchor: {
      position: 'relative',
      height: 'calc(100dvh - 24px)',
      aspectRatio: '9 / 16',
      '@media (max-width: 767px)': {
         width: '100%',
         height: '100%',
         aspectRatio: 'auto',
      },
   },
   videoClip: {
      position: 'absolute',
      inset: 0,
      borderRadius: radius.md,
      overflow: 'hidden',
      backgroundColor: colors.black,
      '@media (max-width: 767px)': {
         borderRadius: 0,
      },
   },
   info: {
      position: 'absolute',
      right: 'calc(100% + 16px)',
      bottom: '36px',
      width: '270px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      '@media (max-width: 767px)': {
         right: 'auto',
         left: '12px',
         bottom: 'calc(env(safe-area-inset-bottom, 0px) + 64px)',
         width: 'auto',
         maxWidth: 'calc(100% - 88px)',
      },
   },
   railWrapper: {
      position: 'absolute',
      left: 'calc(100% + 24px)',
      bottom: '8px',
      display: 'flex',
      alignItems: 'flex-end',
      gap: '16px',
      '@media (max-width: 767px)': {
         left: 'auto',
         right: '8px',
         bottom: 'calc(env(safe-area-inset-bottom, 0px) + 64px)',
         top: 'auto',
      },
   },
   userRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap',
   },
   username: {
      color: colors.textPrimary,
      fontSize: '14px',
      fontWeight: 600,
   },
   verified: {
      color: 'rgb(74, 144, 226)',
      display: 'flex',
   },
   followButton: {
      color: colors.textPrimary,
      fontSize: '14px',
      fontWeight: 600,
      background: 'none',
      border: 'none',
   },
   location: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: colors.textPrimary,
      fontSize: '13px',
      '@media (max-width: 767px)': {
         color: 'white',
         textShadow: '0 1px 3px rgba(0,0,0,0.6)',
      },
   },
   caption: {
      color: colors.textPrimary,
      fontSize: '14px',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      '@media (max-width: 767px)': {
         color: 'white',
         textShadow: '0 1px 3px rgba(0,0,0,0.6)',
      },
   },
});
