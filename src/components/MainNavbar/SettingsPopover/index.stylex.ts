import * as stylex from '@stylexjs/stylex';
import { colors, radius, spacing } from '../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      backgroundColor: colors.bgBubble,
      borderRadius: radius.md,
      border: `1px solid ${colors.border}`,
      padding: `${spacing.xs} 0`,
      minWidth: '230px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
      overflow: 'hidden',
      outline: 'none',
   },
   item: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      width: '100%',
      padding: `${spacing.sm} ${spacing.md}`,
      fontSize: '14px',
      color: colors.textPrimary,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      ':hover': {
         backgroundColor: colors.buttonHover,
      },
   },
   itemDanger: {
      color: colors.danger,
   },
   separator: {
      height: '1px',
      backgroundColor: colors.separator,
      margin: `${spacing.xs} 0`,
   },
   appearanceRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${spacing.sm} ${spacing.md}`,
   },
   appearanceLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      fontSize: '14px',
      color: colors.textPrimary,
   },
   toggle: {
      position: 'relative',
      width: '36px',
      height: '20px',
      borderRadius: radius.full,
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      transition: 'background 0.2s',
   },
   toggleOn: {
      backgroundColor: colors.accent,
   },
   toggleOff: {
      backgroundColor: colors.textMuted,
   },
   toggleKnob: {
      position: 'absolute',
      top: '2px',
      width: '16px',
      height: '16px',
      borderRadius: radius.full,
      backgroundColor: colors.white,
      transition: 'left 0.2s',
   },
   toggleKnobOn: {
      left: '18px',
   },
   toggleKnobOff: {
      left: '2px',
   },
});
