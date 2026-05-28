import * as stylex from '@stylexjs/stylex';
import { colors, radius, spacing } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      gap: spacing.xl,
      paddingTop: spacing.md,
      paddingBottom: spacing.md,
      overflowX: 'auto',
      width: '100%',
   },
   highlightItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: spacing.sm,
      flexShrink: 0,
   },
   newHighlightButton: {
      width: '77px',
      height: '77px',
      borderRadius: radius.full,
      border: `1px solid ${colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.bg,
   },
   highlightRing: {
      width: '77px',
      height: '77px',
      borderRadius: radius.full,
      padding: '2px',
      background: `linear-gradient(45deg, ${colors.storyGradientStart}, ${colors.storyGradientEnd})`,
   },
   highlightImage: {
      borderRadius: radius.full,
      border: `2px solid ${colors.bg}`,
      objectFit: 'cover',
      width: '73px',
      height: '73px',
   },
   highlightLabel: {
      fontSize: '12px',
      color: colors.textPrimary,
      maxWidth: '77px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
   },
});
