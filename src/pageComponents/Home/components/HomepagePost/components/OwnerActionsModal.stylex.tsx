import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../../styles/tokens.stylex';

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
      width: 'min(90vw, 400px)',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.bgBubble,
      borderRadius: '24px',
      zIndex: 51,
   },

   actionButton: {
      padding: '16px 16px',
      fontSize: '0.875rem',
   },
   separator: {
      height: '1px',
      backgroundColor: colors.elevatedSeparator,
   },
});
