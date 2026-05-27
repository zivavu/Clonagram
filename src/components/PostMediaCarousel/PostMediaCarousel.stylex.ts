import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: radius.xs,
   },
   omitRightBorderRadius: {
      borderTopRightRadius: 'unset',
      borderBottomRightRadius: 'unset',
   },
   carouselTrack: {
      display: 'flex',
      height: '100%',
      transition: 'transform 350ms cubic-bezier(0.4, 0, 0.2, 1)',
   },
   carouselSlide: {
      position: 'relative',
      maxWidth: '100%',
      backgroundColor: colors.black,
      flexShrink: 0,
   },

   dotsContainer: {
      position: 'absolute',
      bottom: '12px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '4px',
      zIndex: 2,
   },
   dot: {
      width: '6px',
      height: '6px',
      borderRadius: radius.full,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      transition: 'background-color 0.15s ease',
   },
   dotActive: {
      backgroundColor: colors.accent,
   },
});
