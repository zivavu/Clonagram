import * as stylex from '@stylexjs/stylex';
import { radius } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   pin: {
      position: 'absolute',
      transform: 'translate(-50%, 0)',
      zIndex: 5,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      touchAction: 'none',
   },

   triangle: {
      width: 0,
      height: 0,
      borderLeftWidth: '6px',
      borderLeftStyle: 'solid',
      borderLeftColor: 'transparent',
      borderRightWidth: '6px',
      borderRightStyle: 'solid',
      borderRightColor: 'transparent',
      borderBottomWidth: '8px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'rgba(0,0,0,0.35)',
   },

   label: {
      backgroundColor: 'rgba(0,0,0,0.35)',
      color: 'white',
      borderRadius: radius.sm,
      padding: '4px 8px 4px 12px',
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
   },

   removeBtnIcon: {
      fontSize: 24,
      scale: 0.9,
      ':hover': {
         scale: 1,
      },
   },
});
