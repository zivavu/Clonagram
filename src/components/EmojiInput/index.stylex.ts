import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flex: 1,
   },
   emojiWrapper: {
      position: 'relative',
      display: 'flex',
      flexShrink: 0,
   },
   emojiIcon: {
      fontSize: 20,
      color: colors.textPrimary,
      flexShrink: 0,
      overflow: 'visible',
   },
   pickerWrapper: {
      position: 'absolute',
      bottom: '150%',
      left: 0,
      transform: 'translateX(-50%)',
      zIndex: 100,
      marginBottom: 8,
      borderRadius: radius.sm,
      overflow: 'hidden',
      boxShadow: '0 2px 8px 1px rgba(0, 0, 0, 0.2)',
   },
   inputWrapper: {
      position: 'relative',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
   },
   placeholder: {
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '14px',
      color: colors.textSecondary,
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
   },
   input: {
      flex: 1,
      backgroundColor: 'transparent',
      fontSize: '14px',
      color: colors.textPrimary,
      outline: 'none',
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
   },
});
