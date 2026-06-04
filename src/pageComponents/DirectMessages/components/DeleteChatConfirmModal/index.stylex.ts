import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(12, 16, 20, 0.7)',
      zIndex: 60,
   },
   content: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'min(90vw, 400px)',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.bgBubble,
      borderRadius: '16px',
      overflow: 'hidden',
      zIndex: 61,
   },
   body: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      padding: '24px 24px 20px',
   },
   title: {
      fontSize: '1rem',
      fontWeight: 700,
      color: colors.textPrimary,
      textAlign: 'center',
   },
   subtitle: {
      fontSize: '0.875rem',
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 1.45,
   },
   divider: {
      height: 1,
      backgroundColor: colors.separator,
      flexShrink: 0,
   },
   actionButton: {
      width: '100%',
      padding: '16px',
      fontSize: '0.9375rem',
      fontWeight: 500,
      color: colors.textPrimary,
      textAlign: 'center',
      background: 'none',
      border: 'none',
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   deleteButton: {
      color: colors.danger,
      fontWeight: 700,
   },
});
