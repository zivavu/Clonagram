import * as stylex from '@stylexjs/stylex';
import { colors, radius, spacing } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   panel: {
      display: 'flex',
      flexDirection: 'column',
      height: '70dvh',
      width: '320px',
      flexShrink: 0,
      backgroundColor: colors.bgElevated,
      borderRadius: radius.md,
      overflow: 'hidden',
   },
   header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: colors.separator,
   },
   title: {
      fontSize: '16px',
      fontWeight: 700,
      color: colors.textPrimary,
   },
   closeButton: {
      display: 'flex',
      background: 'none',
      border: 'none',
      color: colors.textPrimary,
   },
   spacer: {
      width: '24px',
   },
   body: {
      flex: 1,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.md,
      padding: spacing.md,
   },
   composer: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.md,
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: colors.separator,
   },
   emojiButton: {
      display: 'flex',
      color: colors.textPrimary,
      background: 'none',
      border: 'none',
      flexShrink: 0,
   },
   input: {
      flex: 1,
      backgroundColor: 'transparent',
      fontSize: '14px',
      color: colors.textPrimary,
   },
   postButton: {
      color: colors.accentText,
      fontWeight: 600,
      fontSize: '14px',
      background: 'none',
      border: 'none',
      flexShrink: 0,
   },
});
