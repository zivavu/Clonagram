import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      position: 'fixed',
      right: '24px',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      zIndex: 2,
      '@media (max-width: 767px)': {
         display: 'none',
      },
   },
   button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '44px',
      height: '44px',
      borderRadius: '9999px',
      border: 'none',
      color: colors.textPrimary,
      backgroundColor: colors.buttonHover,
   },
});
