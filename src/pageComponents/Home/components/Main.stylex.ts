import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   root: {
      width: '630px',
      flexDirection: 'column',
      gap: '38px',
      display: 'flex',
      position: 'relative',
   },
   postsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '36px',
   },
});
