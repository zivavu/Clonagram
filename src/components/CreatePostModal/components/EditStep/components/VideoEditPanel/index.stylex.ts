import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../../../styles/tokens.stylex';

export const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      padding: '16px',
      overflowY: 'auto',
   },
   section: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
   },
   sectionTitle: {
      fontSize: '15px',
      fontWeight: 700,
      color: colors.textPrimary,
   },
   coverContainer: {
      position: 'relative',
      width: '100%',
      height: '100px',
      overflow: 'hidden',
      borderRadius: '4px',
      cursor: 'pointer',
   },
   coverStrip: {
      display: 'flex',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
   },
   coverFrame: {
      height: '100%',
      objectFit: 'cover',
      flexShrink: 0,
      pointerEvents: 'none',
   },
   coverSelector: {
      position: 'absolute',
      top: 0,
      height: '100%',
      overflow: 'hidden',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'white',
      borderRadius: '4px',
      boxShadow: '0 0 0 1px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.4)',
      cursor: 'grab',
      zIndex: 2,
      ':active': {
         cursor: 'grabbing',
      },
   },
   selectorFrame: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      pointerEvents: 'none',
      display: 'block',
   },
   soundSection: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
   },
});
