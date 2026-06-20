import * as stylex from '@stylexjs/stylex';
import Skeleton from '@/src/components/Skeleton';
import { colors } from '../../../../styles/tokens.stylex';

const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '1255px',
      padding: '38px 0',
      margin: '0 auto',
      paddingLeft: '120px',
      paddingRight: '100px',

      '@media (max-width: 768px)': {
         paddingLeft: '0',
         paddingRight: '0',
      },
   },
   topSection: {
      width: 'min(680px, 100%)',
      padding: '0 8px',
   },
   header: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '24px',
      paddingBottom: '24px',
      borderBottom: `1px solid ${colors.separator}`,
   },
   avatarWrap: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      flexShrink: 0,
      width: '150px',
      marginTop: '34px',
   },
   infoSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
   },
   statsRow: {
      display: 'flex',
      gap: 24,
   },
   buttonsRow: {
      display: 'flex',
      gap: 8,
      marginTop: 8,
      width: '100%',
   },
   buttonFlex: {
      flex: 1,
   },
   highlights: {
      display: 'flex',
      gap: 24,
      paddingTop: 40,
      paddingBottom: 16,
      width: '100%',
   },
   highlightItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      flexShrink: 0,
   },
   tabs: {
      display: 'flex',
      justifyContent: 'center',
      borderTop: `1px solid ${colors.separator}`,
      width: '100%',
   },
   tab: {
      width: 194,
      paddingTop: 16,
      paddingBottom: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
   grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 3,
      width: '100%',
   },
});

export default function ProfileLoading() {
   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.topSection)}>
            <div {...stylex.props(styles.header)}>
               <div {...stylex.props(styles.avatarWrap)}>
                  <Skeleton width={150} height={150} rounded />
               </div>
               <div {...stylex.props(styles.infoSection)}>
                  <Skeleton width="45%" height={22} />
                  <div {...stylex.props(styles.statsRow)}>
                     <Skeleton width={60} height={14} />
                     <Skeleton width={60} height={14} />
                     <Skeleton width={60} height={14} />
                  </div>
                  <Skeleton width="35%" height={14} />
                  <Skeleton width="70%" height={14} />
               </div>
            </div>
            <div {...stylex.props(styles.buttonsRow)}>
               <div {...stylex.props(styles.buttonFlex)}>
                  <Skeleton width="100%" height={42} />
               </div>
               <div {...stylex.props(styles.buttonFlex)}>
                  <Skeleton width="100%" height={42} />
               </div>
            </div>
            <div {...stylex.props(styles.highlights)}>
               {Array.from({ length: 5 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                  <div key={i} {...stylex.props(styles.highlightItem)}>
                     <Skeleton width={90} height={90} rounded />
                     <Skeleton width={50} height={10} />
                  </div>
               ))}
            </div>
         </div>
         <div {...stylex.props(styles.tabs)}>
            {Array.from({ length: 4 }).map((_, i) => (
               // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
               <div key={i} {...stylex.props(styles.tab)}>
                  <Skeleton width={24} height={24} />
               </div>
            ))}
         </div>
         <div {...stylex.props(styles.grid)}>
            {Array.from({ length: 12 }).map((_, i) => (
               // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
               <div key={i} style={{ aspectRatio: '3 / 4' }}>
                  <Skeleton width="100%" height="100%" />
               </div>
            ))}
         </div>
      </div>
   );
}
