import * as stylex from '@stylexjs/stylex';
import { radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   badge: {
      position: 'absolute',
      top: '8px',
      left: '8px',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '4px 8px',
      borderRadius: radius.sm,
      backgroundColor: 'rgb(255, 255, 255)',
      color: 'rgb(0, 0, 0)',
      lineHeight: '1.05',
   },
   day: {
      fontSize: '1rem',
      fontWeight: 700,
   },
   month: {
      fontSize: '0.6875rem',
      fontWeight: 600,
      textTransform: 'uppercase',
   },
   year: {
      fontSize: '0.6875rem',
      fontWeight: 600,
   },
});
