import * as stylex from '@stylexjs/stylex';
import Skeleton from '@/src/components/Skeleton';
import { styles } from './index.stylex';

export default function PostSkeleton() {
   return (
      <div {...stylex.props(styles.post)}>
         <div {...stylex.props(styles.postHeader)}>
            <Skeleton width={32} height={32} rounded />
            <Skeleton width={110} height={12} />
         </div>
         <div {...stylex.props(styles.postImageWrapper)}>
            <Skeleton width="100%" height="100%" />
         </div>
      </div>
   );
}
