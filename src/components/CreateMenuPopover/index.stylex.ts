import * as stylex from '@stylexjs/stylex';
import { colors, radius, spacing } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   content: {
      backgroundColor: colors.bgBubble,
      borderRadius: radius.sm,
      padding: `${spacing.xs} 0`,
      minWidth: '210px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
      outline: 'none',
      overflow: 'hidden',
   },
   item: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: `10px ${spacing.md}`,
      fontSize: '16px',
      color: colors.textPrimary,
      background: 'none',
      border: 'none',
      textAlign: 'left',
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
});
