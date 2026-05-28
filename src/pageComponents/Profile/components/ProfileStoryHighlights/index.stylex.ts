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
      width: '87px',
      height: '87px',
      borderRadius: radius.full,
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.bgSecondary,
      cursor: 'pointer',
      position: 'relative',
   },
   newHighlightInner: {
      position: 'absolute',
      width: '92%',
      height: '92%',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: radius.full,
      borderColor: colors.bg,
      borderWidth: '4px',
      borderStyle: 'solid',
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
