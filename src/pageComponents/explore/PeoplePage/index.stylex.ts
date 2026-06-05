import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../styles/tokens.stylex';

export const styles = stylex.create({
   page: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '62px',
      paddingBottom: '48px',
      marginLeft: 'calc(var(--main-sidebar-width) / 2)',
      minHeight: '100dvh',
   },
   content: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '935px',
      paddingLeft: '16px',
      paddingRight: '16px',
   },
   header: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      paddingBottom: '14px',
      borderBottom: `1px solid ${colors.separator}`,
      marginBottom: '8px',
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
   list: {
      display: 'flex',
      flexDirection: 'column',
   },
});
