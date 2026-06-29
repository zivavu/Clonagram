import * as stylex from '@stylexjs/stylex';
import Skeleton from '@/src/components/Skeleton';
import { styles } from './index.stylex';

const bubbles = [
   { side: 'received', width: 180 },
   { side: 'received', width: 120 },
   { side: 'sent', width: 200 },
   { side: 'received', width: 90 },
   { side: 'sent', width: 150 },
] as const;

export default function ChatViewSkeleton() {
   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.topBar)}>
            <Skeleton width={44} height={44} rounded />
            <div {...stylex.props(styles.topBarText)}>
               <Skeleton width={130} height={14} />
               <Skeleton width={80} height={12} />
            </div>
         </div>
         <div {...stylex.props(styles.messages)}>
            {bubbles.map((bubble, i) => (
               <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
                  key={i}
                  {...stylex.props(
                     bubble.side === 'sent' ? styles.bubbleSent : styles.bubbleReceived,
                  )}
               >
                  <Skeleton width={bubble.width} height={36} rounded />
               </div>
            ))}
         </div>
      </div>
   );
}
