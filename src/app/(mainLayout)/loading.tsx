import * as stylex from '@stylexjs/stylex';
import { styles } from './loading.stylex';

export default function MainLayoutLoading() {
   return (
      <div {...stylex.props(styles.container)}>
         <div {...stylex.props(styles.spinner)} />
      </div>
   );
}
