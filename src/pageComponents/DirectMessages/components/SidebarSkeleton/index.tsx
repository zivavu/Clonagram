import * as stylex from '@stylexjs/stylex';
import Skeleton from '@/src/components/Skeleton';
import { styles } from './index.stylex';

export default function SidebarSkeleton() {
   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.topBar)}>
            <Skeleton width={140} height={22} />
            <Skeleton width={24} height={24} />
         </div>
         <div {...stylex.props(styles.foldersRow)}>
            {Array.from({ length: 3 }).map((_, i) => (
               // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
               <div key={i} {...stylex.props(styles.folder)}>
                  <Skeleton width={64} height={14} />
               </div>
            ))}
         </div>
         <div {...stylex.props(styles.body)}>
            <div {...stylex.props(styles.search)}>
               <Skeleton width="100%" height={40} />
            </div>
            <div {...stylex.props(styles.notesRow)}>
               {Array.from({ length: 5 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                  <div key={i} {...stylex.props(styles.noteItem)}>
                     <Skeleton width={74} height={74} rounded />
                     <Skeleton width={50} height={10} />
                  </div>
               ))}
            </div>
            <div {...stylex.props(styles.threadList)}>
               {Array.from({ length: 8 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                  <div key={i} {...stylex.props(styles.threadItem)}>
                     <Skeleton width={56} height={56} rounded />
                     <div {...stylex.props(styles.threadContent)}>
                        <Skeleton width={160} height={14} />
                        <Skeleton width={100} height={12} />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
