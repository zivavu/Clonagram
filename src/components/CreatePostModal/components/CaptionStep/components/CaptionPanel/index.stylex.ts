import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   panel: {
      width: '340px',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      borderLeftWidth: '1px',
      borderLeftStyle: 'solid',
      borderLeftColor: colors.border,
   },
   captionSection: {
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
   },
   userRow: {
      display: 'flex',
      flexDirection: 'row',
      gap: '8px',
   },
   emojiButton: {
      display: 'flex',
      color: colors.textSecondary,
      padding: '2px',
   },
   textarea: {
      resize: 'none',
      borderStyle: 'none',
      color: colors.textPrimary,
      fontSize: '14px',
      lineHeight: '20px',
      width: '100%',
      '::placeholder': {
         color: colors.textMuted,
      },
   },
   captionRowBottom: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
   },
   charCount: {
      fontSize: '11px',
      color: colors.textMuted,
      textAlign: 'right',
   },
   addRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '12px 16px',
      color: colors.textPrimary,
      textAlign: 'left',
   },
   addRowLabel: {
      fontSize: '14px',
      color: colors.textPrimary,
   },
   collabAvatars: {
      alignItems: 'center',
      flex: 1,
   },
   collabAvatarWrap: {
      borderRadius: radius.full,
      overflow: 'hidden',
      marginRight: '-6px',
   },
   collabCount: {
      fontSize: '13px',
      color: colors.textSecondary,
      marginLeft: '12px',
   },
   sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      userSelect: 'none',
      width: '100%',
      color: colors.textPrimary,
      textAlign: 'left',
   },
   sectionTitle: {
      fontSize: '15px',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   chevron: {
      color: colors.textSecondary,
      transition: 'transform 0.2s',
      fontSize: '20px',
   },
   chevronOpen: {
      transform: 'rotate(180deg)',
   },
   sectionContent: {
      padding: '0 16px 12px',
   },
   shareRow: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 0',
      gap: '10px',
   },
   shareInfo: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '1px',
   },
   shareName: {
      fontSize: '13px',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   shareMeta: {
      fontSize: '12px',
      color: colors.textSecondary,
   },
   accessibilityDesc: {
      fontSize: '12px',
      color: colors.textSecondary,
      lineHeight: '16px',
      marginBottom: '12px',
   },
   altRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px',
   },
   altThumb: {
      width: '44px',
      height: '44px',
      objectFit: 'cover',
      borderRadius: radius.xs,
   },
   altInput: {
      borderStyle: 'none',
      color: colors.textPrimary,
      fontSize: '13px',
      padding: '4px 0',
      '::placeholder': {
         color: colors.textMuted,
      },
   },
   settingRow: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingTop: '12px',
      paddingBottom: '12px',
      gap: '12px',
   },
   settingText: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
   },
   settingTitle: {
      fontSize: '14px',
      fontWeight: 500,
      color: colors.textPrimary,
   },
   settingDesc: {
      fontSize: '11px',
      color: colors.textSecondary,
      lineHeight: '16px',
   },
   settingLink: {
      color: colors.accentText,
   },
});
