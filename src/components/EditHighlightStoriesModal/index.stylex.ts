import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   content: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: colors.bgBubble,
      borderRadius: radius.xl,
      width: 'min(550px, 90dvw)',
      maxHeight: '80dvh',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 4,
      outline: 'none',
      overflow: 'hidden',
   },
   header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: colors.border,
      position: 'relative',
      flexShrink: 0,
   },
   title: {
      fontSize: '16px',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   iconButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.full,
      background: 'none',
      border: 'none',
      color: colors.textPrimary,
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   closeButton: {
      right: '22px',
   },
   footer: {
      padding: '12px 16px',
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: colors.border,
      flexShrink: 0,
   },
   nextButton: {
      width: '100%',
      padding: '10px',
      backgroundColor: 'transparent',
      border: 'none',
      fontWeight: 600,
      fontSize: '14px',
      color: colors.textPrimary,
      ':disabled': {
         color: colors.textMuted,
      },
   },
});
