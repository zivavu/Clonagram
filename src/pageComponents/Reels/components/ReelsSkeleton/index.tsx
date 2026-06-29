import * as stylex from '@stylexjs/stylex';
import Skeleton from '@/src/components/Skeleton';
import { styles } from './index.stylex';

export default function ReelsSkeleton() {
   return (
      <section {...stylex.props(styles.section)}>
         <div {...stylex.props(styles.anchor)}>
            <div {...stylex.props(styles.videoClip)}>
               <Skeleton width="100%" height="100%" />
            </div>
            <div {...stylex.props(styles.info)}>
               <div {...stylex.props(styles.userRow)}>
                  <Skeleton width={32} height={32} rounded />
                  <Skeleton width={120} height={14} />
               </div>
               <Skeleton width="90%" height={14} />
               <Skeleton width="70%" height={14} />
            </div>
            <div {...stylex.props(styles.rail)}>
               {Array.from({ length: 6 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                  <div key={i} {...stylex.props(styles.railItem)}>
                     <Skeleton width={26} height={26} />
                     <Skeleton width={20} height={10} />
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
