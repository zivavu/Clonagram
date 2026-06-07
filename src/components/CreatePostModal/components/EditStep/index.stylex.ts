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
      overflowX: 'hidden',
      overflowY: 'hidden',
      '@media (max-width: 767px)': {
         flexDirection: 'column',
         overflowY: 'auto',
      },
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
      '@media (max-width: 767px)': {
         flexShrink: 0,
         height: 'min(300px, 40dvh)',
      },
   },
   previewImage: {
      flexShrink: 0,
      objectFit: 'cover',
      userSelect: 'none',
      maxWidth: 'none',
   },
   cropContainer: {
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '320px',
      minHeight: '320px',
      flexShrink: 0,
      '@media (max-width: 767px)': {
         minWidth: 0,
         minHeight: 0,
      },
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
      '@media (max-width: 767px)': {
         width: '100%',
         flex: 1,
         flexShrink: 1,
         borderLeftWidth: 0,
         borderTopWidth: '1px',
         borderTopStyle: 'solid',
         borderTopColor: colors.border,
      },
   },
   volumeControl: {
      position: 'absolute',
      top: 12,
      right: 12,
      zIndex: 10,
   },
});
