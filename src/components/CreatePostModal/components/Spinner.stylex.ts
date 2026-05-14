import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../styles/tokens.stylex';

export const shared = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
   },
   body: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
   },
   ring: {
      width: '96px',
      height: '96px',
      borderRadius: '50%',
      backgroundImage:
         'conic-gradient(from 0deg, rgb(131, 58, 180), rgb(188, 24, 136) 50%, rgb(240, 148, 51), rgb(131, 58, 180))',
      position: 'relative',
   },
   ringInner: {
      position: 'absolute',
      top: '4px',
      right: '4px',
      bottom: '4px',
      left: '4px',
      borderRadius: '50%',
      backgroundColor: colors.bgBubble,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
});
