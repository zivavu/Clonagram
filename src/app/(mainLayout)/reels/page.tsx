import * as stylex from '@stylexjs/stylex';
import { MdSmartDisplay } from 'react-icons/md';
import { styles } from './page.stylex';

export default function ReelsPage() {
   return (
      <div {...stylex.props(styles.container)}>
         <MdSmartDisplay style={{ fontSize: 48 }} />
         <h1 {...stylex.props(styles.title)}>Reels</h1>
         <p {...stylex.props(styles.subtitle)}>Coming soon</p>
      </div>
   );
}
