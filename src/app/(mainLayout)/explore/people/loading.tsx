import * as stylex from '@stylexjs/stylex';
import Skeleton from '@/src/components/Skeleton';
import { styles } from '@/src/pageComponents/Explore/PeoplePage/index.stylex';

const rowStyles = stylex.create({
   row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '8px 16px',
   },
   info: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: 1,
      minWidth: 0,
   },
   names: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
   },
});

const ROW_COUNT = 8;

export default function PeopleLoading() {
   return (
      <div {...stylex.props(styles.page)}>
         <div {...stylex.props(styles.content)}>
            <div {...stylex.props(styles.header)}>
               <span {...stylex.props(styles.headerLink)}>
                  <span {...stylex.props(styles.headerActive)}>Suggested for you</span>
               </span>
               <span {...stylex.props(styles.headerLink)}>
                  <span {...stylex.props(styles.headerInactive)}>More accounts</span>
               </span>
            </div>
            <div {...stylex.props(styles.list)}>
               {Array.from({ length: ROW_COUNT }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders
                  <div key={i} {...stylex.props(rowStyles.row)}>
                     <div {...stylex.props(rowStyles.info)}>
                        <Skeleton width={44} height={44} rounded />
                        <div {...stylex.props(rowStyles.names)}>
                           <Skeleton width={120} height={14} />
                           <Skeleton width={160} height={12} />
                        </div>
                     </div>
                     <Skeleton width={84} height={32} rounded />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
