import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   content: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      height: 'min(90dvh, 800px)',
      width: 'min(730px, 96vw)',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.bgBubble,
      borderRadius: radius.xl,
      overflow: 'hidden',
      zIndex: 51,
      '@media (max-width: 767px)': {
         top: 0,
         left: 0,
         transform: 'none',
         width: '100vw',
         height: '100dvh',
         borderRadius: 0,
      },
   },
   body: {
      display: 'flex',
      flex: 1,
      overflowX: 'hidden',
      overflowY: 'hidden',
      '@media (max-width: 767px)': {
         flexDirection: 'column',
         overflowY: 'auto',
      },
   },
   preview: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.black,
      overflow: 'hidden',
      position: 'relative',
      '@media (max-width: 767px)': {
         flexShrink: 0,
         height: 'min(280px, 40dvh)',
      },
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
