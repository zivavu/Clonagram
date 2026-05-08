import * as stylex from '@stylexjs/stylex';
import { FaCircleChevronRight } from 'react-icons/fa6';
import { styles } from './index.stylex';

interface CarouselArrowProps {
   direction: 'left' | 'right';
   onClick: () => void;
}

export default function CarouselArrow({ direction, onClick }: CarouselArrowProps) {
   return (
      <button
         type="button"
         onClick={onClick}
         {...stylex.props(styles.root, direction === 'left' ? styles.left : styles.right)}
      >
         <FaCircleChevronRight {...stylex.props(styles.icon, direction === 'left' ? styles.iconLeft : undefined)} />
      </button>
   );
}
