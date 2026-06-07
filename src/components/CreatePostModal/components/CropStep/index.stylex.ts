import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      userSelect: 'none',
      position: 'relative',
   },
});
