import * as stylex from '@stylexjs/stylex';
import { MdFavorite } from 'react-icons/md';
import { styles } from './page.stylex';

export default function NotificationsPage() {
   return (
      <div {...stylex.props(styles.container)}>
         <MdFavorite style={{ fontSize: 48 }} />
         <h1 {...stylex.props(styles.title)}>Notifications</h1>
         <p {...stylex.props(styles.subtitle)}>Coming soon</p>
      </div>
   );
}
