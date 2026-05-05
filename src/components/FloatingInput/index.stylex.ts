import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   wrapper: {
      position: 'relative',
      width: '100%',
   },
   input: {
      width: '100%',
      height: '56px',
      paddingTop: '18px',
      paddingBottom: '6px',
      paddingLeft: '12px',
      paddingRight: '12px',
      fontSize: '14px',
      color: colors.textPrimary,
      backgroundColor: colors.bgSecondary,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: colors.border,
      borderRadius: radius.lg,
      transition: 'border-color 0.15s ease',
   },
   inputFocused: {
      borderColor: colors.accent,
   },
   label: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '16px',
      fontWeight: '400',
      color: colors.textSecondary,
      pointerEvents: 'none',
      transition: 'top 0.15s ease, font-size 0.15s ease, transform 0.15s ease, color 0.15s ease',
   },
   labelFloated: {
      top: '6px',
      transform: 'translateY(0)',
      fontSize: '12px',
   },
   labelFocused: {
      color: colors.accent,
   },
});
