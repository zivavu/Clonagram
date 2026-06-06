import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

const SLIDER_TRACK_LENGTH = 80;
const TRACK_PADDING = 8;
const BUTTON_SIZE = 28;
const SLIDER_AREA = SLIDER_TRACK_LENGTH + TRACK_PADDING * 2;
const TOTAL_HEIGHT = BUTTON_SIZE + SLIDER_AREA;

export const styles = stylex.create({
   container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.full,
      border: 'none',
      margin: 0,
      padding: 0,
      minWidth: 0,
      position: 'relative',
      width: `${BUTTON_SIZE}px`,
      height: `${BUTTON_SIZE}px`,
      backgroundColor: 'transparent',
      transition: 'background-color 0.25s ease, box-shadow 0.25s ease',
   },
   containerOpen: {
      boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
   },
   button: {
      display: 'flex',
      color: 'white',
      position: 'relative',
      transition: 'background-color 0.25s ease, transform 0.2s ease-in-out',
      backgroundColor: `rgba(43, 48, 54, 0.5)`,
      padding: '4px',
      borderRadius: radius.full,
      border: 'none',
      outline: 'none',
      margin: 0,
      ':hover': {
         scale: 1.05,
      },
   },
   buttonOpen: {
      backgroundColor: 'transparent',
   },
   sliderWrapper: {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      width: `${BUTTON_SIZE}px`,
      height: 0,
      overflow: 'hidden',
      opacity: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.bgBubble,
      borderRadius: radius.full,
      boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
      transition: 'height 0.25s ease, opacity 0.25s ease',
      pointerEvents: 'none',
      boxSizing: 'border-box',
   },
   sliderWrapperBottom: {
      top: 0,
      paddingTop: `${BUTTON_SIZE}px`,
      paddingBottom: `${TRACK_PADDING}px`,
   },
   sliderWrapperTop: {
      bottom: 0,
      paddingBottom: `${BUTTON_SIZE}px`,
      paddingTop: `${TRACK_PADDING}px`,
   },
   sliderWrapperOpen: {
      opacity: 0.9,
      pointerEvents: 'auto',
   },
   sliderWrapperOpenHeight: {
      height: `${TOTAL_HEIGHT}px`,
   },
   slider: {
      appearance: 'none',
      width: `${SLIDER_TRACK_LENGTH}px`,
      backgroundColor: 'transparent',
      '::-webkit-slider-runnable-track': {
         backgroundColor: 'rgba(255,255,255,0.28)',
         borderRadius: radius.full,
         height: '8px',
      },
      '::-webkit-slider-thumb': {
         appearance: 'none',
         backgroundColor: 'white',
         width: '14px',
         height: '14px',
         borderRadius: '50%',
         boxShadow: '0 1px 6px rgba(0,0,0,0.45)',
         transition: 'transform 0.15s ease',
         marginTop: '-3px',
      },
      '::-moz-range-track': {
         backgroundColor: 'rgba(255,255,255,0.28)',
         borderRadius: radius.full,
         height: '8px',
      },
      '::-moz-range-thumb': {
         backgroundColor: 'white',
         width: '14px',
         height: '14px',
         borderRadius: '50%',
         border: 'none',
         boxShadow: '0 1px 6px rgba(0,0,0,0.45)',
      },
   },
   sliderTop: {
      transform: 'rotate(-90deg)',
   },
   sliderBottom: {
      transform: 'rotate(90deg)',
   },
});
