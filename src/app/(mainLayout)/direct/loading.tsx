import * as stylex from '@stylexjs/stylex';
import Skeleton from '@/src/components/Skeleton';
import { colors } from '../../../styles/tokens.stylex';

const styles = stylex.create({
   root: {
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
      width: '100%',
      marginLeft: 'var(--main-sidebar-width)',
      '@media (max-width: 768px)': {
         marginLeft: 0,
      },
   },
   sidebar: {
      width: '480px',
      flexShrink: 0,
      height: '100dvh',
      borderRightWidth: 1,
      borderRightStyle: 'solid',
      borderRightColor: colors.separator,
      display: 'flex',
      flexDirection: 'column',
      '@media (max-width: 1024px)': {
         width: '100%',
         minWidth: '100%',
         height: 'calc(100dvh - 58px - env(safe-area-inset-bottom, 0px))',
         borderRightWidth: 0,
      },
   },
   topBar: {
      padding: '38px 26px 8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      '@media (max-width: 1024px)': {
         padding: '16px 16px 8px',
      },
   },
   foldersRow: {
      display: 'flex',
      width: '100%',
   },
   folder: {
      width: '100%',
      padding: '14px 12px',
      display: 'flex',
      justifyContent: 'center',
   },
   body: {
      flex: 1,
      overflowY: 'hidden',
      padding: '10px 0',
      display: 'flex',
      flexDirection: 'column',
   },
   search: {
      margin: '0 16px',
   },
   notesRow: {
      display: 'flex',
      flexDirection: 'row',
      flexShrink: 0,
      paddingTop: '52px',
      paddingBottom: '12px',
      paddingLeft: '16px',
      paddingRight: '16px',
      gap: '36px',
   },
   noteItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      flexShrink: 0,
   },
   threadList: {
      display: 'flex',
      flexDirection: 'column',
   },
   threadItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '8px 24px',
   },
   threadContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
   },
   chatContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      height: '100dvh',
      '@media (max-width: 1024px)': {
         display: 'none',
      },
   },
});

export default function DirectLoading() {
   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.sidebar)}>
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
         <div {...stylex.props(styles.chatContainer)}>
            <Skeleton width={96} height={96} rounded />
            <Skeleton width={160} height={20} />
            <Skeleton width={200} height={14} />
         </div>
      </div>
   );
}
