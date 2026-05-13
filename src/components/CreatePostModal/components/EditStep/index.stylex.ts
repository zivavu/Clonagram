import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
   },
   body: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
   },
   previewSection: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      backgroundColor: colors.bgSecondary,
      overflow: 'hidden',
      userSelect: 'none',
      width: '700px',
   },
   previewImage: {
      flexShrink: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      userSelect: 'none',
   },
   cropContainer: {
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
   videoOverlayBtn: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
   playButton: {
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '22px',
   },
   panel: {
      width: '340px',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      borderLeftWidth: '1px',
      borderLeftStyle: 'solid',
      borderLeftColor: colors.border,
   },
});
