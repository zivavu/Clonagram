import * as stylex from '@stylexjs/stylex';
import { TbCheck, TbRepeat } from 'react-icons/tb';
import { styles } from './index.stylex';

interface RepostIconProps {
   size: number;
   isReposted: boolean;
   color?: string;
}

export default function RepostIcon({ size, isReposted, color }: RepostIconProps) {
   return (
      <span {...stylex.props(styles.wrapper)}>
         <TbRepeat size={size} color={color} />
         {isReposted && (
            <TbCheck
               size={size / 2 - 2}
               strokeWidth={3.5}
               color={color}
               {...stylex.props(styles.checkOverlay)}
            />
         )}
      </span>
   );
}
