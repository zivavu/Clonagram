import * as stylex from '@stylexjs/stylex';
import ReelsSkeleton from '@/src/pageComponents/Reels/components/ReelsSkeleton';
import { colors } from '../../../styles/tokens.stylex';

const styles = stylex.create({
   viewport: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      height: '100dvh',
      width: '100%',
      backgroundColor: colors.bg,
      overflow: 'hidden',
   },
});

export default function ReelsLoading() {
   return (
      <div {...stylex.props(styles.viewport)}>
         <ReelsSkeleton />
      </div>
   );
}
