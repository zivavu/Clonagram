import * as stylex from '@stylexjs/stylex';
import { radius } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   pin: {
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
      zIndex: 5,

   },

   label: {
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginBottom: '4px',
      backgroundColor: 'rgba(0,0,0,0.3)',
      color: 'white',
      borderRadius: radius.sm,
      padding: '4px 16px',
      fontSize: '13px',
      fontWeight: 600,
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
   },
   removeBtn: {
      scale: 0.95,
      display: 'flex',
      transition: 'scale 0.2s ease',
      ':hover': {
         scale: 1.05,
      },
   },
});
