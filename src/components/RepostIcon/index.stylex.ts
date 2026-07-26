import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   wrapper: {
      position: 'relative',
      display: 'flex',
   },
   checkOverlay: {
      position: 'absolute',
      inset: 0,
      margin: 'auto',
   },
});
