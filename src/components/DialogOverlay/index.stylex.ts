import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   overlay: {
      position: 'fixed',
      inset: 0,
      maxHeight: '100dvh',
      backgroundColor: 'rgba(12, 16, 20, 0.7)',
      zIndex: 4,
   },
});
