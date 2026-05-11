import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(12, 16, 20, 0.7)',
      zIndex: 50,
   },
   content: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      height: 'min(90vh, 800px)',
      minWidth: 'min(730px, 90vw)',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.bgBubble,
      borderRadius: '24px',
      overflow: 'hidden',
      zIndex: 51,
   },
   discardOverlay: {
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 200,
      borderRadius: '24px',
   },
   discardCard: {
      width: 'min(560px, 90vw)',
      backgroundColor: colors.bgBubble,
      borderRadius: radius.lg,
      position: 'absolute',
      top: '32%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 201,
   },

   discardTitle: {
      fontSize: '20px',
      fontWeight: 400,
      color: colors.textPrimary,
      textAlign: 'center',
      padding: '24px 24px 0',
      paddingTop: '32px'
   },
   discardSubtitle: {
      fontSize: '14px',
      color: colors.textSecondary,
      textAlign: 'center',
      padding: '8px 24px 24px',
   },
   discardButton: {
      width: '100%',
      padding: '16px',
      fontSize: '14px',
      color: colors.textPrimary,
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: colors.elevatedSeparator,
   },
   discardDanger: {
      color: colors.danger,
      fontWeight: 700,
   },
});
