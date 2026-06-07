import * as stylex from '@stylexjs/stylex';
import { radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   pin: {
      position: 'absolute',
      transform: 'translate(-50%, 0)',
      zIndex: 5,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
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
      borderBottomColor: 'rgba(0,0,0,0.6)',
   },

   label: {
      backgroundColor: 'rgba(0,0,0,0.6)',
      color: 'white',
      borderRadius: radius.md,
      padding: '8px 12px',
      fontSize: '13px',
      fontWeight: 600,
      whiteSpace: 'nowrap',
      textDecoration: 'none',
   },
});
