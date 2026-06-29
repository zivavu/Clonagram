import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
   },
   topBar: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 16px',
      paddingRight: 24,
      height: 77,
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: colors.separator,
      '@media (max-width: 1024px)': {
         height: 64,
         paddingRight: 16,
      },
   },
   topBarText: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
   },
   messages: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      padding: '24px 16px',
      '@media (max-width: 1024px)': {
         padding: '16px 12px',
      },
   },
   bubbleSent: {
      alignSelf: 'flex-end',
   },
   bubbleReceived: {
      alignSelf: 'flex-start',
   },
});
