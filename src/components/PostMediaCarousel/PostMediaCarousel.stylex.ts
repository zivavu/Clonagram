import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: radius.xs,
      maxWidth: '100%',
      minWidth: '0',
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
      minWidth: '0',
      backgroundColor: colors.black,
      flexShrink: 0,
   },
   columnWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
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
      backgroundColor: colors.white,
   },

   dotsContainerBelow: {
      display: 'flex',
      gap: '4px',
      marginTop: '12px',
   },
   dotBelow: {
      width: '6px',
      height: '6px',
      borderRadius: radius.full,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      transition: 'background-color 0.15s ease',
   },
   dotBelowActive: {
      backgroundColor: colors.black,
   },
});
