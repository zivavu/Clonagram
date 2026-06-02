import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   input: {
      width: '100%',
      height: '44px',
      padding: '0 12px',
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: radius.sm,
      color: colors.textPrimary,
      fontSize: '14px',
      boxSizing: 'border-box',
      '::placeholder': {
         color: colors.textMuted,
      },
   },
});
