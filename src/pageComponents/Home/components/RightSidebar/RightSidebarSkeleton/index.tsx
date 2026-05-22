import * as stylex from '@stylexjs/stylex';
import Skeleton from '@/src/components/Skeleton';
import { styles } from './index.stylex';

const SUGGESTION_WIDTHS: [number, number][] = [
   [100, 72],
   [118, 84],
   [92, 60],
   [110, 78],
   [96, 68],
];

export default function RightSidebarSkeleton() {
   return (
      <aside {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.profileCard)}>
            <Skeleton width={44} height={44} rounded />
            <div {...stylex.props(styles.profileInfo)}>
               <Skeleton width={120} height={13} />
               <Skeleton width={80} height={13} />
            </div>
         </div>

         <div {...stylex.props(styles.suggestionsHeader)}>
            <Skeleton width={120} height={13} />
            <Skeleton width={40} height={13} />
         </div>

         <div {...stylex.props(styles.suggestionsList)}>
            {SUGGESTION_WIDTHS.map(([nameWidth, subWidth]) => (
               <div key={nameWidth} {...stylex.props(styles.suggestionItem)}>
                  <Skeleton width={44} height={44} rounded />
                  <div {...stylex.props(styles.suggestionInfo)}>
                     <Skeleton width={nameWidth} height={13} />
                     <Skeleton width={subWidth} height={12} />
                  </div>
               </div>
            ))}
         </div>
      </aside>
   );
}
