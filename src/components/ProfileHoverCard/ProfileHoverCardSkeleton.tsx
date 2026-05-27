import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

export default function ProfileHoverCardSkeleton() {
   return (
      <div {...stylex.props(styles.skeletonRow)}>
         <div {...stylex.props(styles.skeletonAvatar, styles.skeleton)} />
         <div {...stylex.props(styles.skeletonLines)}>
            <div {...stylex.props(styles.skeleton)} style={{ height: 12, width: '60%' }} />
            <div {...stylex.props(styles.skeleton)} style={{ height: 12, width: '40%' }} />
            <div {...stylex.props(styles.skeleton)} style={{ height: 10, width: '50%' }} />
         </div>
      </div>
   );
}
