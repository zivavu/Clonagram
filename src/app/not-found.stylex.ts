import * as stylex from '@stylexjs/stylex';
import { colors } from '@/src/styles/tokens.stylex';

export const styles = stylex.create({
   container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100dvh',
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
   link: {
      color: colors.accentText,
      fontWeight: 600,
      textDecoration: 'none',
   },
});
