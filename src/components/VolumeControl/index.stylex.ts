import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   button: {
      display: 'flex',
      color: 'white',
      transition: 'all 0.2s ease-in-out',
      ':hover': {
         scale: 1.05,
      },
   },
   paper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6px 14px',
      borderRadius: radius.full,
      backgroundColor: colors.bgElevated,
      boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
      border: 'none',
      outline: 'none',
      zIndex: 100,
   },
   slider: {
      appearance: 'none',
      width: '88px',
      backgroundColor: colors.bgElevated,
      '::-webkit-slider-runnable-track': {
         backgroundColor: 'rgba(255,255,255,0.28)',
         borderRadius: radius.full,
         height: '3px',
      },
      '::-webkit-slider-thumb': {
         appearance: 'none',
         backgroundColor: 'white',
         width: '14px',
         height: '14px',
         borderRadius: '50%',
         boxShadow: '0 1px 6px rgba(0,0,0,0.45)',
         transition: 'transform 0.15s ease',
         marginTop: '-5.5px',
      },
      '::-moz-range-track': {
         backgroundColor: 'rgba(255,255,255,0.28)',
         borderRadius: radius.full,
         height: '3px',
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
});
