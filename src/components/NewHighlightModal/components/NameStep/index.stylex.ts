import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      flex: 1,
      padding: '12px 16px',
   },
   input: {
      width: '100%',
      padding: '8px 12px',
      margin: '8px 0',
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.sm,
      border: 'none',
      fontSize: '16px',
      color: colors.textPrimary,
      outline: 'none',
      '::placeholder': {
         color: colors.textMuted,
      },
      ':focus': {
         outline: `1px solid ${colors.border}`,
      },
   },
});
