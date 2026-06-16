import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   row: {
      display: 'flex',
      justifyContent: 'center',
      padding: '4px 16px',
   },
   text: {
      fontSize: '0.75rem',
      color: colors.textMuted,
   },
});
