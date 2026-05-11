import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
   },
   inputRow: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      gap: '8px',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      borderBottomColor: colors.border,
   },
   header: {
      flexShrink: 0,
      color: colors.textPrimary,
      fontWeight: 600,
      fontSize: '14px',
      whiteSpace: 'nowrap',
   },
   input: {
      flex: 1,
      background: 'none',
      outline: 'none',
      borderStyle: 'none',
      color: colors.textPrimary,
      fontSize: '14px',
      minWidth: 0,
      '::placeholder': {
         color: colors.textMuted,
      },
   },
   rightAction: {
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
   },
   list: {
      listStyle: 'none',
      margin: 0,
      padding: '4px 0',
      maxHeight: '240px',
      overflowY: 'auto',
   },
   listItem: {
      width: '100%',
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   listItemHighlighted: {
      backgroundColor: colors.buttonHover,
   },
   footer: {
      padding: '8px 12px',
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: colors.border,
   },
});
