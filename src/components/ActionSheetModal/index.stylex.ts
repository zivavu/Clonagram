import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   content: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'min(400px, 90dvw)',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.bgBubble,
      borderRadius: radius.xl,
      overflow: 'hidden',
      zIndex: 51,
   },
   header: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      padding: '24px 16px 16px',
   },
   title: {
      fontSize: '1rem',
      fontWeight: 700,
      color: colors.textPrimary,
   },
   description: {
      fontSize: '0.875rem',
      color: colors.textSecondary,
      textAlign: 'center',
   },
   separator: {
      height: '1px',
      backgroundColor: colors.elevatedSeparator,
      flexShrink: 0,
   },
   actionButton: {
      width: '100%',
      padding: '16px',
      fontSize: '0.875rem',
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
      fontWeight: 700,
   },
});
