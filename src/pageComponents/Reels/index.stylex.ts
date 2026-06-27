import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   viewport: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      height: '100dvh',
      width: '100%',
      backgroundColor: colors.bg,
      overflow: 'hidden',
   },
   scroller: {
      height: '100dvh',
      width: '100%',
      overflowY: 'scroll',
      scrollSnapType: 'y mandatory',
      scrollbarWidth: 'none',
      scrollBehavior: 'smooth',
   },
   loading: {
      color: colors.textSecondary,
      fontSize: '14px',
   },
   reelsLabel: {
      display: 'none',
      '@media (max-width: 767px)': {
         display: 'block',
         position: 'fixed',
         top: '16px',
         left: '16px',
         zIndex: 10,
         color: 'white',
         fontSize: '22px',
         fontWeight: 700,
         textShadow: '0 1px 4px rgba(0,0,0,0.5)',
         pointerEvents: 'none',
      },
   },
});
