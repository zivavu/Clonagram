import * as stylex from '@stylexjs/stylex';
import { colors, spacing } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.lg,
      paddingBottom: spacing.lg,
      borderBottom: `1px solid ${colors.separator}`,

      '@media (max-width: 960px)': {
         width: '100%',
      },
   },
   mainRow: {
      display: 'flex',
      flexDirection: 'row',
      gap: spacing.lg,
   },
   avatarSection: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      flexShrink: 0,
      width: '150px',
   },
   infoSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.sm,
      flex: 1,
   },
   usernameRow: {
      display: 'flex',
      gap: spacing.sm,
   },
   username: {
      fontSize: '22px',
      fontWeight: 800,
      color: colors.textPrimary,
   },
   bioRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.xs,
   },
   fullName: {
      fontSize: '14px',
      fontWeight: 500,
      color: colors.textPrimary,
   },
   bioText: {
      fontSize: '14px',
      color: colors.textPrimary,
      whiteSpace: 'pre-wrap',
   },
   statsRow: {
      display: 'flex',
      gap: spacing.lg,
      fontSize: '16px',
      color: colors.textPrimary,
   },
   stat: {
      fontSize: '14px',
      color: colors.textPrimary,
   },
   statButton: {
      fontSize: '14px',
      color: colors.textPrimary,
      background: 'none',
      border: 'none',
      padding: 0,
      ':hover': {
         color: colors.textSecondary,
      },
   },
   buttonsRow: {
      display: 'flex',
      gap: spacing.sm,
   },
   button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '44px',
      width: '100%',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 600,
      border: 'none',

      ':hover': {
         backgroundColor: colors.secondaryButtonHover,
      },
   },
   buttonPrimary: {
      backgroundColor: colors.primaryButton,
      color: colors.white,
   },
   buttonSecondary: {
      backgroundColor: colors.secondaryButton,
      color: colors.textPrimary,

      ':hover': {
         backgroundColor: colors.secondaryButtonHover,
      },
   },
   buttonIcon: {
      backgroundColor: colors.secondaryButton,
      color: colors.textPrimary,
      padding: '14px',
   },
   websiteLink: {
      fontSize: '14px',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xs,
   },
});
