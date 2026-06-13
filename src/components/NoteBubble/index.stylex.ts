import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   noteBubble: {
      position: 'absolute',
      top: '-10px',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: colors.bgBubble,
      borderRadius: '14px',
      color: colors.textPrimary,
      overflow: 'visible',
      zIndex: 1,
      textAlign: 'center',
   },
   sm: {
      padding: '8px 12px',
      fontSize: '0.62rem',
      width: '96px',
   },
   md: {
      padding: '8px 14px',
      fontSize: '0.7rem',
      width: '96px',
   },
   text: {
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 3,
      overflow: 'hidden',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
   },

   tailDot: {
      '::after': {
         content: "''",
         position: 'absolute',
         bottom: '-4px',
         left: '14px',
         width: '10px',
         height: '10px',
         borderRadius: '50%',
         backgroundColor: colors.bgBubble,
      },
   },
   clickable: {
      cursor: 'pointer',
   },
   noPointerEvents: {
      pointerEvents: 'none',
   },
});
