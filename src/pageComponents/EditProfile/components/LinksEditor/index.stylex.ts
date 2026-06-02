import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
   },
   linkRow: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
   },
   input: {
      flex: 1,
      height: '44px',
      padding: '0 12px',
      backgroundColor: colors.bgSecondary,
      border: `1px solid ${colors.border}`,
      borderRadius: radius.sm,
      color: colors.textPrimary,
      fontSize: '14px',
      boxSizing: 'border-box',
      '::placeholder': {
         color: colors.textMuted,
      },
   },
   removeBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      borderRadius: radius.full,
      backgroundColor: colors.buttonHover,
      color: colors.textSecondary,
      flexShrink: 0,
   },
   addBtn: {
      alignSelf: 'flex-start',
      fontSize: '14px',
      fontWeight: 600,
      color: colors.accent,
      background: 'none',
      border: 'none',
      padding: '4px 0',
   },
});
