import * as stylex from '@stylexjs/stylex';
import CarouselArrow from '@/src/components/CarouselArrow';
import { styles } from './index.stylex';

interface PreviewArrowsProps {
   currentIndex: number;
   total: number;
   onSelectIndex: (index: number) => void;
}

export default function PreviewArrows({ currentIndex, total, onSelectIndex }: PreviewArrowsProps) {
   if (total <= 1) return null;
   return (
      <>
         {currentIndex > 0 && (
            <div {...stylex.props(styles.arrow, styles.left)}>
               <CarouselArrow direction="left" onClick={() => onSelectIndex(currentIndex - 1)} />
            </div>
         )}
         {currentIndex < total - 1 && (
            <div {...stylex.props(styles.arrow, styles.right)}>
               <CarouselArrow direction="right" onClick={() => onSelectIndex(currentIndex + 1)} />
            </div>
         )}
      </>
   );
}
