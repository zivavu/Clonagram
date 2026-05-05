import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      height: '44px',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      borderRadius: radius.xl,
      fontWeight: 500,
      fontSize: '15px',
      cursor: 'pointer',
      ':disabled': {
         cursor: 'not-allowed',
      },
   },
   transparent: {
      backgroundColor: 'transparent',
      border: 'none',
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   primary: {
      backgroundColor: colors.accent,
      fontSize: '15px',
      ':disabled': {
         color: colors.textSecondary,
         opacity: 0.6,
      },
      ':hover': {
         backgroundColor: colors.accentHover,
      },
   },
   outlined: {
      backgroundColor: 'transparent',
      borderColor: colors.border,
      borderWidth: '1px',
      borderStyle: 'solid',
      color: colors.textPrimary,
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
});
