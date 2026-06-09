import * as stylex from '@stylexjs/stylex';

import { colors, spacing } from '../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      width: '500px',
      flexShrink: 0,
      height: '100%',
      backgroundColor: colors.bgBubble,
      borderLeft: `1px solid ${colors.separator}`,
      '@media (max-width: 767px)': {
         width: '100%',
         height: 'auto',
         flex: 1,
         borderLeftWidth: 0,
         borderTopWidth: '1px',
         borderTopStyle: 'solid',
         borderTopColor: colors.separator,
      },
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
   inlineFollowButton: {
      fontSize: '14px',
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
      gap: '16px',
      paddingTop: spacing.md,
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
   actionButton: {
      transition: 'scale 0.1s ease-in-out',

      ':hover': {
         scale: 1.05,
      },
   },
   likedByText: {
      fontSize: '14px',
      color: colors.textPrimary,
      padding: `0 ${spacing.md}`,
   },
   postTime: {
      fontSize: '12px',
      color: colors.textSecondary,
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
