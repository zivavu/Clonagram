import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '64px',
      gap: '16px',
      textAlign: 'center',
      maxWidth: '360px',
      margin: '0 auto',
   },
   title: {
      fontSize: '1.25rem',
      fontWeight: 400,
      color: colors.textPrimary,
   },
   description: {
      fontSize: '0.875rem',
      color: colors.textSecondary,
      lineHeight: '1.5',
   },
});
