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
   toast: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      color: 'white',
      padding: '12px 24px',
      borderRadius: radius.lg,
      fontSize: '14px',
      fontWeight: 500,
      zIndex: 1000,
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
   },
});
