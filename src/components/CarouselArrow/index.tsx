import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import { FaCircleChevronRight } from 'react-icons/fa6';
import { styles } from './index.stylex';

interface CarouselArrowProps {
   direction: 'left' | 'right';
   onClick: () => void;
   inset?: boolean;
   style?: StyleXStyles;
}

export default function CarouselArrow({
   direction,
   onClick,
   inset = true,
   style,
}: CarouselArrowProps) {
   return (
      <button
         type="button"
         onClick={onClick}
         aria-label={direction === 'left' ? 'Previous' : 'Next'}
         {...stylex.props(
            styles.root,
            inset && (direction === 'left' ? styles.left : styles.right),
            style,
         )}
      >
         <FaCircleChevronRight
            {...stylex.props(styles.icon, direction === 'left' ? styles.iconLeft : undefined)}
         />
      </button>
   );
}
