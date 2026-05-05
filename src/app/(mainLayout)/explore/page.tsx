import * as stylex from '@stylexjs/stylex';
import { MdExplore } from 'react-icons/md';
import { styles } from './page.stylex';

export default function ExplorePage() {
   return (
      <div {...stylex.props(styles.container)}>
         <MdExplore style={{ fontSize: 48 }} />
         <h1 {...stylex.props(styles.title)}>Explore</h1>
         <p {...stylex.props(styles.subtitle)}>Coming soon</p>
      </div>
   );
}
