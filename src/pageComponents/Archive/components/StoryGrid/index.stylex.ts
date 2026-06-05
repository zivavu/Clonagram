import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   group: {
      marginBottom: '32px',
   },
   monthLabel: {
      fontSize: '1rem',
      fontWeight: 600,
      color: colors.textPrimary,
      marginBottom: '12px',
   },
   grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '3px',
   },
   thumbnail: {
      position: 'relative',
      width: '100%',
      aspectRatio: '1',
      overflow: 'hidden',
      padding: 0,
      backgroundColor: colors.bgSecondary,
      display: 'block',
      transition: 'opacity 0.15s ease',
      ':hover': {
         opacity: 0.85,
      },
   },
});
