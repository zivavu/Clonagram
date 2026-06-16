import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },

   modal: {
      backgroundColor: colors.bgElevated,
      borderRadius: radius.lg,
      padding: '32px 28px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      minWidth: 260,
      boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
   },

   callerName: {
      fontSize: '1.1rem',
      fontWeight: 700,
      color: colors.textPrimary,
   },

   callTypeLabel: {
      fontSize: '0.85rem',
      color: colors.textSecondary,
   },

   actions: {
      display: 'flex',
      gap: 16,
      marginTop: 8,
   },

   acceptBtn: {
      backgroundColor: colors.success,
      color: colors.white,
      border: 'none',
      borderRadius: radius.full,
      padding: '10px 28px',
      fontWeight: 600,
      fontSize: '0.9rem',
   },

   declineBtn: {
      backgroundColor: colors.danger,
      color: colors.white,
      border: 'none',
      borderRadius: radius.full,
      padding: '10px 28px',
      fontWeight: 600,
      fontSize: '0.9rem',
   },
});
