import * as stylex from '@stylexjs/stylex';

import { colors, spacing } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   wrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
   },
   commentItem: {
      display: 'flex',
      gap: spacing.sm,
      alignItems: 'flex-start',
   },
   commentAvatar: {
      flexShrink: 0,
   },
   commentContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      flex: 1,
      minWidth: 0,
   },
   commentTextRow: {
      fontSize: '14px',
      lineHeight: '18px',
      color: colors.textPrimary,
      wordBreak: 'break-word',
   },
   commentUsername: {
      fontWeight: 600,
   },
   commentText: {
      fontWeight: 400,
   },
   mentionLink: {
      color: colors.accentText,
      fontWeight: 600,
   },
   commentMeta: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      fontSize: '12px',
      color: colors.textSecondary,
      fontWeight: 600,
   },
   commentReplyButton: {
      fontWeight: 600,
      fontSize: '12px',
      color: colors.textSecondary,
   },
   commentHeart: {
      color: colors.textSecondary,
      flexShrink: 0,
      paddingTop: '2px',
   },
   commentHeartLiked: {
      color: colors.danger,
   },
   viewRepliesButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '12px',
      fontWeight: 700,
      color: colors.textSecondary,
      marginTop: '2px',
   },
   viewRepliesLine: {
      display: 'block',
      width: '24px',
      height: '1px',
      backgroundColor: colors.textSecondary,
      flexShrink: 0,
   },
   repliesContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      paddingLeft: '40px',
   },
   skeletonRow: {
      display: 'flex',
      gap: spacing.sm,
      alignItems: 'flex-start',
   },
   skeletonContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
   },
});
