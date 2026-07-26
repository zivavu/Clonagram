import CarouselArrow from '@/src/components/CarouselArrow';
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
      <CarouselArrow
         direction={isLeft ? 'left' : 'right'}
         onClick={onClick}
         inset={false}
         style={[styles.navBtn, styles.navBtnOffset(left), isMoving && styles.navBtnHidden]}
      />
   );
}
