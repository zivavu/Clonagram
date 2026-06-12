import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      flex: 1,
      padding: '12px 16px',
   },
   input: {
      width: '100%',
      padding: '12px 0',
      backgroundColor: 'transparent',
      border: 'none',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: colors.border,
      fontSize: '16px',
      color: colors.textPrimary,
      outline: 'none',
      '::placeholder': {
         color: colors.textMuted,
      },
   },
});
