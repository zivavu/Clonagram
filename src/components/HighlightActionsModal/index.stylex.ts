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
      width: 'min(400px, 90dvw)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 51,
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
      width: '36px',
      height: '36px',
      borderRadius: radius.full,
      background: 'none',
      border: 'none',
      color: colors.textPrimary,
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   closeButton: {
      right: '8px',
   },
   backButton: {
      left: '8px',
   },
   actionButton: {
      width: '100%',
      padding: '16px',
      background: 'none',
      border: 'none',
      fontSize: '14px',
      color: colors.textPrimary,
      textAlign: 'center',
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
      ':disabled': {
         color: colors.textMuted,
      },
   },
   dangerButton: {
      color: colors.danger,
   },
   separator: {
      height: '1px',
      backgroundColor: colors.border,
      flexShrink: 0,
   },
   renameBody: {
      padding: '16px',
   },
   input: {
      width: '100%',
      padding: '10px 12px',
      backgroundColor: colors.bgSecondary,
      borderRadius: radius.sm,
      border: 'none',
      fontSize: '15px',
      color: colors.textPrimary,
      outline: 'none',
      '::placeholder': {
         color: colors.textMuted,
      },
      ':focus': {
         outline: `1px solid ${colors.border}`,
      },
   },
   confirmBody: {
      padding: '24px 16px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      textAlign: 'center',
   },
   confirmTitle: {
      fontSize: '18px',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   confirmDescription: {
      fontSize: '14px',
      color: colors.textSecondary,
      lineHeight: '1.5',
   },
});
