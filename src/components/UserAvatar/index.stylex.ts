import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../styles/tokens.stylex';

export const styles = stylex.create({
   image: {
      borderRadius: radius.full,
      flexShrink: 0,
      objectFit: 'cover',
   },
   placeholder: {
      borderRadius: radius.full,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.buttonHover,
      color: colors.textSecondary,
      flexShrink: 0,
   },
   placeholderIcon: {
      width: '60%',
      height: '60%',
   },
   ring: {
      display: 'inline-flex',
      flexShrink: 0,
      borderRadius: radius.full,
      backgroundImage: 'linear-gradient(45deg, #f09433, #bc1888)',
      padding: 2,
      margin: -2,
   },
   ringViewed: {
      backgroundImage: 'none',
      backgroundColor: colors.buttonHover,
   },
   ringInner: {
      display: 'inline-flex',
      borderRadius: radius.full,
      backgroundColor: colors.bg,
      padding: 1,
   },
   link: {
      display: 'inline-flex',
      lineHeight: 0,
   },
});
