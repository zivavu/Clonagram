import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   post: {
      width: '100%',
      maxWidth: '468px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
   },
   postHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      paddingLeft: '16px',
   },
   postImageWrapper: {
      width: '100%',
      aspectRatio: '1 / 1',
   },
});
