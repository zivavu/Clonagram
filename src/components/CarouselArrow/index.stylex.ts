import * as stylex from '@stylexjs/stylex';
import { radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      borderRadius: radius.full,
   },
   left: {
      left: '12px',
   },
   right: {
      right: '12px',
   },
   icon: {
      fontSize: '1.5rem',
   },
   iconLeft: {
      transform: 'rotate(180deg)',
   },
});
