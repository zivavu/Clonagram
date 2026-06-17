import * as stylex from '@stylexjs/stylex';
import { FaChevronRight } from 'react-icons/fa6';
import { styles } from '../../index.stylex';

interface StoryNavigationButtonProps {
   onClick: () => void;
   left: string;
   isMoving: boolean;
   isLeft?: boolean;
}

export default function StoryNavigationButton({
   onClick,
   left,
   isMoving,
   isLeft = false,
}: StoryNavigationButtonProps) {
   return (
      <button
         onClick={onClick}
         {...stylex.props(styles.navBtn, isMoving && styles.navBtnHidden)}
         style={{ left }}
      >
         <FaChevronRight
            aria-label="Story navigation button"
            {...stylex.props(styles.navIcon, isLeft && styles.navIconLeft)}
         />
      </button>
   );
}
