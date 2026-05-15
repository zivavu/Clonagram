import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100dvh',
      width: '80%',
      margin: '0 auto',
      gap: 16,
      padding: 24,
   },
   heading: {
      fontSize: 24,
      fontWeight: 600,
      color: colors.textPrimary,
   },
   message: {
      color: colors.textSecondary,
      textAlign: 'center',
   },
   button: {
      backgroundColor: colors.primaryButton,
      color: 'white',
      border: 'none',
      borderRadius: 8,
      padding: '10px 24px',
      fontWeight: 600,
      cursor: 'pointer',
   },
   homeLink: {
      color: colors.accentText,
      fontWeight: 600,
      fontSize: 14,
      textDecoration: 'none',
   },
});
