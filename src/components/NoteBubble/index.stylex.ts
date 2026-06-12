import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   noteBubble: {
      position: 'absolute',
      top: '-38px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: colors.bgBubble,
      borderRadius: '14px',
      color: colors.textPrimary,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      zIndex: 1,
      border: 'none',
      fontFamily: 'inherit',
      textAlign: 'center',

      '::after': {
         content: "''",
         position: 'absolute',
         top: '100%',
         left: '50%',
         transform: 'translateX(-50%)',
         width: 0,
         height: 0,
         borderLeft: '5px solid transparent',
         borderRight: '5px solid transparent',
         borderTop: `5px solid ${colors.bgBubble}`,
      },
   },
   sm: {
      padding: '5px 10px',
      fontSize: '0.72rem',
      maxWidth: '96px',
   },
   md: {
      padding: '6px 14px',
      fontSize: '0.8rem',
      maxWidth: '140px',
   },
   clickable: {
      cursor: 'pointer',
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   noPointerEvents: {
      pointerEvents: 'none',
   },
});
