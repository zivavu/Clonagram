import * as stylex from '@stylexjs/stylex';
import { colors, spacing } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'row',
      gap: spacing.xl,
      paddingBottom: spacing.xl,
      borderBottom: `1px solid ${colors.separator}`,
      width: '100%',
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
      gap: spacing.md,
      flex: 1,
   },
   usernameRow: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
   },
   username: {
      fontSize: '20px',
      fontWeight: 400,
      color: colors.textPrimary,
      margin: 0,
   },
   bioRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.xs,
   },
   fullName: {
      fontSize: '14px',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   bioText: {
      fontSize: '14px',
      color: colors.textPrimary,
      whiteSpace: 'pre-wrap',
   },
   statsRow: {
      display: 'flex',
      gap: spacing.xl,
      fontSize: '16px',
      color: colors.textPrimary,
   },
   stat: {
      fontSize: '16px',
      color: colors.textPrimary,
   },
   buttonsRow: {
      display: 'flex',
      gap: spacing.sm,
   },
   button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '7px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 600,
      border: 'none',
   },
   buttonPrimary: {
      backgroundColor: colors.primaryButton,
      color: colors.white,
   },
   buttonSecondary: {
      backgroundColor: colors.bgSecondary,
      color: colors.textPrimary,
   },
   buttonIcon: {
      backgroundColor: colors.bgSecondary,
      color: colors.textPrimary,
      padding: '7px',
   },
   websiteLink: {
      fontSize: '14px',
      fontWeight: 600,
      color: colors.accentText,
   },
});
