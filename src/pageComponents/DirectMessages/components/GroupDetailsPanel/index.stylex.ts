import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      width: '340px',
      height: '100dvh',
      borderLeftWidth: 1,
      borderLeftStyle: 'solid',
      borderLeftColor: colors.separator,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      flexShrink: 0,
   },
   header: {
      padding: '20px 24px 12px',
      fontSize: '1.1rem',
      fontWeight: 700,
      color: colors.textPrimary,
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: colors.separator,
   },
   row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 24px',
      gap: 12,
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: colors.separator,
   },
   rowLabel: {
      fontSize: '0.9rem',
      color: colors.textPrimary,
   },
   changeInput: {
      flex: 1,
      borderWidth: 0,
      borderRadius: radius.sm,
      backgroundColor: colors.bgSecondary,
      fontSize: '0.875rem',
      padding: '6px 10px',
      color: colors.textPrimary,
      outline: 'none',
   },
   changeButton: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.textPrimary,
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.sm,
      padding: '6px 14px',
   },
   sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px 6px',
   },
   sectionTitle: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   addPeopleButton: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.accent,
   },
   memberRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 24px',
      ':hover': {
         backgroundColor: colors.threadHover,
      },
   },
   memberInfo: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
   },
   memberName: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   memberMeta: {
      fontSize: '0.75rem',
      color: colors.textSecondary,
   },
   memberRemoveBtn: {
      fontSize: '0.75rem',
      color: colors.textSecondary,
   },
   dangerButton: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: colors.danger,
      padding: '12px 24px',
      textAlign: 'left',
      width: '100%',
   },
   toggle: {
      width: 44,
      height: 24,
      borderRadius: radius.full,
      position: 'relative',
      border: 'none',
   },
   toggleOn: {
      backgroundColor: colors.accent,
   },
   toggleOff: {
      backgroundColor: colors.textMuted,
   },
   toggleThumb: {
      position: 'absolute',
      top: 3,
      width: 18,
      height: 18,
      borderRadius: radius.full,
      backgroundColor: colors.white,
   },
   toggleThumbOn: {
      left: 23,
   },
   toggleThumbOff: {
      left: 3,
   },
});
