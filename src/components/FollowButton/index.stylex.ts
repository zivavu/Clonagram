import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   profileBase: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '44px',
      width: '100%',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 600,
      border: 'none',
   },
   profileFollow: {
      backgroundColor: colors.primaryButton,
      color: colors.white,
   },
   profileSecondary: {
      backgroundColor: colors.bgSecondary,
      color: colors.textPrimary,
   },
   sidebarFollow: {
      fontSize: '0.8rem',
      fontWeight: 600,
      color: colors.accent,
      ':hover': {
         color: colors.accentHover,
      },
   },
   sidebarSecondary: {
      fontSize: '0.8rem',
      fontWeight: 600,
      color: colors.textSecondary,
   },
   cardBase: {
      width: '100%',
      margin: '16px',
      padding: '8px 0',
      borderRadius: radius.sm,
      fontWeight: 600,
      fontSize: '0.875rem',
      textAlign: 'center',
      border: 'none',
   },
   cardFollow: {
      backgroundColor: colors.accent,
      color: colors.white,
   },
   cardSecondary: {
      backgroundColor: colors.bgSecondary,
      color: colors.textPrimary,
   },
});
