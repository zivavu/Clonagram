import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   page: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '62px',
      paddingBottom: '48px',
      marginLeft: 'calc(var(--main-sidebar-width) / 2)',
      minHeight: '100dvh',
      '@media (max-width: 767px)': {
         marginLeft: 0,
      },
   },
   content: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '1000px',
      paddingLeft: '16px',
      paddingRight: '16px',
   },
   header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '10px',
   },
   headerLink: {
      fontSize: '1rem',
      fontWeight: 700,
   },
   headerActive: {
      color: colors.textPrimary,
   },
   headerInactive: {
      color: colors.textSecondary,
   },
   emptyText: {
      fontSize: '16px',
      color: colors.textSecondary,
      textAlign: 'center',
   },
});
