import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

interface SkeletonProps {
   width: number | string;
   height: number | string;
   rounded?: boolean;
}

export default function Skeleton({ width, height, rounded }: SkeletonProps) {
   return (
      <div {...stylex.props(styles.base, rounded && styles.rounded)} style={{ width, height }} />
   );
}
