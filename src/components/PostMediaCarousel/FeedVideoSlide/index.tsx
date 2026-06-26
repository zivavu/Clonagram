'use client';

import type MuxPlayerElement from '@mux/mux-player';
import MuxPlayer from '@mux/mux-player-react';
import * as stylex from '@stylexjs/stylex';
import { useRef } from 'react';
import { usePlayerStore } from '@/src/store/usePlayerStore';
import VolumeControl from '../../VolumeControl';
import { styles } from './index.stylex';

interface FeedVideoSlideProps {
   playbackId: string;
   isPlaying: boolean;
   onToggle: () => void;
   onOverlayClick?: () => void;
}

export default function FeedVideoSlide({
   playbackId,
   isPlaying,
   onToggle,
   onOverlayClick,
}: FeedVideoSlideProps) {
   const muxPlayerRef = useRef<MuxPlayerElement>(null);
   const { volume } = usePlayerStore();

   return (
      <div {...stylex.props(styles.root)}>
         <MuxPlayer
            ref={muxPlayerRef}
            disableCookies
            loop
            style={{
               width: '100%',
               height: '100%',
               '--bottom-controls': 'none',
               '--media-object-fit': 'cover',
            }}
            playbackId={playbackId}
            muted={volume === 0}
            volume={volume}
            paused={!isPlaying}
         />
         <button
            type="button"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            onClick={onOverlayClick ?? onToggle}
            {...stylex.props(styles.toggleButton)}
         />
         {
            <div {...stylex.props(styles.controls)}>
               <VolumeControl side="top" />
            </div>
         }
      </div>
   );
}
