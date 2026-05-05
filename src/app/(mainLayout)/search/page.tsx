import * as stylex from '@stylexjs/stylex';
import { MdSearch } from 'react-icons/md';
import { styles } from './page.stylex';

export default function SearchPage() {
   return (
      <div {...stylex.props(styles.container)}>
         <MdSearch style={{ fontSize: 48 }} />
         <h1 {...stylex.props(styles.title)}>Search</h1>
         <p {...stylex.props(styles.subtitle)}>Coming soon</p>
      </div>
   );
}
