import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   arrow: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
   },
   left: {
      left: '12px',
   },
   right: {
      right: '12px',
   },
});
