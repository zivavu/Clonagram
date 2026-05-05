import * as stylex from '@stylexjs/stylex';
import { MdBarChart } from 'react-icons/md';
import { styles } from './page.stylex';

export default function DashboardPage() {
   return (
      <div {...stylex.props(styles.container)}>
         <MdBarChart style={{ fontSize: 48 }} />
         <h1 {...stylex.props(styles.title)}>Dashboard</h1>
         <p {...stylex.props(styles.subtitle)}>Coming soon</p>
      </div>
   );
}
