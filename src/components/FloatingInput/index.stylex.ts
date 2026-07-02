import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

// Autofill fires no input/change event, so the floating label can't see it via
// React state. This no-op animation runs when the input starts matching
// :autofill, firing `animationstart` for JS to detect. `display` (not `opacity`)
// because Chrome optimizes away animations that change nothing rendered.
const onAutoFill = stylex.keyframes({
   from: { display: 'block' },
   to: { display: 'block' },
});

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
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: colors.border,
      borderRadius: radius.lg,
      transition: 'border-color 0.15s ease',
      ':autofill': {
         animationName: onAutoFill,
         animationDuration: '0.001s',
      },
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
   labelError: {
      color: colors.danger,
   },
   inputError: {
      borderColor: colors.danger,
   },
   inputSuccess: {
      borderColor: colors.accent,
   },
   inputWithAdornment: {
      paddingRight: '44px',
   },
   adornment: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'none',
   },
});
