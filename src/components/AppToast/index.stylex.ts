import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   viewport: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      zIndex: 9999,
      listStyleType: 'none',
      margin: 0,
      padding: 0,
   },
   root: {
      width: '100%',
      backgroundColor: 'rgb(38, 38, 38)',
      padding: '14px 16px',
   },
   description: {
      color: 'rgb(242, 244, 246)',
      fontSize: '14px',
      lineHeight: '1.4',
   },
});
