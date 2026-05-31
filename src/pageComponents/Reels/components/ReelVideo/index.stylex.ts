import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   container: {
      position: 'absolute',
      inset: 0,
   },
   video: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
   },
   playPauseOverlay: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      background: 'none',
      border: 'none',
   },
   muteButton: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      borderRadius: '9999px',
      border: 'none',
      color: colors.white,
      backgroundColor: 'rgba(0,0,0,0.5)',
   },
});
