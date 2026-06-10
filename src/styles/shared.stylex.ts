import * as stylex from '@stylexjs/stylex';
import { colors } from './tokens.stylex';

export const sharedStyles = stylex.create({
   placeholder: {
      '::placeholder': {
         color: colors.textSecondary,
      },
   },
   placeholderMuted: {
      '::placeholder': {
         color: colors.textMuted,
      },
   },
   placeholderPrimary: {
      '::placeholder': {
         color: colors.textPrimary,
      },
   },
});
