import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
   },
   body: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
      position: 'relative',
   },
});
