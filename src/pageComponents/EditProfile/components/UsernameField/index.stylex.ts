import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
   },
   inputWrapper: {
      position: 'relative',
   },
   input: {
      width: '100%',
      height: '44px',
      padding: '0 40px 0 12px',
      backgroundColor: colors.bg,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: colors.border,
      borderRadius: radius.sm,
      color: colors.textPrimary,
      fontSize: '14px',
      boxSizing: 'border-box',
   },
   inputError: {
      borderColor: colors.danger,
   },
   inputSuccess: {
      borderColor: colors.success,
   },
   icon: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'none',
   },
   error: {
      fontSize: '12px',
      color: colors.danger,
   },
});
