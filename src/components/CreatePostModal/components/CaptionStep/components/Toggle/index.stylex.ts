import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   toggle: {
      width: '40px',
      height: '24px',
      borderRadius: radius.full,
      backgroundColor: 'light-dark(rgb(209, 209, 214), rgb(58, 58, 60))',
      border: 'none',
      position: 'relative',
      flexShrink: 0,
      transition: 'background-color 0.2s',
   },
   toggleOn: {
      backgroundColor: 'light-dark(rgb(0, 0, 0), rgb(255, 255, 255))',
   },
   thumb: {
      position: 'absolute',
      width: '20px',
      height: '20px',
      borderRadius: radius.full,
      backgroundColor: colors.bg,
      top: '50%',
      left: '2px',
      transform: 'translateY(-50%)',
      transition: 'left 0.2s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
   },
   thumbOn: {
      left: '18px',
   },
});
