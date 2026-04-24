import * as stylex from '@stylexjs/stylex';
import { PlusSquare } from 'lucide-react';
import { colors } from '../../styles/tokens.stylex';

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

export default function CreatePage() {
   return (
      <div {...stylex.props(styles.container)}>
         <PlusSquare size={48} strokeWidth={1.5} />
         <h1 {...stylex.props(styles.title)}>Create</h1>
         <p {...stylex.props(styles.subtitle)}>Coming soon</p>
      </div>
   );
}
