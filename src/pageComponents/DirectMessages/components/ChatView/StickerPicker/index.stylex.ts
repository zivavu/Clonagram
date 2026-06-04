import * as stylex from '@stylexjs/stylex';
import { colors, radius, spacing } from '../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   popover: {
      height: 360,
      width: 340,
      borderRadius: radius.md,
      overflowX: 'hidden',
      backgroundColor: colors.bg,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: colors.separator,
      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
      display: 'flex',
      flexDirection: 'column',
   },
   searchWrapper: {
      padding: spacing.sm,
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: colors.separator,
      flexShrink: 0,
   },
   searchInput: {
      width: '100%',
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: colors.separator,
      backgroundColor: colors.bgSecondary,
      color: colors.textPrimary,
      fontSize: '0.875rem',
      outline: 'none',
   },
   grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: spacing.xs,
      padding: spacing.sm,
      flex: 1,
      overflowY: 'scroll',
   },
   cell: {
      aspectRatio: '1',
      borderRadius: radius.sm,
      cursor: 'pointer',
      backgroundColor: colors.bgSecondary,
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   empty: {
      gridColumn: '1 / -1',
      textAlign: 'center',
      color: colors.textSecondary,
      fontSize: '0.875rem',
      padding: spacing.lg,
   },
});
