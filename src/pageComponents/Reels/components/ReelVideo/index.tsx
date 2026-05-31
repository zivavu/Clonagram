'use client';

import type MuxPlayerElement from '@mux/mux-player';
import MuxPlayer from '@mux/mux-player-react';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';
import { styles } from './index.stylex';

interface ReelVideoProps {
   playbackId: string;
}

export default function ReelVideo({ playbackId }: ReelVideoProps) {
   const containerRef = useRef<HTMLDivElement>(null);
   const [isMuted, setIsMuted] = useState(true);
   const [isPlaying, setIsPlaying] = useState(false);
   const [isVisible, setIsVisible] = useState(false);
   const playerRef = useRef<MuxPlayerElement | null>(null);

   useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
         threshold: 0.6,
      });
      observer.observe(el);
      return () => observer.disconnect();
   }, []);

   useEffect(() => {
      const player = playerRef.current;
      if (!player) return;
      if (isVisible) {
         player.play();
         setIsPlaying(true);
      } else {
         player.pause();
         setIsPlaying(false);
      }
   }, [isVisible]);

   function togglePlayPause() {
      const player = playerRef.current;
      if (!player) return;
      if (isPlaying) {
         player.pause();
         setIsPlaying(false);
      } else {
         player.play();
         setIsPlaying(true);
      }
   }

   return (
      <div ref={containerRef} {...stylex.props(styles.container)}>
         <MuxPlayer
            ref={playerRef}
            playbackId={playbackId}
            streamType="on-demand"
            loop
            muted={isMuted}
            autoPlay={false}
            style={{
               width: '100%',
               height: '100%',
               objectFit: 'cover',
               '--bottom-controls': 'none',
            }}
         />
         <button
            type="button"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            {...stylex.props(styles.playPauseOverlay)}
         />
         <button
            type="button"
            onClick={() => setIsMuted(prev => !prev)}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            {...stylex.props(styles.muteButton)}
         >
            {isMuted ? <HiSpeakerXMark size={18} /> : <HiSpeakerWave size={18} />}
         </button>
      </div>
   );
}
