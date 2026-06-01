'use client';

import type MuxPlayerElement from '@mux/mux-player';
import MuxPlayer from '@mux/mux-player-react';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/src/store/usePlayerStore';
import VolumeControl from '../../VolumeControl';
import { styles } from './index.stylex';

interface FeedVideoSlideProps {
   playbackId: string;
   isPlaying: boolean;
}

export default function FeedVideoSlide({ playbackId, isPlaying }: FeedVideoSlideProps) {
   const muxPlayerRef = useRef<MuxPlayerElement>(null);
   const { volume } = usePlayerStore();

   useEffect(() => {
      const mediaEl = muxPlayerRef.current?.media;
      if (!mediaEl) return;
      mediaEl.volume = volume;
      mediaEl.muted = volume === 0;
   }, [volume]);

   return (
      <div {...stylex.props(styles.root)}>
         <MuxPlayer
            ref={muxPlayerRef}
            style={{
               width: '100%',
               height: '100%',
               '--bottom-controls': 'none',
               '--media-object-fit': 'cover',
            }}
            playbackId={playbackId}
            muted
            paused={!isPlaying}
         />
         {isPlaying && (
            <div {...stylex.props(styles.controls)}>
               <VolumeControl />
            </div>
         )}
      </div>
   );
}
