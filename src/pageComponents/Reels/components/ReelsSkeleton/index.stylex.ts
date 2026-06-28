import * as stylex from '@stylexjs/stylex';
import { radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   section: {
      height: '100dvh',
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
      gap: '8px',
      '@media (max-width: 767px)': {
         display: 'none',
      },
   },
   userRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
   },
   rail: {
      position: 'absolute',
      left: 'calc(100% + 24px)',
      bottom: '8px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px',
      '@media (max-width: 767px)': {
         display: 'none',
      },
   },
   railItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
   },
});
