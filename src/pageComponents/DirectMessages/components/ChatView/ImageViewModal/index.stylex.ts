import * as stylex from '@stylexjs/stylex';
import { radius } from '../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
   },
   image: {
      maxWidth: '90vw',
      maxHeight: '90vh',
      borderRadius: radius.md,
      objectFit: 'contain',
   },
   closeButton: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      fontSize: '2rem',
      color: 'rgb(255,255,255)',
      backgroundColor: 'transparent',
      border: 'none',
      lineHeight: 1,
   },
});
