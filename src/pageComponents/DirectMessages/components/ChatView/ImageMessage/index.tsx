import * as stylex from '@stylexjs/stylex';
import { styles } from './index.stylex';

interface ImageMessageProps {
   src: string;
   onOpen: (src: string) => void;
}

export default function ImageMessage({ src, onOpen }: ImageMessageProps) {
   return (
      <button type="button" {...stylex.props(styles.button)} onClick={() => onOpen(src)}>
         {/* biome-ignore lint/performance/noImgElement: Supabase storage URL, Next Image requires domain config */}
         <img src={src} alt="" {...stylex.props(styles.image)} />
      </button>
   );
}
