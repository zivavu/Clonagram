import * as stylex from '@stylexjs/stylex';
import { MdPerson } from 'react-icons/md';
import { styles } from './page.stylex';

export default function ProfilePage() {
   return (
      <div {...stylex.props(styles.container)}>
         <MdPerson style={{ fontSize: 48 }} />
         <h1 {...stylex.props(styles.title)}>Profile</h1>
         <p {...stylex.props(styles.subtitle)}>Coming soon</p>
      </div>
   );
}
