import * as stylex from '@stylexjs/stylex';
import CarouselArrow from '@/src/components/CarouselArrow';
import { styles } from './index.stylex';

interface PreviewArrowsProps {
   currentIndex: number;
   totalFiles: number;
   onSelectIndex: (index: number) => void;
}

export default function PreviewArrows({
   currentIndex,
   totalFiles,
   onSelectIndex,
}: PreviewArrowsProps) {
   if (totalFiles <= 1) return null;
   return (
      <>
         {currentIndex > 0 && (
            <div {...stylex.props(styles.arrow, styles.left)}>
               <CarouselArrow direction="left" onClick={() => onSelectIndex(currentIndex - 1)} />
            </div>
         )}
         {currentIndex < totalFiles - 1 && (
            <div {...stylex.props(styles.arrow, styles.right)}>
               <CarouselArrow direction="right" onClick={() => onSelectIndex(currentIndex + 1)} />
            </div>
         )}
      </>
   );
}
