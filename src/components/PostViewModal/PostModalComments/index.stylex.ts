import * as stylex from '@stylexjs/stylex';

import { colors, spacing } from '../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      width: '500px',
      height: '100%',
      backgroundColor: colors.bgBubble,
      borderLeft: `1px solid ${colors.separator}`,
   },
   scrollArea: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      overflowY: 'auto',
      padding: spacing.md,
   },
   postHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      paddingBottom: spacing.md,
      borderBottom: `1px solid ${colors.separator}`,
   },
   postHeaderUsername: {
      fontWeight: 600,
      color: colors.textPrimary,
      fontSize: '14px',
   },
   followButton: {
      color: colors.accentText,
      fontSize: '14px',
      fontWeight: 600,
   },
   moreButton: {
      marginLeft: 'auto',
      color: colors.textPrimary,
   },
   captionRow: {
      display: 'flex',
      gap: spacing.sm,
      paddingTop: spacing.md,
      paddingBottom: spacing.md,
      borderBottom: `1px solid ${colors.separator}`,
   },
   captionContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
   },
   captionTextRow: {
      fontSize: '14px',
      lineHeight: '18px',
      color: colors.textPrimary,
   },
   captionUsername: {
      fontWeight: 600,
   },
   captionText: {
      fontWeight: 400,
   },
   captionTime: {
      fontSize: '12px',
      color: colors.textSecondary,
   },
   commentsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.md,
      paddingTop: spacing.md,
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
   commentMeta: {
      display: 'flex',
      gap: spacing.sm,
      alignItems: 'center',
   },
   commentTime: {
      fontSize: '12px',
      color: colors.textSecondary,
   },
   commentLikes: {
      fontSize: '12px',
      color: colors.textSecondary,
   },
   commentReplyButton: {
      fontSize: '12px',
      color: colors.textSecondary,
      fontWeight: 600,
   },
   commentHeart: {
      color: colors.textSecondary,
      flexShrink: 0,
      paddingTop: '2px',
   },
   commentHeartLiked: {
      color: colors.danger,
   },
   bottomSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.sm,
      padding: `${spacing.md} 0`,
      borderTop: `1px solid ${colors.separator}`,
   },
   actionsBar: {
      display: 'flex',
      alignItems: 'center',
      padding: `0 ${spacing.md}`,
      justifyContent: 'space-between',
   },
   actionsLeft: {
      display: 'flex',
      gap: spacing.md,
      alignItems: 'center',
      color: colors.textPrimary,
   },
   likedByText: {
      fontSize: '14px',
      color: colors.textPrimary,
      padding: `0 ${spacing.md}`,
   },
   postTime: {
      fontSize: '10px',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: '0.2px',
      padding: `0 ${spacing.md}`,
   },
   commentInputRow: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      padding: `${spacing.md} ${spacing.md} 0`,
      borderTopStyle: 'solid',
      borderTopColor: colors.elevatedSeparator,
      borderTopWidth: '1px',
   },
   emojiButton: {
      color: colors.textPrimary,
      flexShrink: 0,
   },
   commentInput: {
      flex: 1,
      backgroundColor: 'transparent',
      fontSize: '14px',
      color: colors.textPrimary,
      '::placeholder': {
         color: colors.textSecondary,
      },
   },
   postButton: {
      color: colors.accentText,
      fontWeight: 600,
      fontSize: '14px',
      flexShrink: 0,
   },
});
