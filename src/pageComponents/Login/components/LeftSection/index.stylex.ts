import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      position: 'relative',
      backgroundColor: colors.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      '@media (max-width: 1024px)': {
         display: 'none',
      },
   },
   topSection: {
      margin: '56px 52px 0px',
      padding: '92px 0px 0px',
      textAlign: 'center',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
   },
   clonagramLogo: {
      position: 'absolute',
      top: 0,
      left: 0,
   },
   description: {
      fontSize: '2.65vw',
      fontWeight: '350',
      width: 'min(90%, 700px)',
      display: 'block',
      lineHeight: '1.35',
      color: colors.textPrimary,
      textAlign: 'center',
   },
   imagesContainer: {
      display: 'flex',
      gap: '12px',
      margin: '64px 0px 64px',
   },
});

export const imageCardStyles = stylex.create({
   imageCard: {
      position: 'relative',
      width: '16vw',
      aspectRatio: '13 / 24',
      borderRadius: radius.xxl,
      overflow: 'hidden',
      ':first-child': {
         marginLeft: '-11.9vw',
      },
      ':last-child': {
         marginRight: '-11.9vw',
      },
   },
   imagePlayBarContainer: {
      position: 'absolute',
      top: '24px',
      width: '80%',
      left: '50%',
      transform: 'translateX(-50%)',
      height: '4px',
      backgroundColor: 'rgb(255, 255, 255, 0.3)',
      borderRadius: radius.full,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
   highlightedPart: {
      width: '60%',
      height: '100%',
      backgroundColor: 'rgb(255, 255, 255)',
   },
   dimmedPart: {
      width: '40%',
      height: '100%',
      backgroundColor: 'rgb(255, 255, 255, 0.3)',
   },
   reactionBoxContainer: {
      position: 'absolute',
      bottom: '14px',
      padding: '0 18px',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '18px',
   },
   commentBorder: {
      width: '100%',
      height: '32px',
      borderWidth: '3px',
      borderStyle: 'solid',
      borderColor: '#ffffff',
      borderRadius: radius.full,
   },
});
