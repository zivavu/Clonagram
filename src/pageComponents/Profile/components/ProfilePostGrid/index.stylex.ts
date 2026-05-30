import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
      width: '100%',

      '@media (min-width: 1386px)': {
         gridTemplateColumns: 'repeat(4, 1fr)',
      },
   },
   postContainer: {
      position: 'relative',
      overflow: 'hidden',
      aspectRatio: '3 / 4',
      backgroundColor: colors.bgSecondary,
   },
   overlay: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      opacity: 0,
      transition: 'opacity 0.2s ease',
   },
   overlayVisible: {
      opacity: 1,
   },
   stat: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
   },
   statText: {
      color: colors.white,
      fontSize: '16px',
      fontWeight: 700,
   },
   badge: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
   },
   emptyState: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '80px',
      paddingBottom: '80px',
   },
   emptyText: {
      fontSize: '16px',
      color: colors.textSecondary,
   },
});
