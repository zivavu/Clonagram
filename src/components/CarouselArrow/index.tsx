import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

interface CarouselArrowProps {
   direction: 'left' | 'right';
   onClick: () => void;
}

const CARRET_ICON_PATH =
   'M12.005.503a11.5 11.5 0 1 0 11.5 11.5 11.513 11.513 0 0 0-11.5-11.5Zm3.707 12.22-4.5 4.488A1 1 0 0 1 9.8 15.795l3.792-3.783L9.798 8.21a1 1 0 1 1 1.416-1.412l4.5 4.511a1 1 0 0 1-.002 1.414Z';

export default function CarouselArrow({ direction, onClick }: CarouselArrowProps) {
   return (
      <button
         type="button"
         onClick={onClick}
         {...stylex.props(styles.root, direction === 'left' ? styles.left : styles.right)}
      >
         <svg
            aria-label={`${direction} arrow`}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            {...stylex.props(styles.icon, direction === 'left' && styles.iconLeft)}
         >
            <path d={CARRET_ICON_PATH} />
         </svg>
      </button>
   );
}
