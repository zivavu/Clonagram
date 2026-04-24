import * as stylex from '@stylexjs/stylex';
import { colors } from '../../styles/tokens.stylex';
import LeftSidebar from './components/LeftSidebar';
import Main from './components/Main';
import RightSidebar from './components/RightSidebar';

const styles = stylex.create({
   root: {
      gap: '12px',
      height: '100%',
      backgroundColor: colors.bg,
      display: 'flex',
      flexDirection: 'row',
   },
});

export default function HomePage({ url }: { url: string | null }) {
   return (
      <div {...stylex.props(styles.root)}>
         <LeftSidebar url={url} />
         <Main />
         <RightSidebar />
      </div>
   );
}
