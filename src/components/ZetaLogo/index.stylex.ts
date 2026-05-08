import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
   },
   zetaText: {
      fontSize: '1rem',
      fontWeight: '400',
      color: colors.textPrimary,
   },
});
