import * as stylex from '@stylexjs/stylex';
import Image from 'next/image';
import { styles } from './index.stylex';

interface ImageMessageProps {
   src: string;
   onOpen: (src: string) => void;
}

export default function ImageMessage({ src, onOpen }: ImageMessageProps) {
   return (
      <button type="button" {...stylex.props(styles.button)} onClick={() => onOpen(src)}>
         <Image src={src} alt="" width={240} height={300} {...stylex.props(styles.image)} />
      </button>
   );
}
