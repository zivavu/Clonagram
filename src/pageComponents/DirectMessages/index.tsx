import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';

const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'row',
      margin: '0 auto',
      marginLeft: 'var(--main-sidebar-width)',
   },
   recipientsSidebar: {
      width: '474px',
      height: '100dvh',
      borderRight: `1px solid ${colors.border}`,
   },
});

export default function DirectMessagesPage() {
   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.recipientsSidebar)}></div>
      </div>
   );
}
