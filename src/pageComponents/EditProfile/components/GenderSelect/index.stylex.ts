import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   trigger: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      height: '44px',
      padding: '0 14px',
      backgroundColor: colors.bg,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: colors.border,
      borderRadius: radius.sm,
      color: colors.textPrimary,
      fontSize: '14px',
   },
   triggerText: {
      flex: 1,
      textAlign: 'left',
   },
   chevron: {
      color: colors.textSecondary,
      flexShrink: 0,
   },
   content: {
      backgroundColor: colors.bgBubble,
      borderRadius: radius.sm,
      minWidth: '340px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
      outline: 'none',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
   },
   option: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      backgroundColor: colors.bgBubble,
      color: colors.textPrimary,
      fontSize: '14px',
      cursor: 'pointer',
      ':last-child': {
         borderBottomWidth: '0px',
      },
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   optionActive: {
      backgroundColor: colors.buttonHover,
   },
   optionLabel: {
      flex: 1,
      textAlign: 'left',
   },
   customColumn: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      gap: '8px',
   },
   customRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
   },

   customInput: {
      height: '40px',
      padding: '0 12px',
      backgroundColor: colors.bg,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: colors.border,
      borderRadius: radius.sm,
      color: colors.textPrimary,
      fontSize: '14px',
      outline: 'none',
   },
   radio: {
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: colors.accentFg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
   },
   radioSelected: {
      borderColor: colors.textPrimary,
      backgroundColor: colors.textPrimary,
   },
});
