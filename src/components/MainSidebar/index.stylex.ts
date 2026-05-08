import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      height: '100dvh',
      width: 'var(--main-sidebar-width)',
      padding: '16px',
      justifyContent: 'space-between',
      backgroundColor: colors.bg,
      paddingBottom: '36px',
      gap: '12px',
      '--label-display': 'none',
      ':hover': {
         width: 'auto',
         '--label-display': 'block',
      },
      zIndex: '10',
   },
   nav: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
   },
   navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 0',
      paddingLeft: '8px',
      borderRadius: radius.md,
      color: colors.textPrimary,
      transition: 'background-color 0.15s ease',
      backgroundColor: 'transparent',
      borderWidth: 0,
      cursor: 'pointer',
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   navItemLabel: {
      fontSize: '1rem',
      fontWeight: 400,
      width: '170px',
      textAlign: 'left',
      color: colors.textPrimary,
      display: 'var(--label-display)',
   },
   navItemActive: {
      fontWeight: 600,
   },
});

export type MainSidebarStyles = typeof styles;
