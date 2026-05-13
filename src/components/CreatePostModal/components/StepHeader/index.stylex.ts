import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
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
   iconButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      color: colors.textPrimary,
      borderRadius: radius.full,
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   title: {
      fontSize: '16px',
      fontWeight: 700,
      color: colors.textPrimary,
   },
   actionButton: {
      padding: '8px 0',
      color: colors.accentText,
      fontSize: '14px',
      fontWeight: 600,
      ':hover': {
         color: colors.accentTextHover,
      },
   },
   spacer: {
      width: '30px',
   },
});
