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
   },
   videoClip: {
      position: 'absolute',
      inset: 0,
      borderRadius: radius.md,
      overflow: 'hidden',
      backgroundColor: colors.black,
   },
   info: {
      position: 'absolute',
      right: 'calc(100% + 16px)',
      bottom: '36px',
      width: '270px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
   },
   railWrapper: {
      position: 'absolute',
      left: 'calc(100% + 24px)',
      bottom: '8px',
      display: 'flex',
      alignItems: 'flex-end',
      gap: '16px',
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
   follow: {
      color: colors.textPrimary,
      fontSize: '14px',
      fontWeight: 600,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
   },
   location: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      color: colors.textPrimary,
      fontSize: '13px',
   },
   caption: {
      color: colors.textPrimary,
      fontSize: '14px',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
   },
});
