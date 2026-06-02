import * as stylex from '@stylexjs/stylex';
import { colors, radius, spacing } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      maxWidth: '600px',
      margin: '0 auto',
      paddingTop: spacing.lg,
      paddingBottom: spacing.lg,
      paddingLeft: spacing.md,
      paddingRight: spacing.md,
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.lg,
   },
   title: {
      fontSize: '20px',
      fontWeight: 700,
      color: colors.textPrimary,
   },
   section: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
   },
   label: {
      fontSize: '14px',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   hint: {
      fontSize: '12px',
      color: colors.textSecondary,
   },
   footerNote: {
      fontSize: '12px',
      color: colors.textSecondary,
   },
   submitButton: {
      width: '100%',
      height: '48px',
      borderRadius: radius.sm,
      backgroundColor: colors.primaryButton,
      color: colors.white,
      fontSize: '16px',
      fontWeight: 600,
      ':disabled': {
         opacity: 0.6,
      },
   },
});
