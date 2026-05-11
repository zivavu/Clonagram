import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '730px',
      userSelect: 'none',
   },
   header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '4px 16px',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: colors.border,
      backgroundColor: colors.bg,
      flexShrink: 0,
   },
   headerButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      background: 'none',
      border: 'none',
      borderRadius: radius.full,
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   headerTitle: {
      fontSize: '16px',
      fontWeight: 700,
   },
   nextButton: {
      padding: '8px 0',
      background: 'none',
      border: 'none',
      color: colors.accentText,
      fontSize: '14px',
      fontWeight: 600,
      ':hover': {
         color: colors.accentTextHover,
      },
   },
});
