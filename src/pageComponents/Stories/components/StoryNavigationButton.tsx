import * as stylex from '@stylexjs/stylex';
import { CARRET_ICON_PATH } from '../constants';
import { styles } from '../styles';

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
      <button onClick={onClick} {...stylex.props(styles.navBtn, isMoving && styles.navBtnHidden)} style={{ left }}>
         <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            {...stylex.props(styles.navIcon, isLeft && styles.navIconLeft)}
         >
            <path d={CARRET_ICON_PATH} />
         </svg>
      </button>
   );
}
