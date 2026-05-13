import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
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
   cropContainer: {
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'crosshair',
   },
   cropContainerVideo: {
      cursor: 'default',
   },
   previewImage: {
      flexShrink: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      userSelect: 'none',
      pointerEvents: 'none',
   },
   tagHint: {
      position: 'absolute',
      top: '12px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0,0,0,0.75)',
      color: 'white',
      borderRadius: radius.lg,
      padding: '6px 14px',
      fontSize: '13px',
      fontWeight: 500,
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      zIndex: 3,
   },
   tagPopper: {
      position: 'absolute',
      zIndex: 100,
      backgroundColor: colors.bgBubble,
      borderRadius: radius.md,
      overflow: 'hidden',
      width: '260px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
   },
});
