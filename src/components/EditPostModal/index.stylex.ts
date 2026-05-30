import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(12, 16, 20, 0.7)',
      zIndex: 50,
   },
   content: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      height: 'min(90vh, 800px)',
      minWidth: 'min(730px, 90vw)',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.bgBubble,
      borderRadius: radius.xl,
      overflow: 'hidden',
      zIndex: 51,
   },
   body: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
   },
   preview: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.black,
      overflow: 'hidden',
      position: 'relative',
   },
   previewImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
   },
   previewPlaceholder: {
      color: colors.textSecondary,
      fontSize: '14px',
   },
   loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      color: colors.textSecondary,
      fontSize: '14px',
   },
});
