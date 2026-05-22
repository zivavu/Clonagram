import * as stylex from '@stylexjs/stylex';
import HomepageFeed from './components/HomepageFeed';
import StoriesRow from './components/StoriesRow';
import { styles } from './index.stylex';

export default async function Main() {
   return (
      <main {...stylex.props(styles.root)}>
         <StoriesRow />
         <HomepageFeed />
      </main>
   );
}
