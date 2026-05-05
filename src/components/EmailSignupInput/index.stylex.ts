import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   wrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginTop: '16px',
   },
   topLabel: {
      fontSize: '1.125rem',
      fontWeight: '500',
      color: colors.textPrimary,
   },
});
