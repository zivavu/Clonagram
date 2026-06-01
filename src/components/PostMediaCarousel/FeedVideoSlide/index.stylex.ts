import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   root: {
      position: 'relative',
      width: '100%',
      height: '100%',
   },
   toggleButton: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      zIndex: 2,
   },
   controls: {
      position: 'absolute',
      bottom: '12px',
      right: '12px',
      zIndex: 3,
   },
});
