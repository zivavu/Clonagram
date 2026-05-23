import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   content: {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100dvh',
      width: '100vw',
      zIndex: 4,
   },
});
