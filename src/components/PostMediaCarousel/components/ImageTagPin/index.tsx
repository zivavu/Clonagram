import * as stylex from '@stylexjs/stylex';
import Link from 'next/link';
import { styles } from './index.stylex';

interface ImageTagPinProps {
   username: string;
   x: number;
   y: number;
}

export default function ImageTagPin({ username, x, y }: ImageTagPinProps) {
   return (
      <div {...stylex.props(styles.pin)} style={{ left: `${x}%`, top: `${y}%` }}>
         <div {...stylex.props(styles.triangle)} />
         <Link
            href={`/profile/${username}`}
            {...stylex.props(styles.label)}
            onClick={e => e.stopPropagation()}
         >
            {username}
         </Link>
      </div>
   );
}
