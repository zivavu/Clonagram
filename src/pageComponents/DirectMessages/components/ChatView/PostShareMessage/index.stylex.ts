import * as stylex from '@stylexjs/stylex';
import { colors, radius } from '../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   card: {
      width: '220px',
      borderRadius: radius.md,
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.bgSecondary,
      overflow: 'hidden',
   },
   cardHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 10px',
   },
   username: {
      fontSize: '13px',
      fontWeight: 600,
      color: colors.textPrimary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
   },
   image: {
      width: '100%',
      height: 'auto',
      display: 'block',
      objectFit: 'cover',
   },
   caption: {
      padding: '8px 10px',
      fontSize: '13px',
      color: colors.textPrimary,
   },
});
