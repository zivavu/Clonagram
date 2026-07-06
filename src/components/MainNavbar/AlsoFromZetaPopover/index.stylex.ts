import * as stylex from '@stylexjs/stylex';
import { colors, radius, spacing } from '../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      backgroundColor: colors.bgBubble,
      borderRadius: radius.md,
      border: `1px solid ${colors.border}`,
      padding: `${spacing.xs} 0`,
      minWidth: '230px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
      overflow: 'hidden',
      outline: 'none',
   },
   item: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      width: '100%',
      padding: `${spacing.sm} ${spacing.md}`,
      color: colors.textPrimary,
      textDecoration: 'none',
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   logo: {
      borderRadius: radius.sm,
      flexShrink: 0,
   },
   itemText: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      minWidth: 0,
   },
   itemTitle: {
      fontSize: '14px',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   itemSubtitle: {
      fontSize: '12px',
      color: colors.textSecondary,
   },
});
