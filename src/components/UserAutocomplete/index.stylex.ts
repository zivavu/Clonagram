import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   checkbox: {
      width: '22px',
      height: '22px',
      borderRadius: radius.full,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: colors.textSecondary,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'transparent',
   },
   checkboxChecked: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
      color: 'white',
   },
   dismissButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'none',
      border: 'none',
      color: colors.textSecondary,
      padding: '2px',
   },
   doneButton: {
      display: 'block',
      width: '100%',
      padding: '10px',
      borderRadius: radius.md,
      border: 'none',
      backgroundColor: colors.accent,
      color: 'white',
      fontSize: '14px',
      fontWeight: 600,
      ':hover': {
         opacity: 0.9,
      },
   },
});
