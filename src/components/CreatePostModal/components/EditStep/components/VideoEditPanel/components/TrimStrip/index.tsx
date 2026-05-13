'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';
import { styles } from './index.stylex';

interface TrimStripProps {
   frames: string[];
   duration: number;
   trimStart: number;
   trimEnd: number;
   videoRef: React.RefObject<HTMLVideoElement | null>;
   onChange: (key: 'trimStart' | 'trimEnd', value: number) => void;
}

function formatTrimTime(seconds: number): string {
   if (seconds < 60) return `${Math.round(seconds)}s`;
   const m = Math.floor(seconds / 60);
   const s = Math.floor(seconds % 60);
   return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TrimStrip({
   frames,
   duration,
   trimStart,
   trimEnd,
   videoRef,
   onChange,
}: TrimStripProps) {
   const containerRef = useRef<HTMLDivElement>(null);
   const playheadRef = useRef<HTMLDivElement>(null);
   const draggingRef = useRef<'trimStart' | 'trimEnd' | null>(null);
   const [containerWidth, setContainerWidth] = useState(0);

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
      let rafId: number;
      const tick = () => {
         const video = videoRef.current;
         const playheadEl = playheadRef.current;
         if (video && playheadEl && duration > 0) {
            playheadEl.style.left = `${(video.currentTime / duration) * 100}%`;
         }
         rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafId);
   }, [duration, videoRef]);

   const getTime = (clientX: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || duration <= 0) return 0;
      return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * duration;
   };

   const handlePointerDown = (e: React.PointerEvent, thumb: 'trimStart' | 'trimEnd') => {
      e.currentTarget.setPointerCapture(e.pointerId);
      draggingRef.current = thumb;
   };

   const handlePointerMove = (e: React.PointerEvent) => {
      const thumb = draggingRef.current;
      if (!thumb) return;
      const time = getTime(e.clientX);
      const clamped =
         thumb === 'trimStart' ? Math.min(time, trimEnd - 0.5) : Math.max(time, trimStart + 0.5);
      onChange(thumb, clamped);
   };

   const handlePointerUp = () => {
      draggingRef.current = null;
   };

   const startPct = duration > 0 ? (trimStart / duration) * 100 : 0;
   const endPct = duration > 0 ? (trimEnd / duration) * 100 : 100;
   const frameWidth = containerWidth > 0 && frames.length > 0 ? containerWidth / frames.length : 0;

   return (
      <div {...stylex.props(styles.wrapper)}>
         <div
            ref={containerRef}
            {...stylex.props(styles.container)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
         >
            <div {...stylex.props(styles.strip)}>
               {frames.map((frame, i) => (
                  /* biome-ignore lint/performance/noImgElement: blob thumbnail */
                  <img
                     key={frame}
                     src={frame}
                     alt={`Frame ${i + 1}`}
                     {...stylex.props(styles.frame)}
                     style={{ width: `${frameWidth}px` }}
                  />
               ))}
            </div>

            <div {...stylex.props(styles.dim)} style={{ left: 0, width: `${startPct}%` }} />
            <div {...stylex.props(styles.dim)} style={{ right: 0, width: `${100 - endPct}%` }} />

            <div
               {...stylex.props(styles.selectedBorder)}
               style={{ left: `${startPct}%`, width: `${endPct - startPct}%` }}
            />

            <div
               {...stylex.props(styles.handle)}
               style={{ left: `${startPct}%` }}
               onPointerDown={e => handlePointerDown(e, 'trimStart')}
            >
               <div {...stylex.props(styles.handleThumb)}>
                  <div {...stylex.props(styles.handleBar)} />
               </div>
            </div>
            <div
               {...stylex.props(styles.handle)}
               style={{ left: `${endPct}%` }}
               onPointerDown={e => handlePointerDown(e, 'trimEnd')}
            >
               <div {...stylex.props(styles.handleThumb, styles.handleThumbEnd)}>
                  <div {...stylex.props(styles.handleBar)} />
               </div>
            </div>

            <div ref={playheadRef} {...stylex.props(styles.playhead)} />
         </div>

         <div {...stylex.props(styles.tickRow)}>
            {frames.map(frame => (
               <div key={frame} {...stylex.props(styles.tickCell)}>
                  <div {...stylex.props(styles.tick)} />
               </div>
            ))}
         </div>

         <div {...stylex.props(styles.labelsRow)}>
            <span {...stylex.props(styles.label)}>0s</span>
            <span {...stylex.props(styles.label)}>{formatTrimTime(duration / 2)}</span>
            <span {...stylex.props(styles.label)}>{formatTrimTime(duration)}</span>
         </div>
      </div>
   );
}
