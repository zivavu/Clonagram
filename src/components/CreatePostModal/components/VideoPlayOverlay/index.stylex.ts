import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   overlayBtn: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
   playIcon: {
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '22px',
   },
});
