import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   bubble: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      backgroundColor: colors.accent,
      borderRadius: radius.xl,
      padding: '12px 14px',
      width: '260px',
   },
   playButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderRadius: radius.full,
      backgroundColor: 'rgba(255, 255, 255, 0.22)',
      border: 'none',
      flexShrink: 0,
   },
   waveformArea: {
      flex: 1,
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5px',
      overflow: 'hidden',
   },
   bar: {
      width: '3px',
      borderRadius: '2px',
      flexShrink: 0,
   },
   barPlayed: {
      backgroundColor: 'rgba(255, 255, 255, 1)',
   },
   barUnplayed: {
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
   },
   timer: {
      fontSize: '0.75rem',
      color: 'rgba(255, 255, 255, 0.9)',
      whiteSpace: 'nowrap',
      minWidth: '28px',
      textAlign: 'right',
      flexShrink: 0,
   },
});
