import * as stylex from '@stylexjs/stylex';
import { radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      borderRadius: radius.full,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      boxShadow: '0 0 4px 1px rgba(0, 0, 0, 0.2)',
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
