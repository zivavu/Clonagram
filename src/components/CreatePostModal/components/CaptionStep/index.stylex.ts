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
      overflowX: 'hidden',
      overflowY: 'hidden',
      position: 'relative',
      '@media (max-width: 767px)': {
         flexDirection: 'column',
         overflowY: 'auto',
      },
   },
});
