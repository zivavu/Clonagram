import * as stylex from '@stylexjs/stylex';
import { colors } from '../../../../styles/tokens.stylex';

const styles = stylex.create({
   container: {
      maxWidth: 935,
      margin: '0 auto',
      padding: '30px 20px 0',
   },
   header: {
      display: 'flex',
      gap: 30,
      marginBottom: 44,
   },
   avatar: {
      width: 150,
      height: 150,
      borderRadius: '50%',
      backgroundColor: colors.border,
      flexShrink: 0,
   },
   info: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
   },
   name: {
      width: '40%',
      height: 24,
      backgroundColor: colors.border,
      borderRadius: 8,
   },
   stats: {
      width: '60%',
      height: 16,
      backgroundColor: colors.border,
      borderRadius: 8,
   },
   grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 4,
   },
   post: {
      aspectRatio: '1',
      backgroundColor: colors.border,
      borderRadius: 4,
   },
});

export default function ProfileLoading() {
   return (
      <div {...stylex.props(styles.container)}>
         <div {...stylex.props(styles.header)}>
            <div {...stylex.props(styles.avatar)} />
            <div {...stylex.props(styles.info)}>
               <div {...stylex.props(styles.name)} />
               <div {...stylex.props(styles.stats)} />
               <div {...stylex.props(styles.name)} style={{ width: '30%' }} />
            </div>
         </div>
         <div {...stylex.props(styles.grid)}>
            {Array.from({ length: 9 }).map((_, i) => (
               <div key={i} {...stylex.props(styles.post)} />
            ))}
         </div>
      </div>
   );
}
