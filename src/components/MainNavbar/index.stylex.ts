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
      zIndex: 3,
      '@media (max-width: 767px)': {
         flexDirection: 'row',
         height: 'auto',
         width: '100%',
         bottom: 0,
         top: 'auto',
         left: 0,
         right: 0,
         padding: '0',
         paddingBottom: 'env(safe-area-inset-bottom, 0px)',
         justifyContent: 'center',
         borderTopStyle: 'solid',
         borderTopColor: colors.border,
         borderTopWidth: '1px',
         ':hover': {
            width: '100%',
         },
      },
   },
   nav: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      '@media (max-width: 767px)': {
         flexDirection: 'row',
         justifyContent: 'space-around',
         alignItems: 'center',
         width: '100%',
         gap: 0,
      },
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
      '@media (max-width: 767px)': {
         flexDirection: 'column',
         alignItems: 'center',
         justifyContent: 'center',
         padding: '8px 0px',
         paddingLeft: 0,
         width: 'min-content',
         gap: '0px',
         borderRadius: 0,
         flex: 1,
         minWidth: 0,
         ':hover': {
            backgroundColor: 'transparent',
         },
      },
   },
   navItemLabel: {
      fontSize: '1rem',
      fontWeight: 400,
      width: '170px',
      textAlign: 'left',
      color: colors.textPrimary,
      display: 'var(--label-display)',
      '@media (max-width: 767px)': {
         display: 'none',
      },
   },
   navItemActive: {
      fontWeight: 600,
   },
   logo: {
      display: 'flex',
      '@media (max-width: 767px)': {
         display: 'none',
      },
   },
   bottomSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      '@media (max-width: 767px)': {
         display: 'none',
      },
   },
   mobileHidden: {
      '@media (max-width: 767px)': {
         display: 'none',
      },
   },
});

export type MainSidebarStyles = typeof styles;
