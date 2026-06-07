import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      minHeight: '100dvh',
      maxWidth: '1255px',
      padding: '58px 0',
      margin: '0 auto',
      '@media (max-width: 767px)': {
         padding: '24px 0',
      },
   },
   topSection: {
      width: 'min(680px, 90dvw)',
   },
});
