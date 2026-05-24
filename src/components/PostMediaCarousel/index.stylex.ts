import * as stylex from '@stylexjs/stylex';

export const styles = stylex.create({
   content: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: '95dvh',
      width: '84dvw',
      zIndex: 4,
   },
});
