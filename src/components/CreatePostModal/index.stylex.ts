import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   content: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      height: 'min(800px, 90dvh)',
      width: 'min(730px, 96vw)',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.bgBubble,
      borderRadius: '24px',
      overflow: 'hidden',
      zIndex: 51,
      '@media (max-width: 767px)': {
         top: 0,
         left: 0,
         transform: 'none',
         width: '100vw',
         height: '100dvh',
         borderRadius: 0,
      },
   },
   toast: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(40, 40, 40, 0.5)',
      backdropFilter: 'blur(16px)',
      color: 'white',
      padding: '12px 24px',
      borderRadius: radius.lg,
      fontSize: '14px',
      fontWeight: 500,
      zIndex: 52,
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
   },
});
