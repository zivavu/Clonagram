import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '12px 16px',
      background: 'none',
      border: 'none',
      color: colors.textPrimary,
      textAlign: 'left',
   },
   label: {
      fontSize: '14px',
      flex: 1,
   },
   labelPlaceholder: {
      color: colors.textPrimary,
   },
   labelSelected: {
      color: colors.textPrimary,
      fontWeight: 400,
   },
   iconButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'none',
      border: 'none',
      color: colors.textSecondary,
      padding: '2px',
      flexShrink: 0,
   },
   locationItem: {
      display: 'block',
      padding: '12px 16px',
      fontSize: '14px',
      color: colors.textPrimary,
      width: '100%',
   },
});
