import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   list: {
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '16px',
   },
   row: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      height: '84px',
      paddingRight: '16px',
      paddingLeft: '16px',
   },
   label: {
      fontSize: '16px',
      lineHeight: '20px',
      color: colors.textPrimary,
      textTransform: 'capitalize',
   },
});
