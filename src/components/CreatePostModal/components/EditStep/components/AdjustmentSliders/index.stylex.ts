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
   sliderRow: {
      display: 'flex',
      alignItems: 'center',
      height: '36px',
   },
   slider: {
      flex: 1,
      height: '2px',
      WebkitAppearance: 'none',
      appearance: 'none',
      outline: 'none',
      '::-webkit-slider-thumb': {
         WebkitAppearance: 'none',
         width: '16px',
         height: '16px',
         borderRadius: '50%',
         backgroundColor: 'white',
      },
      '::-moz-range-thumb': {
         width: '16px',
         height: '16px',
         borderRadius: '50%',
         backgroundColor: 'white',
         border: 'none',
      },
   },
   value: {
      width: '24px',
      marginLeft: '8px',
      fontSize: '12px',
      lineHeight: '16px',
      color: colors.textSecondary,
      textAlign: 'right',
   },
});
