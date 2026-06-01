'use client';

import type MuxPlayerElement from '@mux/mux-player';
import MuxPlayer from '@mux/mux-player-react';
import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';
import VolumeControl from '@/src/components/VolumeControl';
import { usePlayerStore } from '@/src/store/usePlayerStore';
import { styles } from './index.stylex';

interface ReelVideoProps {
   playbackId: string;
}

export default function ReelVideo({ playbackId }: ReelVideoProps) {
   const containerRef = useRef<HTMLDivElement>(null);
   const [isPlaying, setIsPlaying] = useState(false);
   const [isVisible, setIsVisible] = useState(false);
   const playerRef = useRef<MuxPlayerElement | null>(null);

   const { volume } = usePlayerStore();

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

   useEffect(() => {
      const mediaEl = playerRef.current?.media;
      if (!mediaEl) return;
      mediaEl.volume = volume;
      mediaEl.muted = volume === 0;
   }, [volume]);

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
            disableCookies
            loop
            muted={volume === 0}
            autoPlay={false}
            onError={(e: Event) => {
               const err = (e as CustomEvent)?.detail?.error ?? (e as ErrorEvent)?.error;
               if (err?.name === 'AbortError') return;
            }}
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
         <div {...stylex.props(styles.volumeControl)}>
            <VolumeControl side="bottom" align="end" vertical />
         </div>
      </div>
   );
}
