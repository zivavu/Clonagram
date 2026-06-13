import { TbCheck, TbRepeat } from 'react-icons/tb';

interface RepostIconProps {
   size: number;
   isReposted: boolean;
   color?: string;
}

export default function RepostIcon({ size, isReposted, color }: RepostIconProps) {
   return (
      <span style={{ position: 'relative', display: 'flex' }}>
         <TbRepeat size={size} color={color} />
         {isReposted && (
            <TbCheck
               size={size / 2 - 2}
               strokeWidth={3.5}
               color={color}
               style={{ position: 'absolute', inset: 0, margin: 'auto' }}
            />
         )}
      </span>
   );
}
