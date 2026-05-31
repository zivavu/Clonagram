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
      overflowY: 'scroll',
      scrollSnapType: 'y mandatory',
      scrollbarWidth: 'none',
      scrollBehavior: 'smooth',
   },
   loading: {
      color: colors.textSecondary,
      fontSize: '14px',
   },
});
