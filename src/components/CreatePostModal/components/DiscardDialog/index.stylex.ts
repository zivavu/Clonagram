import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   overlay: {
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 200,
      borderRadius: '24px',
   },
   card: {
      width: 'min(560px, 90vw)',
      backgroundColor: colors.bgBubble,
      borderRadius: radius.lg,
      position: 'absolute',
      top: '32%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 201,
   },
   title: {
      fontSize: '20px',
      fontWeight: 400,
      color: colors.textPrimary,
      textAlign: 'center',
      padding: '32px 24px 0',
   },
   subtitle: {
      fontSize: '14px',
      color: colors.textSecondary,
      textAlign: 'center',
      padding: '8px 24px 24px',
   },
   button: {
      width: '100%',
      padding: '16px',
      fontSize: '14px',
      color: colors.textPrimary,
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
      borderTopColor: colors.elevatedSeparator,
   },
   danger: {
      color: colors.danger,
      fontWeight: 700,
   },
});
