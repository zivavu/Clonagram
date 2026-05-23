import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      minWidth: '650px',
      backgroundColor: colors.bgElevated,
      borderLeftWidth: '2px',
      borderLeftStyle: 'solid',
      borderLeftColor: colors.border,
      padding: '52px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
      '@media (max-width: 1024px)': {
         minWidth: 'unset',
         width: '100%',
         borderLeftWidth: '0',
         padding: '52px 24px',
      },
   },
   titleContainer: {
      fontSize: '1.125rem',
      fontWeight: '500',
      color: colors.textPrimary,
      alignSelf: 'flex-start',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '10px',
   },
   reportContent: {
      marginTop: '22px',
      fontSize: '0.8125rem',
      color: colors.textSecondary,
   },
   reportContentLink: {
      color: colors.accentText,
      fontSize: '0.8125rem',
      fontWeight: '600',
      ':hover': {
         color: colors.accentTextHover,
         textDecoration: 'underline',
      },
   },
   errorAlert: {
      color: colors.danger,
      fontSize: 13,
      marginTop: 8,
      textAlign: 'center',
   },
});
