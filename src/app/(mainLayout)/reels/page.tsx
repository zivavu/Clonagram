import * as stylex from '@stylexjs/stylex';
import { MdSmartDisplay } from 'react-icons/md';
import { colors } from '../../../styles/tokens.stylex';

const styles = stylex.create({
   container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '16px',
      color: colors.textSecondary,
   },
   title: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: colors.textPrimary,
   },
   subtitle: {
      fontSize: '0.95rem',
      color: colors.textSecondary,
   },
});

export default function ReelsPage() {
   return (
      <div {...stylex.props(styles.container)}>
         <MdSmartDisplay style={{ fontSize: 48 }} />
         <h1 {...stylex.props(styles.title)}>Reels</h1>
         <p {...stylex.props(styles.subtitle)}>Coming soon</p>
      </div>
   );
}
