import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   page: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      paddingTop: '32px',
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
      paddingBottom: '20px',
   },
   backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      color: colors.textPrimary,
      fontSize: '1rem',
      fontWeight: 600,
   },
   tabBar: {
      display: 'flex',
      justifyContent: 'center',
   },
   tab: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      paddingTop: '12px',
      paddingBottom: '12px',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: colors.textPrimary,
      marginBottom: '-1px',
   },
   tabText: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '1px',
      color: colors.textPrimary,
   },
   separator: {
      height: '1px',
      backgroundColor: colors.separator,
      marginBottom: '24px',
   },
});
