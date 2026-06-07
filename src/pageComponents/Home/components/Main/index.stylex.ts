import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   root: {
      width: '630px',
      maxWidth: '100%',
      flexDirection: 'column',
      gap: '38px',
      display: 'flex',
      position: 'relative',

      '@media (max-width: 767px)': {
         width: '100%',
         gap: '24px',
      },
   },
});
