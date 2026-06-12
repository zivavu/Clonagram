import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   wrapper: {
      position: 'relative',
      width: '100%',
      aspectRatio: '9 / 16',
      overflow: 'hidden',
      backgroundColor: colors.bgSecondary,
      display: 'block',
      transition: 'all 0.15s ease',
      ':hover': {
         opacity: 0.9,
         scale: 1.025,
      },
   },
   selectionCircle: {
      position: 'absolute',
      bottom: '8px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '24px',
      height: '24px',
      borderRadius: radius.full,
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: colors.white,
      backgroundColor: 'transparent',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
   selectionCircleSelected: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
   },
   buttonReset: {
      padding: 0,
      background: 'none',
      border: 'none',
   },
});
