'use client';

import * as stylex from '@stylexjs/stylex';
import { IoPlay } from 'react-icons/io5';
import { styles } from './index.stylex';

interface VideoPlayOverlayProps {
   isPlaying: boolean;
   onClick: () => void;
}

export default function VideoPlayOverlay({ isPlaying, onClick }: VideoPlayOverlayProps) {
   return (
      <button
         type="button"
         {...stylex.props(styles.overlayBtn)}
         onClick={onClick}
         aria-label={isPlaying ? 'Pause video' : 'Play video'}
      >
         {!isPlaying && (
            <div {...stylex.props(styles.playIcon)}>
               <IoPlay fontSize={80} />
            </div>
         )}
      </button>
   );
}
