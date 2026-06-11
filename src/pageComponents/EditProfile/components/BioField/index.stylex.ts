import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      position: 'relative',
   },
   textarea: {
      width: '100%',
      minHeight: '100px',
      padding: '12px',
      paddingBottom: '28px',
      backgroundColor: colors.bg,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: colors.border,
      borderRadius: radius.sm,
      color: colors.textPrimary,
      fontSize: '14px',
      resize: 'vertical',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
   },
   counter: {
      position: 'absolute',
      bottom: '10px',
      right: '12px',
      fontSize: '12px',
      color: colors.textSecondary,
   },
});
