import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      position: 'relative',
      width: '100%',
      backgroundColor: colors.bg,
      margin: '58px',
      padding: '28px',
      marginTop: '54px',
      paddingTop: '92px',
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
      marginLeft: '48px',
      fontWeight: '350',
      letterSpacing: '-0.03em',
      width: '80%',
      lineHeight: '64.8px',
      color: colors.textPrimary,
      textAlign: 'center',
   },
   imagesContainer: {
      display: 'flex',
      gap: '12px',
      marginTop: '64px',
   },
});

export const imageCardStyles = stylex.create({
   imageCard: {
      borderRadius: radius.xxl,
      overflow: 'hidden',
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
