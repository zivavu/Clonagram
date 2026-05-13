'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';
import { extractVideoFrames, STRIP_FRAMES } from '@/src/utils/extractVideoFrames';
import type { PostMedia } from '../../../../types';
import Toggle from '../../../CaptionStep/components/Toggle';
import TrimStrip from './components/TrimStrip';
import { styles } from './index.stylex';

interface VideoEditPanelProps {
   file: PostMedia;
   videoRef: React.RefObject<HTMLVideoElement | null>;
   onUpdate: (updates: Partial<PostMedia>) => void;
}

export default function VideoEditPanel({ file, videoRef, onUpdate }: VideoEditPanelProps) {
   const [frames, setFrames] = useState<string[]>([]);
   const framesRef = useRef<string[]>([]);
   const containerRef = useRef<HTMLDivElement>(null);
   const [containerWidth, setContainerWidth] = useState(0);
   const [selectorX, setSelectorX] = useState(0);
   const liveVideoRef = useRef<HTMLVideoElement>(null);
   const draggingRef = useRef(false);
   const dragStartXRef = useRef(0);
   const dragStartSelectorXRef = useRef(0);
   const onUpdateRef = useRef(onUpdate);
   const durationRef = useRef(file.duration);
   const coverTimeRef = useRef(file.coverTime);

   onUpdateRef.current = onUpdate;
   durationRef.current = file.duration;
   coverTimeRef.current = file.coverTime;

   useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      const ro = new ResizeObserver(entries => {
         for (const entry of entries) {
            const w = entry.contentRect.width;
            if (w > 0) setContainerWidth(w);
         }
      });
      ro.observe(el);
      return () => ro.disconnect();
   }, []);

   useEffect(() => {
      if (file.frames !== undefined) {
         for (const old of framesRef.current) URL.revokeObjectURL(old);
         framesRef.current = [];
         setFrames(file.frames);
         return;
      }

      let cancelled = false;
      extractVideoFrames(file.preview)
         .then(({ urls, duration }) => {
            if (cancelled) {
               for (const u of urls) URL.revokeObjectURL(u);
               return;
            }
            if (durationRef.current === 0 && duration > 0) {
               onUpdateRef.current({ duration, trimEnd: duration });
            }
            for (const old of framesRef.current) URL.revokeObjectURL(old);
            framesRef.current = urls;
            setFrames(urls);
         })
         .catch(() => {
            if (!cancelled) setFrames([]);
         });
      return () => {
         cancelled = true;
      };
   }, [file.preview, file.frames]);

   useEffect(() => {
      return () => {
         for (const u of framesRef.current) URL.revokeObjectURL(u);
         framesRef.current = [];
      };
   }, []);

   const frameWidth = containerWidth > 0 ? containerWidth / STRIP_FRAMES : 0;
   const maxSelectorX = Math.max(0, containerWidth - frameWidth);

   useEffect(() => {
      if (draggingRef.current || file.duration <= 0 || maxSelectorX <= 0) return;
      const progress = Math.max(0, Math.min(1, file.coverTime / file.duration));
      setSelectorX(progress * maxSelectorX);
   }, [file.coverTime, file.duration, maxSelectorX]);

   const handleVideoReady = () => {
      const video = liveVideoRef.current;
      if (video) video.currentTime = coverTimeRef.current;
   };

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
      if (maxSelectorX > 0 && durationRef.current > 0) {
         const time = (newX / maxSelectorX) * durationRef.current;
         onUpdateRef.current({ coverTime: time });
         if (liveVideoRef.current) {
            const v = liveVideoRef.current as HTMLVideoElement & {
               fastSeek?: (time: number) => void;
            };
            if (v.fastSeek) v.fastSeek(time);
            else v.currentTime = time;
         }
      }
   };

   const handlePointerUp = () => {
      draggingRef.current = false;
      const mainVideo = videoRef.current;
      if (mainVideo?.paused) {
         mainVideo.currentTime = coverTimeRef.current;
      }
   };

   const duration = file.duration || 0;

   return (
      <div {...stylex.props(styles.root)}>
         <div {...stylex.props(styles.section)}>
            <span {...stylex.props(styles.sectionTitle)}>Cover photo</span>
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
                           onLoadedData={handleVideoReady}
                           {...stylex.props(styles.selectorFrame)}
                        />
                     </div>
                  </>
               )}
            </div>
         </div>

         <div {...stylex.props(styles.section)}>
            <span {...stylex.props(styles.sectionTitle)}>Trim</span>
            <TrimStrip
               frames={frames}
               duration={duration}
               trimStart={file.trimStart}
               trimEnd={file.trimEnd}
               videoRef={videoRef}
               onChange={(key, value) => onUpdate({ [key]: value })}
            />
         </div>

         <div {...stylex.props(styles.section, styles.soundSection)}>
            <span {...stylex.props(styles.sectionTitle)}>Sound</span>
            <Toggle checked={!file.muted} onChange={v => onUpdate({ muted: !v })} />
         </div>
      </div>
   );
}
