import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   group: {
      marginBottom: '32px',
   },
   grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '24px',
   },
});
