import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      borderRadius: radius.full,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      cursor: 'pointer',
      border: 'none',
      padding: 0,
      transition: 'background-color 0.15s ease',
      ':hover': {
         backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
   },
   left: {
      left: '8px',
   },
   right: {
      right: '8px',
   },
   icon: {
      stroke: colors.textPrimary,
      fill: colors.textPrimary,
      strokeWidth: 0.5,
   },
   iconLeft: {
      transform: 'rotate(180deg)',
   },
});
