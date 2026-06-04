import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   wrapper: {
      display: 'flex',
      alignItems: 'center',
      borderRadius: radius.md,
      ':hover': {
         backgroundColor: colors.threadHover,
      },
   },
   wrapperActive: {
      backgroundColor: colors.threadHover,
   },
   link: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 0 8px 24px',
      minWidth: 0,
   },
   unreadDot: {
      width: 8,
      height: 8,
      flexShrink: 0,
      borderRadius: radius.full,
      backgroundColor: colors.accent,
      marginLeft: 'auto',
   },
   rightActions: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      paddingRight: 24,
      paddingLeft: 16,
   },
   muteIndicator: {
      fontSize: '1.1rem',
      color: colors.textSecondary,
   },
   menuTrigger: {
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      color: colors.textSecondary,
      transition: 'opacity 0.15s',
   },
   menuTriggerVisible: {
      opacity: 1,
      pointerEvents: 'auto',
   },
   menuContent: {
      backgroundColor: colors.bgBubble,
      borderRadius: radius.md,
      padding: '4px 0',
      boxShadow: `0 4px 20px rgba(0,0,0,0.35)`,
      minWidth: 200,
      zIndex: 50,
      overflow: 'hidden',
   },
   menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '11px 16px',
      fontSize: '0.875rem',
      color: colors.textPrimary,
      outline: 'none',
      cursor: 'pointer',
      ':hover': {
         backgroundColor: colors.threadHover,
      },
      ':focus': {
         backgroundColor: colors.threadHover,
      },
   },
   menuItemDanger: {
      color: colors.danger,
   },
   menuItemIcon: {
      fontSize: '1.1rem',
      flexShrink: 0,
   },
});
