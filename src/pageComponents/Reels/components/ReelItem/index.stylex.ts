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
   row: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '16px',
      height: 'calc(100dvh - 24px)',
   },
   videoWrapper: {
      position: 'relative',
      height: '100%',
      aspectRatio: '9 / 16',
      borderRadius: radius.md,
      overflow: 'hidden',
      backgroundColor: colors.black,
   },
   overlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
      pointerEvents: 'none',
   },
   userRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      pointerEvents: 'auto',
   },
   username: {
      color: colors.white,
      fontSize: '14px',
      fontWeight: 600,
   },
   verified: {
      color: 'rgb(74, 144, 226)',
      display: 'flex',
   },
   follow: {
      color: colors.white,
      fontSize: '14px',
      fontWeight: 600,
      background: 'none',
      border: 'none',
      pointerEvents: 'auto',
   },
   location: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: colors.white,
      fontSize: '13px',
   },
   caption: {
      color: colors.white,
      fontSize: '14px',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
   },
});
