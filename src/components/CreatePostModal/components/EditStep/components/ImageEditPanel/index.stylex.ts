import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   tabs: {
      display: 'flex',
      height: '40px',
      flexShrink: 0,
   },
   tab: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      padding: '14px 0',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: colors.border,
      color: colors.accentTextHover,
      fontSize: '14px',
      fontWeight: 600,
      lineHeight: '24px',
      textTransform: 'capitalize',
   },
   tabInactive: {
      opacity: 0.3,
   },
   strengthRow: {
      padding: '16px',
   },
});
