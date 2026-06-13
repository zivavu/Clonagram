import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   content: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      height: 'min(96dvh, 900px)',
      aspectRatio: '9 / 16',
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
         aspectRatio: 'auto',
         borderRadius: 0,
      },
   },
});
