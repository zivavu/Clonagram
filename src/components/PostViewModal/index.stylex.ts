import * as stylex from '@stylexjs/stylex';
import { radius } from '../../styles/tokens.stylex';

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
      borderRadius: radius.xs,
      height: '95dvh',
      width: '84dvw',
      zIndex: 4,
   },
});
