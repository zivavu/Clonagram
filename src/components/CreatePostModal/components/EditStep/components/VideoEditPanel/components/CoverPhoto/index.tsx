'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';
import { useContainerSize } from '../../../../../../hooks/useContainerSize';
import type { PostMedia } from '../../../../../../types';
import { styles } from './index.stylex';

interface CoverPhotoProps {
   file: PostMedia;
   frames: string[];
   videoRef: React.RefObject<HTMLVideoElement | null>;
   onUpdate: (updates: Partial<PostMedia>) => void;
}

export default function CoverPhoto({ file, frames, videoRef, onUpdate }: CoverPhotoProps) {
   const containerRef = useRef<HTMLDivElement>(null);
   const containerSize = useContainerSize(containerRef);
   const liveVideoRef = useRef<HTMLVideoElement>(null);
   const draggingRef = useRef(false);
   const dragStartXRef = useRef(0);
   const dragStartSelectorXRef = useRef(0);
   const [selectorX, setSelectorX] = useState(0);

   const onUpdateRef = useRef(onUpdate);
   const durationRef = useRef(file.duration);
   const coverTimeRef = useRef(file.coverTime);
   onUpdateRef.current = onUpdate;
   durationRef.current = file.duration;
   coverTimeRef.current = file.coverTime;

   const frameWidth = containerSize.w > 0 ? containerSize.w / frames.length : 0;
   const maxSelectorX = Math.max(0, containerSize.w - frameWidth);

   useEffect(() => {
      if (draggingRef.current || file.duration <= 0 || maxSelectorX <= 0) return;
      const progress = Math.max(0, Math.min(1, file.coverTime / file.duration));
      setSelectorX(progress * maxSelectorX);
   }, [file.coverTime, file.duration, maxSelectorX]);

   const handlePointerDown = (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      draggingRef.current = true;
      dragStartXRef.current = e.clientX;
      dragStartSelectorXRef.current = selectorX;
   };

   const handlePointerMove = (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - dragStartXRef.current;
      const newX = Math.max(0, Math.min(maxSelectorX, dragStartSelectorXRef.current + dx));
      setSelectorX(newX);
      if (maxSelectorX <= 0 || durationRef.current <= 0) return;
      const time = (newX / maxSelectorX) * durationRef.current;
      onUpdateRef.current({ coverTime: time });
      const v = liveVideoRef.current as
         | (HTMLVideoElement & { fastSeek?: (t: number) => void })
         | null;
      if (!v) return;
      if (v.fastSeek) v.fastSeek(time);
      else v.currentTime = time;
   };

   const handlePointerUp = () => {
      draggingRef.current = false;
      const mainVideo = videoRef.current;
      if (mainVideo?.paused) mainVideo.currentTime = coverTimeRef.current;
   };

   return (
      <div ref={containerRef} {...stylex.props(styles.coverContainer)}>
         {frameWidth > 0 && frames.length > 0 && (
            <>
               <div {...stylex.props(styles.coverStrip)}>
                  {frames.map((frame, i) => (
                     /* biome-ignore lint/performance/noImgElement: blob thumbnail */
                     <img
                        key={frame}
                        src={frame}
                        alt={`Frame ${i + 1}`}
                        {...stylex.props(styles.coverFrame)}
                        style={{ width: `${frameWidth}px` }}
                     />
                  ))}
               </div>
               <div
                  {...stylex.props(styles.coverSelector)}
                  style={{ left: `${selectorX}px`, width: `${frameWidth}px` }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
               >
                  <video
                     ref={liveVideoRef}
                     src={file.preview}
                     muted
                     playsInline
                     preload="auto"
                     onLoadedData={() => {
                        const v = liveVideoRef.current;
                        if (v) v.currentTime = coverTimeRef.current;
                     }}
                     {...stylex.props(styles.selectorFrame)}
                  />
               </div>
            </>
         )}
      </div>
   );
}
