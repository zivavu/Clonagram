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
      marginBottom: '16px',
   },
   grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
   },
   thumbnail: {
      position: 'relative',
      width: '100%',
      aspectRatio: '9 / 16',
      overflow: 'hidden',
      backgroundColor: colors.bgSecondary,
      display: 'block',
      transition: 'all 0.15s ease',
      ':hover': {
         opacity: 0.9,
         scale: 1.025,
      },
   },
});
