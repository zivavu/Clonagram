import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 19,
   },
   content: {
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: '460px',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px',
      backgroundColor: colors.bg,
      borderRightStyle: 'solid',
      borderRightColor: colors.separator,
      borderRightWidth: 1,
      zIndex: 20,
      outline: 'none',
   },
   header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px 24px 16px',
   },
   title: {
      fontSize: '24px',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   closeButton: {
      position: 'absolute',
      top: '4px',
      right: '4px',
      padding: '8px',
      borderRadius: radius.full,
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },

   searchInputWrapper: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.xxl,
      padding: '10px 16px',
      gap: '8px',
      marginLeft: 12,
      marginRight: 16,
      marginTop: 24,
   },
   searchInput: {
      flex: 1,
      borderStyle: 'none',
      backgroundColor: colors.bgSecondary,
      outline: 'none',
      fontSize: '16px',
      color: colors.textPrimary,

      '::placeholder': {
         color: colors.textSecondary,
      },
   },
   clearButton: {
      display: 'flex',
      alignItems: 'center',
      color: colors.textSecondary,
      padding: '2px',
      borderRadius: radius.full,
      ':hover': {
         color: colors.textPrimary,
      },
   },
   list: {
      flex: 1,
      overflowY: 'auto',
      paddingTop: '8px',
   },
});
